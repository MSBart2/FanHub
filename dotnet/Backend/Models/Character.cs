namespace Backend.Models;

// BUG: Missing using statements for validation attributes
public class Character
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public string Name { get; set; }  // BUG: No [Required] or null checks
    public string ActorName { get; set; }
    public string Bio { get; set; }
    public bool IsMainCharacter { get; set; }
    public string Status { get; set; }  // BUG: Should be an enum, not a string
    
    // BUG: Navigation property without virtual keyword (lazy loading won't work)
    public Show Show { get; set; }
    
    // BUG: Missing navigation properties for Quotes, Episodes
}
