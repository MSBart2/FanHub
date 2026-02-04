using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShowsController : ControllerBase
{
    private readonly FanHubContext _context;
    
    public ShowsController(FanHubContext context)
    {
        _context = context;
    }
    
    // BUG: No try/catch - will crash on database errors
    [HttpGet]
    public async Task<IActionResult> GetShows()
    {
        // BUG: N+1 query problem - not including related entities
        var shows = await _context.Shows.ToListAsync();
        return Ok(shows);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetShow(int id)
    {
        var show = await _context.Shows.FindAsync(id);
        
        // BUG: No null check
        return Ok(show);
    }
    
    // BUG: No [FromBody] attribute on parameter
    [HttpPost]
    public async Task<IActionResult> CreateShow(Show show)
    {
        // BUG: No validation check
        _context.Shows.Add(show);
        await _context.SaveChangesAsync();
        
        // BUG: Should return CreatedAtAction with 201
        return Ok(show);
    }
    
    // BUG: Returns Task<IActionResult> but doesn't use async properly
    [HttpPut("{id}")]
    public Task<IActionResult> UpdateShow(int id, Show show)
    {
        show.Id = id;
        _context.Entry(show).State = EntityState.Modified;
        
        // BUG: Fire and forget - not awaited!
        _context.SaveChangesAsync();
        
        return Task.FromResult<IActionResult>(NoContent());
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShow(int id)
    {
        var show = await _context.Shows.FindAsync(id);
        
        // BUG: No null check before Remove
        _context.Shows.Remove(show);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
