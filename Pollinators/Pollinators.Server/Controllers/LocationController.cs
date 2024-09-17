using Microsoft.AspNetCore.Mvc;
using PollinatorApp.Models;
using PollinatorApp.Services;

namespace PollinatorApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController(LocationStore locationStore) : ControllerBase
    {
        private readonly LocationStore _locationStore = locationStore;

        // POST api/<LocationController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Location location)
        {
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

    }
}