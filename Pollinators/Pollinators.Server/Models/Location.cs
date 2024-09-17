
using System.Text.Json.Serialization;

namespace PollinatorApp.Models
{
    public class Location
    {
        [JsonPropertyName("id")]
#pragma warning disable IDE1006 // Required lower case id to prevent missing id field errrors
        public required string id { get; set; }
#pragma warning restore IDE1006 // Naming Styles

        [JsonPropertyName("typeOfPlant")]
        public required string TypeOfPlant { get; set; }

        [JsonPropertyName("dateOfEntry")]
        public DateTime DateOfEntry { get; set; }

        [JsonPropertyName("latitude")]
        public required double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public required double Longitude { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }
}