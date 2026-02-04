namespace Backend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }  // BUG: No email validation attribute
    public string PasswordHash { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Role { get; set; }  // BUG: Should be an enum (admin, user, etc.)
}
