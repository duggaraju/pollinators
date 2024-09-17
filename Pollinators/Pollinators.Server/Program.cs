using System.Text.Json;
using Azure.Identity;
using Microsoft.Azure.Cosmos;
using PollinatorApp.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CosmosDB configuration
var cosmosEndpointUri = builder.Configuration["CosmosDb:EndpointUri"];
var cosmosPrimaryKey = builder.Configuration["CosmosDb:PrimaryKey"];
var cosmosDatabaseId = builder.Configuration["CosmosDb:DatabaseId"];
var cosmosContainerId = builder.Configuration["CosmosDb:ContainerId"];

// Determine the environment
var environment = builder.Environment.EnvironmentName;

builder.Services.AddSingleton(s =>
{
    var cosmosClient = new CosmosClient(cosmosEndpointUri, new DefaultAzureCredential());
    var container = cosmosClient.GetContainer(cosmosDatabaseId, cosmosContainerId);
    return container;
});

// Register LocationStore service
builder.Services.AddSingleton<LocationStore>();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pollinator Locations API", Version = "v1" });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
