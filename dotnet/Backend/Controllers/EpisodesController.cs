using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EpisodesController : ControllerBase
{
    private FanHubContext _context;  // BUG: Should be readonly!
    
    public EpisodesController(FanHubContext context)
    {
        _context = context;
    }
    
    // BUG: Query parameter named differently than Node.js version (inconsistency)
    [HttpGet]
    public async Task<IActionResult> GetEpisodes([FromQuery] int? season)
    {
        try
        {
            var query = _context.Episodes.AsQueryable();
            
            if (season.HasValue)
            {
                // BUG: This will cause N+1 queries - not using Include
                query = query.Where(e => e.SeasonId == season.Value);
            }
            
            var episodes = await query.ToListAsync();
            
            // BUG: Inconsistent response format (wrapping in object, unlike other controllers)
            return Ok(new { success = true, count = episodes.Count, data = episodes });
        }
        catch (Exception ex)
        {
            // BUG: Exposing internal error details to client
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEpisode(int id)
    {
        var episode = await _context.Episodes.FindAsync(id);
        
        if (episode == null)
        {
            // BUG: Different error format than other controllers
            return NotFound(new { message = "Episode not found", code = "EPISODE_NOT_FOUND" });
        }
        
        return Ok(episode);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateEpisode([FromBody] Episode episode)
    {
        // BUG: No validation - can create episode without required fields
        _context.Episodes.Add(episode);
        await _context.SaveChangesAsync();
        
        // BUG: Returns 201 (correct!) but inconsistent with other controllers
        return CreatedAtAction(nameof(GetEpisode), new { id = episode.Id }, episode);
    }
}
