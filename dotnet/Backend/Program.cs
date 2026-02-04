using Microsoft.EntityFrameworkCore;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// BUG: Still hardcoded here instead of using configuration!
// Should be: builder.Configuration.GetConnectionString("DefaultConnection")
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseNpgsql("Host=localhost;Database=fanhub;Username=postgres;Password=postgres"));

// BUG: CORS wide open for all origins - security issue!
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FanHubContext>();
    // BUG: Auto-seeding in production is bad practice!
    SeedData.Initialize(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// BUG: UseHttpsRedirection but we created with --no-https
app.UseHttpsRedirection();

// BUG: CORS applied globally without restrictions
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
