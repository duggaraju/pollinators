using System.Text.Json.Serialization;

namespace PollinatorApp.Models;

public record struct Location
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("typeOfPlant")]
    public required string TypeOfPlant { get; init; }

    [JsonPropertyName("dateOfEntry")]
    public DateTime DateOfEntry { get; init; }

    [JsonPropertyName("latitude")]
    public double Latitude { get; init; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; init; }

    [JsonPropertyName("notes")]
    public required string Notes { get; init; }
}