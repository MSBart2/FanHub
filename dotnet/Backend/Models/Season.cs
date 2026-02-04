namespace Backend.Models;

public class Season
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int SeasonNumber { get; set; }
    public string Title { get; set; }
    public int EpisodeCount { get; set; }
    
    // Missing navigation properties completely - another bug!
}
