using Azure.Identity;
using Microsoft.Azure.Cosmos;
using PollinatorApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CosmosDB configuration
var cosmosEndpointUri = builder.Configuration["CosmosDb:EndpointUri"];
var cosmosDatabaseId = builder.Configuration["CosmosDb:DatabaseId"];
var cosmosContainerId = builder.Configuration["CosmosDb:ContainerId"];

builder.Services.AddSingleton(s =>
{
    var cosmosClient = new CosmosClient(cosmosEndpointUri, new DefaultAzureCredential());
    var database = cosmosClient.CreateDatabaseIfNotExistsAsync(cosmosDatabaseId).Result;
    var container = database.Database.CreateContainerIfNotExistsAsync(cosmosContainerId, "/id").Result;
    return container.Container;
});

builder.Services.AddSingleton<LocationStore>();

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
