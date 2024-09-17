using Microsoft.AspNetCore.Mvc;
using PollinatorApp.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Pollinators.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILogger _logger;
        public LocationController(ILogger<LocationController> logger)
        {
            this._logger = logger;
        }

        // GET: api/<LocationController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // POST api/<LocationController>
        [HttpPost]
        public void Post([FromBody] Location location)
        {
            _logger.LogInformation("Received JSON {value}", location);
        }

    }
}
