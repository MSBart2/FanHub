using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

// BUG: Missing using statements for validation attributes
public class Character
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string ActorName { get; set; }
    [Required]
    public string Bio { get; set; }
    public bool IsMainCharacter { get; set; }
    [Required]
    public string Status { get; set; }  // BUG: Should be an enum, not a string
    public string? ImageUrl { get; set; }
    [Required]
    public string Tagline { get; set; }
    [Required]
    public string CharacterType { get; set; }

    // BUG: Navigation property without virtual keyword (lazy loading won't work)
    public Show Show { get; set; }

    // BUG: Missing navigation properties for Quotes, Episodes
}
