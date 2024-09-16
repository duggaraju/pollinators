using System.Text.Json.Serialization;

namespace PollinatorApp.Models;

public class Location
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("typeOfPlant")]
    public required string TypeOfPlant { get; set; }

    [JsonPropertyName("dateOfEntry")]
    public DateTime DateOfEntry { get; set; }

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("notes")]
    public required string Notes { get; set; }
}