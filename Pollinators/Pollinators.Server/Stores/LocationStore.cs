using Microsoft.Azure.Cosmos;
using PollinatorApp.Models;

namespace PollinatorApp.Services
{
    public class LocationStore(Container container)
    {
        private readonly Container _container = container;

        public async Task AddLocationAsync(Location location)
        {
            await _container.CreateItemAsync(location, new PartitionKey(location.Id));
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
            await _container.UpsertItemAsync(location, new PartitionKey(location.Id));
        }

        public async Task DeleteLocationAsync(string id)
        {
            await _container.DeleteItemAsync<Location>(id, new PartitionKey(id));
        }
    }
}