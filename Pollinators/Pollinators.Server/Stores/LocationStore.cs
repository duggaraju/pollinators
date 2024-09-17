using Microsoft.Azure.Cosmos;
using PollinatorApp.Models;

namespace PollinatorApp.Services
{
    public class LocationStore(Container container)
    {
        private readonly Container _container = container;

        public async Task AddLocationAsync(Location location)
        {
            await _container.CreateItemAsync(location, new PartitionKey(location.id));
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