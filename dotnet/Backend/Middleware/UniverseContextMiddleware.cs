using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Middleware;

public class UniverseContextMiddleware
{
    private readonly RequestDelegate _next;

    public UniverseContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, FanHubContext dbContext)
    {
        Show? show = null;

        if (context.Request.Headers.TryGetValue("X-Show-Slug", out var showHeader))
        {
            var rawValue = showHeader.ToString().Trim();

            if (!string.IsNullOrWhiteSpace(rawValue))
            {
                if (int.TryParse(rawValue, out var showId))
                {
                    show = await dbContext.Shows.FindAsync(showId);
                }
                else
                {
                    var slug = rawValue.ToLowerInvariant();
                    var shows = await dbContext.Shows.ToListAsync();
                    show = shows.FirstOrDefault(s =>
                        s.Title.Replace(" ", "-").ToLowerInvariant() == slug);
                }
            }
        }

        show ??= await dbContext.Shows.OrderBy(s => s.Id).FirstOrDefaultAsync();

        if (show != null)
        {
            context.Items["Universe"] = show;
        }

        await _next(context);
    }
}
