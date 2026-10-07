using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class User
{
    public int Id { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string DisplayName { get; set; }
    [Required]
    public string Role { get; set; }  // BUG: Should be an enum (admin, user, etc.)
}
