using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using PollinatorApp.Models;
using PollinatorApp.Services;
using Pollinators.Server.Models;

namespace PollinatorApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController(
        ILogger<LocationStore> logger, 
        LocationStore locationStore,
        DefaultAzureCredential credential) : ControllerBase
    {
        private readonly LocationStore _locationStore = locationStore;
        private readonly ILogger _logger = logger;
        private readonly DefaultAzureCredential _credential = credential;

        // POST api/<LocationController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Location location)
        {
            _logger.LogInformation("Adding location: {location}", location);
            await _locationStore.AddLocationAsync(location);
            return CreatedAtAction(nameof(Get), new { location.id }, location);
        }

        // GET api/<LocationController>/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var location = await _locationStore.GetLocationAsync(id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(location);
        }

        // GET api/<LocationController>/range
        [HttpGet("range")]
        public async Task<IActionResult> GetLocationsInRange(double latitude, double longitude, double rangeInKm)
        {
            var locations = await _locationStore.GetLocationsInRangeAsync(latitude, longitude, rangeInKm);
            return Ok(locations);
        }

        // GET api/<LocationController>/token
        [HttpGet("token")]
        public async Task<IActionResult> GetToken([FromQuery] Scope scope)
        {
            return Ok(await _locationStore.GetToken(scope));
        }
    }
}