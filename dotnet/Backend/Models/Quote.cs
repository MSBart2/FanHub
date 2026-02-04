namespace Backend.Models;

public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }
    public int EpisodeId { get; set; }
    public string QuoteText { get; set; }
    public bool IsFamous { get; set; }
    public int Likes { get; set; }
    
    // BUG: Inconsistent - some nav properties, some missing
    public Character Character { get; set; }
    // Missing: public Show Show { get; set; }
    // Missing: public Episode Episode { get; set; }
}
