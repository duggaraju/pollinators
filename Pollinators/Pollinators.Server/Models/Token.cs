using System.Text.Json.Serialization;

namespace Pollinators.Server.Models
{
    public class Token
    {
        [JsonPropertyName("token")]
        public required string TokenValue { get; set; }

        [JsonPropertyName("expiresOn")]
        public DateTimeOffset ExpiresOn { get; set; }
    }
}
