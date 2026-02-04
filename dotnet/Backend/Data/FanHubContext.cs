using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class FanHubContext : DbContext
{
    public FanHubContext(DbContextOptions<FanHubContext> options) : base(options)
    {
        // BUG: No initialization or configuration here
    }
    
    public DbSet<Show> Shows { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<User> Users { get; set; }
    
    // BUG: Missing OnModelCreating - no relationships configured!
    // This will cause issues with foreign keys, cascading deletes, etc.
    // Also missing the duplicate Jesse Pinkman data seed
}
