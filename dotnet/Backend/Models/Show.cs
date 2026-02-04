namespace Backend.Models;

public class Show
{
    public int Id { get; set; }
    public string Title { get; set; }  // BUG: No null checks or [Required] attribute
    public string Description { get; set; }
    public string Genre { get; set; }
    public int StartYear { get; set; }
    public int? EndYear { get; set; }  // Nullable - show might still be running
    public string Network { get; set; }
    
    // BUG: Missing navigation properties - should have Characters, Episodes, etc.
    // This will cause N+1 query problems later
}
