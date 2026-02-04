using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]  // BUG: Should be /api/auth not /api/authcontroller
public class AuthController : ControllerBase
{
    private readonly FanHubContext _context;
    
    public AuthController(FanHubContext context)
    {
        _context = context;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // BUG: No validation - can register with empty email/password
        
        // Check if user exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (existingUser != null)
        {
            return BadRequest("User already exists");  // BUG: Plain string response
        }
        
        // BUG: Weak password requirements! Only checks length
        if (request.Password.Length < 6)
        {
            return BadRequest("Password must be at least 6 characters");
        }
        
        // BUG: Using MD5 for password hashing - EXTREMELY INSECURE!
        // Should use BCrypt or PBKDF2
        var passwordHash = HashPasswordMD5(request.Password);
        
        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            DisplayName = request.DisplayName,
            PasswordHash = passwordHash,
            Role = "user"  // BUG: Hardcoded string instead of enum
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        // BUG: Returning password hash to client!
        return Ok(user);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // BUG: No validation on input
        
        var passwordHash = HashPasswordMD5(request.Password);
        
        // BUG: Vulnerable to timing attacks
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == passwordHash);
        
        if (user == null)
        {
            // BUG: Revealing whether email exists or password is wrong
            return Unauthorized("Invalid email or password");
        }
        
        // BUG: No JWT token generation! Just returning user object
        // Should generate JWT token here
        return Ok(new { message = "Login successful", user });
    }
    
    // BUG: Using insecure MD5 hashing
    private string HashPasswordMD5(string password)
    {
        using (MD5 md5 = MD5.Create())
        {
            byte[] inputBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("x2"));
            }
            return sb.ToString();
        }
    }
}

// BUG: Request models should be in separate folder
public class RegisterRequest
{
    public string Email { get; set; }  // BUG: No validation attributes
    public string Password { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
