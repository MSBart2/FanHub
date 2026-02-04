using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly FanHubContext _context;
    
    public QuotesController(FanHubContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetQuotes()
    {
        // BUG: Missing Include() - Character navigation property will be null
        var quotes = await _context.Quotes.ToListAsync();
        return Ok(quotes);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuote(int id)
    {
        // BUG: Using Find instead of Include for related data
        var quote = await _context.Quotes.FindAsync(id);
        
        if (quote == null)
            return NotFound();
        
        return Ok(quote);
    }
    
    // BUG: Like endpoint with no authentication check
    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        
        if (quote == null)
            return NotFound();
        
        // BUG: Race condition! Multiple requests can increment at the same time
        quote.Likes++;
        await _context.SaveChangesAsync();
        
        return Ok(quote);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateQuote([FromBody] Quote quote)
    {
        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();
        
        return Ok(quote);  // BUG: Should be 201 Created
    }
    
    // BUG: Delete endpoint missing completely! No way to delete quotes
}
