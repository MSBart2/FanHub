using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly FanHubContext _context;
    
    public CharactersController(FanHubContext context)
    {
        _context = context;
    }
    
    // BUG: No error handling! Will crash if database is down
    [HttpGet]
    public async Task<IActionResult> GetCharacters()
    {
        var characters = await _context.Characters.ToListAsync();
        return Ok(characters);
    }
    
    // BUG: No null check! Will throw NullReferenceException
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);
        return Ok(character.Name);  // BOOM if character is null!
    }
    
    // BUG: No validation! Can create character without required fields
    [HttpPost]
    public async Task<IActionResult> CreateCharacter(Character character)
    {
        _context.Characters.Add(character);
        await _context.SaveChangesAsync();
        
        // BUG: Returns 200 instead of 201 Created
        return Ok(character);
    }
    
    // BUG: Missing async/await properly
    [HttpPut("{id}")]
    public Task<IActionResult> UpdateCharacter(int id, Character character)
    {
        character.Id = id;
        _context.Entry(character).State = EntityState.Modified;
        _context.SaveChangesAsync();  // BUG: Not awaited!
        
        return Task.FromResult<IActionResult>(Ok(character));
    }
    
    // BUG: No error handling on delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);
        _context.Characters.Remove(character);  // BUG: No null check before Remove!
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
