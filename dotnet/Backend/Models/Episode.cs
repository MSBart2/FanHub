using System;

namespace Backend.Models;

public class Episode
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int SeasonId { get; set; }
    public int EpisodeNumber { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int RuntimeMinutes { get; set; }
    public DateTime AirDate { get; set; }
    
    // BUG: Only one navigation property, missing Show
    public Season Season { get; set; }
    // Missing: public Show Show { get; set; }
}
