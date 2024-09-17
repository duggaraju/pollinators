using Azure.Core;
using Azure.Identity;
using Microsoft.Azure.Cosmos;
using PollinatorApp.Models;
using Pollinators.Server.Models;

namespace PollinatorApp.Services
{
    public class LocationStore(
        Container container,
        ILogger<LocationStore> logger,
        DefaultAzureCredential credential)
    {
        private readonly ILogger _logger = logger;
        private readonly Container _container = container;
        private readonly DefaultAzureCredential _credential = credential;

        public async Task AddLocationAsync(Location location)
        {
            try
            {
                await _container.CreateItemAsync(location, new PartitionKey(location.id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add to database");
                throw;
            }
        }

        public async Task<Location?> GetLocationAsync(string id)
        {
            try
            {
                ItemResponse<Location> response = await _container.ReadItemAsync<Location>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                _logger.LogError(ex, "Failed to get location");
                return null;
            }
        }

        public async Task<IEnumerable<Location>> GetLocationsInRangeAsync(double latitude, double longitude, double rangeInKm)
        {
            var query = new QueryDefinition(@"
                SELECT * FROM c
                WHERE ST_DISTANCE(
                    {'type': 'Point', 'coordinates': [c.Longitude, c.Latitude]},
                    {'type': 'Point', 'coordinates': [@longitude, @latitude]}
                ) <= @rangeInMeters")
                .WithParameter("@latitude", latitude)
                .WithParameter("@longitude", longitude)
                .WithParameter("@rangeInMeters", rangeInKm * 1000);

            var iterator = _container.GetItemQueryIterator<Location>(query);
            var results = new List<Location>();

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response);
            }

            return results;
        }

        public async Task<Token> GetToken()
        {
            var result = await _credential.GetTokenAsync(new TokenRequestContext(["https://kusto.kusto.windows.net/.default"]));

            return new Token
            {
                TokenValue = result.Token,
                ExpiresOn = result.ExpiresOn
            };
        }

        public async Task<IEnumerable<Location>> GetAllLocationsAsync()
        {
            var query = _container.GetItemQueryIterator<Location>();
            List<Location> results = [];
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            return results;
        }

        public async Task UpdateLocationAsync(Location location)
        {
            await _container.UpsertItemAsync(location, new PartitionKey(location.id));
        }

        public async Task DeleteLocationAsync(string id)
        {
            await _container.DeleteItemAsync<Location>(id, new PartitionKey(id));
        }

    }
}