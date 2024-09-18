using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using PollinatorApp.Models;
using PollinatorApp.Services;
using Pollinators.Server.Models;
using System.Text.Json;

namespace PollinatorApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController(
        ILogger<LocationStore> logger, 
        LocationStore locationStore,
        DefaultAzureCredential credential,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration) : ControllerBase
    {
        private readonly LocationStore _locationStore = locationStore;
        private readonly ILogger _logger = logger;
        private readonly DefaultAzureCredential _credential = credential;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IConfiguration _configuration = configuration;

        // POST api/<LocationController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Location location)
        {
            _logger.LogInformation("Adding location: {location}", location);

            var token = HttpContext.Request.Headers["RecaptchaToken"].FirstOrDefault();
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Recaptcha token is required");
            }

            if (!await ValidateRecaptchaToken(token))
            {
                return BadRequest("Invalid Recaptcha token");
            }

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

        private async Task<bool> ValidateRecaptchaToken(string token)
        {
            var client = _httpClientFactory.CreateClient();

            var secret = _configuration["Recaptcha:SecretKey"] ?? throw new InvalidOperationException("Dashboard scope is not configured.");

            var response = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "secret", secret },
                { "response", token }
            }));

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<RecaptchaResponse>();
                _logger.LogInformation("Recaptcha response: {result}", result);

                return (result?.success ?? false) && result?.score > 0.5;
            }

            return false;
        }

        public class RecaptchaResponse
        {
            public bool success { get; set; }
            public double score { get; set; }
            public string action { get; set; } = string.Empty;
        }
    }
}