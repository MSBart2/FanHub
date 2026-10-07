using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Show
{
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string Genre { get; set; }
    public int StartYear { get; set; }
    public int? EndYear { get; set; }  // Nullable - show might still be running
    [Required]
    public string Network { get; set; }
    
    // BUG: Missing navigation properties - should have Characters, Episodes, etc.
    // This will cause N+1 query problems later
}
