using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class SeedData
{
    // Actor photos served as local static files (wwwroot/images/characters/)
    // CC-BY / CC-BY-SA licensed photos downloaded from Wikimedia Commons and Flickr
    private static readonly Dictionary<string, string> CharacterImages = new()
    {
        ["Walter White"] = "/images/characters/walter-white.jpg",
        ["Jesse Pinkman"] = "/images/characters/jesse-pinkman.jpg",
        ["Skyler White"] = "/images/characters/skyler-white.jpg",
        ["Hank Schrader"] = "/images/characters/hank-schrader.jpg",
        ["Saul Goodman"] = "/images/characters/saul-goodman.jpg",
        ["Gustavo Fring"] = "/images/characters/gustavo-fring.jpg",
        ["Mike Ehrmantraut"] = "/images/characters/mike-ehrmantraut.jpg",
        ["Marie Schrader"] = "/images/characters/marie-schrader.jpg",
        ["Walter White Jr."] = "/images/characters/walter-white-jr.jpg",
        ["Lydia Rodarte-Quayle"] = "/images/characters/lydia-rodarte-quayle.jpg",
        ["Todd Alquist"] = "/images/characters/todd-alquist.jpg",
        ["Tuco Salamanca"] = "/images/characters/tuco-salamanca.jpg",
        ["Jane Margolis"] = "/images/characters/jane-margolis.jpg",
        ["Gale Boetticher"] = "/images/characters/gale-boetticher.jpg",
    };

    public static void Initialize(FanHubContext context)
    {
        // Apply any pending migrations
        context.Database.Migrate();

        // Check if already seeded
        if (context.Shows.Any()) return;

        // Insert Breaking Bad show
        var show = new Show
        {
            Title = "Breaking Bad",
            Description = "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
            Genre = "Crime Drama",
            StartYear = 2008,
            EndYear = 2013,
            Network = "AMC"
        };
        context.Shows.Add(show);
        context.SaveChanges();

        // Insert seasons
        var seasons = new[]
        {
            new Season { ShowId = show.Id, SeasonNumber = 1, Title = "Season 1", EpisodeCount = 7 },
            new Season { ShowId = show.Id, SeasonNumber = 2, Title = "Season 2", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 3, Title = "Season 3", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 4, Title = "Season 4", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 5, Title = "Season 5", EpisodeCount = 16 }
        };
        context.Seasons.AddRange(seasons);
        context.SaveChanges();

        // Insert episodes — all 5 seasons
        var episodes = new[]
        {
            // Season 1
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 1, Title = "Pilot", Description = "Walter White, a mild-mannered high school chemistry teacher, is diagnosed with inoperable lung cancer. Desperate to secure his family's future, he partners with former student Jesse Pinkman to cook and sell methamphetamine.", RuntimeMinutes = 58, AirDate = new DateTime(2008, 1, 20) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 2, Title = "Cat's in the Bag...", Description = "Walt and Jesse attempt to dispose of the bodies of the two dealers they killed. They flip a coin to decide who handles which situation, leading to grim consequences.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 1, 27) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 3, Title = "...And the Bag's in the River", Description = "Walt and Jesse clean up after the bathtub incident. Walt is forced to make a life-or-death decision about their captive, Emilio's cousin Krazy-8.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 2, 10) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 4, Title = "Cancer Man", Description = "Walt keeps his cancer diagnosis secret from his family, but eventually tells his sister-in-law Marie. Jesse tries to reconnect with his family, with mixed results.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 2, 17) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 5, Title = "Gray Matter", Description = "Walt rejects financial help from his wealthy former business partners Elliott and Gretchen Schwartz. He refuses cancer treatment but is conflicted when Skyler makes it a family issue.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 2, 24) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 6, Title = "Crazy Handful of Nothin'", Description = "Walt shaves his head as his hair falls out from chemotherapy. He and Jesse make contact with volatile drug distributor Tuco Salamanca, and Walt's alter ego Heisenberg emerges.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 3, 2) },
            new Episode { ShowId = show.Id, SeasonId = seasons[0].Id, EpisodeNumber = 7, Title = "A No-Rough-Stuff-Type Deal", Description = "Walt and Jesse agree to produce a larger quantity of meth for Tuco. Walt attempts to acquire methylamine and encounters unexpected obstacles at a chemical warehouse.", RuntimeMinutes = 48, AirDate = new DateTime(2008, 3, 9) },

            // Season 2
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 1, Title = "Seven Thirty-Seven", Description = "Walt and Jesse face the terrifying prospect of Tuco's retaliation after a violent meeting. Walt starts to consider that Tuco needs to be eliminated for their survival.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 3, 8) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 2, Title = "Grilled", Description = "Walt and Jesse are held captive by Tuco in a remote desert shack, along with his wheelchair-bound uncle Hector Salamanca. A tense standoff leads to a violent conclusion.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 3, 15) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 3, Title = "Bit by a Dead Bee", Description = "In the aftermath of Tuco's death, Walt and Jesse must create alibis for their whereabouts. Walt feigns a fugue state while Jesse deals with the police.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 3, 22) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 4, Title = "Down", Description = "Jesse is evicted by his parents and faces homelessness. Walt fights with Skyler about money while hiding his drug income. Jesse hits rock bottom.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 3, 29) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 5, Title = "Breakage", Description = "Walt and Jesse establish a new distribution chain. Hank suffers lasting trauma from the Tuco shootout. Walt invests drug money in Skyler's gambling winnings story.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 4, 5) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 6, Title = "Peekaboo", Description = "Jesse tracks down two meth addicts who robbed one of their dealers. He discovers their neglected young son living in squalor and is moved by the child's plight.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 4, 12) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 7, Title = "Negro y Azul", Description = "The impact of Heisenberg's blue meth reaches the Mexican cartel. Jesse tries to build street cred with his dealers. Hank is transferred to El Paso.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 4, 19) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 8, Title = "Better Call Saul", Description = "Walt and Jesse are introduced to flamboyant criminal lawyer Saul Goodman, who quickly becomes indispensable to their operation.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 4, 26) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 9, Title = "4 Days Out", Description = "Walt and Jesse take the RV out to the desert for a massive cook, but find themselves stranded when the battery dies. A harrowing test of survival and ingenuity follows.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 5, 3) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 10, Title = "Over", Description = "Walt receives encouraging news about his cancer. He begins to contemplate what life after meth would look like, but finds himself unable to simply walk away.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 5, 10) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 11, Title = "Mandala", Description = "Walt and Jesse secure a major new distribution deal through Saul. Jesse begins a romance with his neighbor Jane Margolis, unaware of her troubled past.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 5, 17) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 12, Title = "Phoenix", Description = "Jesse's relationship with Jane spirals into a dangerous relapse. Walt makes a devastating decision that will haunt him for the rest of the series.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 5, 24) },
            new Episode { ShowId = show.Id, SeasonId = seasons[1].Id, EpisodeNumber = 13, Title = "ABQ", Description = "The season finale ties together the season's flash-forward images. A mid-air collision over Albuquerque results from a chain of events set in motion by Walt's actions.", RuntimeMinutes = 47, AirDate = new DateTime(2009, 5, 31) },

            // Season 3
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 1, Title = "No Más", Description = "Walt and Skyler's marriage reaches a breaking point. The Cousins, cartel assassins, arrive in Albuquerque targeting Walt. Gus Fring intervenes to protect his investment.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 3, 21) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 2, Title = "Caballo Sin Nombre", Description = "Walt moves into an apartment after Skyler files for divorce. The Cousins close in on Walt, but are diverted at the last moment by a cryptic order.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 3, 28) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 3, Title = "I.F.T.", Description = "Skyler has an affair with her boss Ted Beneke and announces it to Walt in a shocking confrontation. Walt refuses to leave the family home despite the separation.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 4, 4) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 4, Title = "Green Light", Description = "Skyler grows closer to Ted. Jesse begins manufacturing on his own and encroaches on Gus's territory. Walt learns about the lab and tries to reclaim control.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 4, 11) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 5, Title = "Más", Description = "Gus offers Walt an extraordinary deal to cook in a state-of-the-art underground superlab beneath a laundry facility. Walt is tempted despite his promises to get out.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 4, 18) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 6, Title = "Sunset", Description = "Walt and Gale begin cooking in the superlab. Jesse discovers the RV could be found and works to destroy evidence. Hank closes in on the RV's location.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 4, 25) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 7, Title = "One Minute", Description = "Hank brutally assaults Jesse after a tip. The Cousins ambush Hank in a parking lot in a stunning action sequence that leaves Hank fighting for his life.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 5, 2) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 8, Title = "I See You", Description = "Walter waits at the hospital as Hank undergoes surgery. The cartel retaliates against the attack on the Cousins. Tensions escalate between Walt and Gus.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 5, 9) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 9, Title = "Kafkaesque", Description = "Jesse proposes skimming product to sell on the side. Skyler discovers Walt's second phone and suspects infidelity. Hank recovers slowly and grows increasingly frustrated.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 5, 16) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 10, Title = "Fly", Description = "Walt becomes obsessed with eliminating a fly that has contaminated the lab, leading to a sleepless, guilt-ridden night. A fan-favorite bottle episode that delves into Walt's psyche.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 5, 23) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 11, Title = "Abiquiú", Description = "Jesse begins attending a support group where he meets Andrea and her young son Brock. Skyler investigates Ted's financial irregularities. Walt and Jesse discuss their partnership.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 5, 30) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 12, Title = "Half Measures", Description = "Jesse plans to kill two dealers working for Gus who used a child to commit murder. Walt makes a dramatic and violent intervention to protect Jesse at a critical moment.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 6, 6) },
            new Episode { ShowId = show.Id, SeasonId = seasons[2].Id, EpisodeNumber = 13, Title = "Full Measure", Description = "Walt and Jesse face elimination by Gus. Walt sends Jesse to kill Gale Boetticher, Gus's other chemist, to make themselves indispensable. Jesse pulls the trigger.", RuntimeMinutes = 47, AirDate = new DateTime(2010, 6, 13) },

            // Season 4
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 1, Title = "Box Cutter", Description = "Gus responds to Gale's murder with a shocking act of violence intended to send Walt and Jesse a message. The superlab must continue running.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 7, 17) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 2, Title = "Thirty-Eight Snub", Description = "Walt purchases an illegal handgun to protect himself from Gus. Jesse throws non-stop parties at his house to avoid confronting his guilt over Gale's death.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 7, 24) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 3, Title = "Open House", Description = "Marie copes with stress by shoplifting and visiting open houses. Jesse continues his self-destructive party lifestyle. Walt tries to forge an alliance against Gus.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 7, 31) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 4, Title = "Bullet Points", Description = "Skyler and Walt rehearse their cover story about his gambling winnings. Hank shows Walt his notes on Gale's murder, unknowingly revealing how close he is to the truth.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 8, 7) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 5, Title = "Shotgun", Description = "Mike takes Jesse on a mysterious errand run. Walt grows jealous and paranoid at the thought that Gus is cultivating Jesse to replace him. Hank suspects Gale isn't Heisenberg.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 8, 14) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 6, Title = "Cornered", Description = "Walt makes the infamous declaration that he is the danger, not in danger. Jesse gains respect in the cartel's eyes. Skyler grows increasingly troubled by Walt's behavior.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 8, 21) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 7, Title = "Problem Dog", Description = "Jesse attends his support group and gives a veiled confession about killing Gale. Walt tries to convince Saul to arrange Gus's assassination but Saul refuses.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 8, 28) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 8, Title = "Hermanos", Description = "Hank questions Gus about his connection to the Pollos Hermanos operation. Gus's tragic backstory in Mexico with his partner Max is revealed in flashback.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 9, 4) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 9, Title = "Bug", Description = "Jesse gives Walt a GPS bug at Gus's command and Walt discovers Jesse's growing loyalty to Gus. The two engage in a brutal fistfight that ends their partnership temporarily.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 9, 11) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 10, Title = "Salud", Description = "Jesse accompanies Mike and Gus to Mexico to meet the cartel. Gus poisons the entire cartel leadership in a long-planned act of vengeance for Max's death.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 9, 18) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 11, Title = "Crawl Space", Description = "Walt discovers Skyler gave Ted Beneke his drug money to pay the IRS. When Walt goes to retrieve his cash reserves, he finds them nearly depleted — and breaks into hysterical laughter.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 9, 25) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 12, Title = "End Times", Description = "Walt prepares for Gus to kill him. Brock, Jesse's girlfriend Andrea's son, is poisoned. Jesse accuses Walt, but Walt manipulates him into believing Gus is responsible.", RuntimeMinutes = 47, AirDate = new DateTime(2011, 10, 2) },
            new Episode { ShowId = show.Id, SeasonId = seasons[3].Id, EpisodeNumber = 13, Title = "Face Off", Description = "Walt orchestrates Gus's assassination using Hector Salamanca as a suicide bomber at the Casa Tranquila nursing home. Gus walks out adjusting his tie before collapsing — revealing half his face is gone.", RuntimeMinutes = 54, AirDate = new DateTime(2011, 10, 9) },

            // Season 5
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 1, Title = "Live Free or Die", Description = "In a flash-forward, Walt celebrates his 52nd birthday alone with a machine gun in his car. In the present, Walt, Jesse, and Mike use magnets to destroy Gus's laptop evidence.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 7, 15) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 2, Title = "Madrigal", Description = "The DEA investigates Madrigal Electromotive, Gus's corporate parent. Walt, Jesse, and Mike form a new partnership. Mike searches for the names on Gus's secret payroll list.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 7, 22) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 3, Title = "Hazard Pay", Description = "The new crew sets up a mobile meth lab inside fumigated houses. Walt manipulates Jesse into breaking up with Andrea. Saul warns Walt that three is a crowd.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 7, 29) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 4, Title = "Fifty-One", Description = "Walt turns 51 and celebrates while Skyler's silent desperation grows. Skyler stages a breakdown to send the children to Hank and Marie's, trying to protect them from Walt.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 8, 5) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 5, Title = "Dead Freight", Description = "The crew plans and executes a stunning train heist to steal methylamine. Just as the perfect crime succeeds, young motorbike rider Drew Sharp witnesses the aftermath and is shot by Todd.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 8, 12) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 6, Title = "Buyout", Description = "Jesse wants out after Drew Sharp's murder. Mike also wants to sell the methylamine and walk away. Walt refuses to let the operation die, insisting he is in the empire business.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 8, 19) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 7, Title = "Say My Name", Description = "Walt negotiates directly with Declan, a Phoenix distributor, demanding recognition as Heisenberg. Mike retires, but is tracked by the DEA. Walt kills Mike in a riverside confrontation.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 8, 26) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 8, Title = "Gliding Over All", Description = "Walt has Mike's nine men killed simultaneously in prison. He expands the meth operation internationally through Lydia. Then, at a family gathering, Hank discovers Walt is Heisenberg in a bathroom.", RuntimeMinutes = 47, AirDate = new DateTime(2012, 9, 2) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 9, Title = "Blood Money", Description = "Hank confronts Walt in an explosive garage scene. Walt threatens Hank, warning him to 'tread lightly.' Jesse disposes of his drug money by throwing it from his car.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 8, 11) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 10, Title = "Buried", Description = "Hank tries to turn Skyler against Walt. Walt buries his money in the desert and has Huell and Kuby retrieve it. Hank secretly records Skyler and contacts an attorney.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 8, 18) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 11, Title = "Confessions", Description = "Walt records a fake confession video framing Hank as Heisenberg, ensuring Hank cannot go to the DEA. Jesse figures out that Walt poisoned Brock and attacks Saul's office in fury.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 8, 25) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 12, Title = "Rabid Dog", Description = "Jesse attempts to burn down the White house but is stopped by Hank. Jesse agrees to help the DEA. Walt orders Jesse's death. Jesse warns Walt he will strike where Walt least expects.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 9, 1) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 13, Title = "To'hajiilee", Description = "Jesse tricks Walt into leading them to his buried money in the desert. Walt calls the white supremacist gang for backup — then calls them off. But they arrive anyway, and Hank is killed.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 9, 8) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 14, Title = "Ozymandias", Description = "Widely considered one of the greatest TV episodes ever made. Hank is executed. Walt's empire collapses entirely. Walt kidnaps Holly, then tearfully returns her. Jesse is enslaved by the Nazis.", RuntimeMinutes = 47, AirDate = new DateTime(2013, 9, 15) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 15, Title = "Granite State", Description = "Walt lives in exile in a New Hampshire cabin, isolated and alone. Saul flees to Omaha. Jesse is forced to cook for the neo-Nazis as a prisoner. Walt makes one last phone call to Walt Jr.", RuntimeMinutes = 55, AirDate = new DateTime(2013, 9, 22) },
            new Episode { ShowId = show.Id, SeasonId = seasons[4].Id, EpisodeNumber = 16, Title = "Felina", Description = "Walt returns to Albuquerque for one final act. He provides for his family through Elliott and Gretchen, liberates Jesse, kills the Nazi gang with an automated rifle, and poisons Lydia. He dies in the lab.", RuntimeMinutes = 56, AirDate = new DateTime(2013, 9, 29) },
        };
        context.Episodes.AddRange(episodes);
        context.SaveChanges();

        // Insert characters
        var characters = new[]
        {
            new Character { ShowId = show.Id, Name = "Walter White",         ActorName = "Bryan Cranston",       Bio = "A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine manufacturer known as \"Heisenberg\". His diagnosis of inoperable lung cancer sets the entire story in motion.", Tagline = "I am the danger", CharacterType = "Antihero,Villain", IsMainCharacter = true,  Status = "deceased", ImageUrl = CharacterImages["Walter White"] },
            new Character { ShowId = show.Id, Name = "Jesse Pinkman",        ActorName = "Aaron Paul",           Bio = "Walt's former student and small-time meth dealer turned manufacturing partner. Jesse struggles with guilt, addiction, and his own moral code throughout the series.", Tagline = "Yeah, science!", CharacterType = "Antihero", IsMainCharacter = true,  Status = "alive",    ImageUrl = CharacterImages["Jesse Pinkman"] },
            new Character { ShowId = show.Id, Name = "Skyler White",         ActorName = "Anna Gunn",            Bio = "Walter's pregnant wife and mother of Walt Jr. A meticulous bookkeeper who grows increasingly suspicious of Walt's activities before becoming an unwilling accomplice in money laundering.", Tagline = "The collateral damage of Walt's ambition", CharacterType = "Hero", IsMainCharacter = true,  Status = "alive",    ImageUrl = CharacterImages["Skyler White"] },
            new Character { ShowId = show.Id, Name = "Hank Schrader",        ActorName = "Dean Norris",          Bio = "Walter's boisterous brother-in-law and DEA agent whose investigation of Heisenberg leads him ever closer to the truth. Killed by Jack Welker's gang in the New Mexico desert.", Tagline = "A man with principles and a bouncer's heart", CharacterType = "Hero", IsMainCharacter = true,  Status = "deceased", ImageUrl = CharacterImages["Hank Schrader"] },
            new Character { ShowId = show.Id, Name = "Saul Goodman",         ActorName = "Bob Odenkirk",         Bio = "Flamboyant criminal lawyer Jimmy McGill who operates under the alias Saul Goodman. Provides legal counsel and criminal connections to Walt and Jesse, eventually fleeing to Omaha as 'Gene Takavic'.", Tagline = "Better call Saul!", CharacterType = "Comic Relief", IsMainCharacter = false, Status = "alive",    ImageUrl = CharacterImages["Saul Goodman"] },
            new Character { ShowId = show.Id, Name = "Gustavo Fring",        ActorName = "Giancarlo Esposito",   Bio = "The polite, meticulous owner of the Los Pollos Hermanos fast food chain who secretly operates a massive methamphetamine distribution network. His composed exterior masks a calculating and ruthless cartel operator.", Tagline = "Pollo hermano with cold-blooded precision", CharacterType = "Villain", IsMainCharacter = true,  Status = "deceased", ImageUrl = CharacterImages["Gustavo Fring"] },
            new Character { ShowId = show.Id, Name = "Mike Ehrmantraut",     ActorName = "Jonathan Banks",       Bio = "Gus Fring's fixer and enforcer — a former Philadelphia cop with a strict moral code and quiet competence. Becomes a reluctant partner to Walt and Jesse. Shot by Walt in a petulant rage.", Tagline = "Measure twice, cut once", CharacterType = "Antihero", IsMainCharacter = true,  Status = "deceased", ImageUrl = CharacterImages["Mike Ehrmantraut"] },
            new Character { ShowId = show.Id, Name = "Marie Schrader",       ActorName = "Betsy Brandt",         Bio = "Skyler's sister and Hank's wife. A radiologic technologist with a compulsive shoplifting habit. Marie becomes Hank's steadfast supporter through his recovery and ultimately his crusade against Heisenberg.", Tagline = "Purple is my passion", CharacterType = "Hero", IsMainCharacter = true,  Status = "alive",    ImageUrl = CharacterImages["Marie Schrader"] },
            new Character { ShowId = show.Id, Name = "Walter White Jr.",     ActorName = "RJ Mitte",             Bio = "Walt and Skyler's teenage son, who has cerebral palsy and goes by the nickname Flynn. He idolizes his father and is devastated when the truth about Walt is revealed.", Tagline = "Dad, breakfast?", CharacterType = "Hero", IsMainCharacter = true,  Status = "alive",    ImageUrl = CharacterImages["Walter White Jr."] },
            new Character { ShowId = show.Id, Name = "Lydia Rodarte-Quayle", ActorName = "Laura Fraser",         Bio = "A high-strung Madrigal Electromotive executive who manages the methylamine supply chain. She facilitates the international distribution of Walt's blue meth and is poisoned by Walt with ricin in the finale.", Tagline = "Stevia and logistics", CharacterType = "Villain", IsMainCharacter = false, Status = "deceased", ImageUrl = CharacterImages["Lydia Rodarte-Quayle"] },
            new Character { ShowId = show.Id, Name = "Todd Alquist",         ActorName = "Jesse Plemons",        Bio = "A cheerful, sociopathic young man who joins Walt's crew and kills young Drew Sharp without hesitation. He becomes a cook for Jack Welker's white supremacist gang and holds Jesse captive as a slave.", Tagline = "The smiling sociopath", CharacterType = "Villain,Comic Relief", IsMainCharacter = false, Status = "deceased", ImageUrl = CharacterImages["Todd Alquist"] },
            new Character { ShowId = show.Id, Name = "Tuco Salamanca",       ActorName = "Raymond Cruz",         Bio = "A volatile, unpredictable cartel distributor who becomes Walt and Jesse's first major buyer. His erratic violence makes him one of the series' most dangerous — and memorable — early antagonists.", Tagline = "Crystal clear chaos", CharacterType = "Villain", IsMainCharacter = false, Status = "deceased", ImageUrl = CharacterImages["Tuco Salamanca"] },
            new Character { ShowId = show.Id, Name = "Jane Margolis",        ActorName = "Krysten Ritter",       Bio = "Jesse's neighbor and landlord who becomes his girlfriend and enables his relapse into heroin. Her death — Walt watches her choke and does nothing — is a pivotal moral turning point.", Tagline = "A moment of mercy never given", CharacterType = "Hero", IsMainCharacter = false, Status = "deceased", ImageUrl = CharacterImages["Jane Margolis"] },
            new Character { ShowId = show.Id, Name = "Gale Boetticher",      ActorName = "David Costabile",      Bio = "A brilliant, idealistic chemist hired by Gus to work alongside Walt. A vegan who loves Italian opera, Gale is tragically shot by Jesse on Walt's orders to prevent them from being replaced.", Tagline = "Brilliance without ambition", CharacterType = "Hero", IsMainCharacter = false, Status = "deceased", ImageUrl = CharacterImages["Gale Boetticher"] },
        };
        context.Characters.AddRange(characters);
        context.SaveChanges();

        // Insert quotes (some reference the duplicate Jesse)
        var quotes = new[]
        {
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[0].Id,  // Walter
                EpisodeId = episodes[0].Id,       // Pilot
                QuoteText = "I am not in danger, Skyler. I am the danger!",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[1].Id,   // Jesse (first one)
                EpisodeId = episodes[0].Id,        // Pilot
                QuoteText = "Yeah, science!",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[0].Id,   // Walter
                EpisodeId = episodes[42].Id,       // S5E7 "Say My Name"
                QuoteText = "Say my name.",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[1].Id,   // Jesse Pinkman
                EpisodeId = episodes[1].Id,        // Cat's in the Bag
                QuoteText = "Yeah, Mr. White! Yeah, science!",
                IsFamous = false,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[5].Id,   // Gus Fring
                EpisodeId = episodes[27].Id,       // S3E7 One Minute
                QuoteText = "I will kill your wife. I will kill your son. I will kill your infant daughter.",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[0].Id,   // Walter
                EpisodeId = episodes[48].Id,       // S5E9 Blood Money
                QuoteText = "I'm the one who knocks.",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[4].Id,   // Saul
                EpisodeId = episodes[14].Id,       // S2E8 Better Call Saul
                QuoteText = "Better call Saul!",
                IsFamous = true,
                Likes = 0
            },
        };
        context.Quotes.AddRange(quotes);
        context.SaveChanges();

        // Link characters to episodes (many-to-many relationships)
        // Walter White appears in most episodes
        for (int i = 0; i < episodes.Length; i++)
        {
            episodes[i].Characters.Add(characters[0]);
        }

        // Jesse Pinkman appears in most episodes
        for (int i = 0; i < episodes.Length - 5; i++)  // Skip a few later episodes
        {
            episodes[i].Characters.Add(characters[1]);
        }

        // Skyler White appears in select episodes (first 50)
        for (int i = 0; i < Math.Min(50, episodes.Length); i++)
        {
            episodes[i].Characters.Add(characters[2]);
        }

        // Hank Schrader appears starting from Season 1 Episode 4
        for (int i = 3; i < episodes.Length; i++)
        {
            episodes[i].Characters.Add(characters[3]);
        }

        // Gus Fring appears in later episodes (starting Season 2, roughly episode 13)
        for (int i = 13; i < Math.Min(38, episodes.Length); i++)
        {
            episodes[i].Characters.Add(characters[5]);
        }

        context.SaveChanges();

        // Create character relationships (many-to-many self-join)
        var relationships = new[]
        {
            new CharacterRelationship { CharacterId = characters[0].Id, RelatedCharacterId = characters[2].Id, RelationshipType = "spouse" },           // Walt ↔ Skyler
            new CharacterRelationship { CharacterId = characters[0].Id, RelatedCharacterId = characters[3].Id, RelationshipType = "brother-in-law" }, // Walt ↔ Hank
            new CharacterRelationship { CharacterId = characters[0].Id, RelatedCharacterId = characters[1].Id, RelationshipType = "partner" },       // Walt ↔ Jesse
            new CharacterRelationship { CharacterId = characters[0].Id, RelatedCharacterId = characters[4].Id, RelationshipType = "employee" },      // Walt → Saul (legal)
            new CharacterRelationship { CharacterId = characters[0].Id, RelatedCharacterId = characters[5].Id, RelationshipType = "employer" },      // Walt → Gus
            new CharacterRelationship { CharacterId = characters[1].Id, RelatedCharacterId = characters[2].Id, RelationshipType = "neighbor" },      // Jesse ↔ Skyler
            new CharacterRelationship { CharacterId = characters[2].Id, RelatedCharacterId = characters[3].Id, RelationshipType = "sister" },       // Skyler ↔ Hank
            new CharacterRelationship { CharacterId = characters[3].Id, RelatedCharacterId = characters[7].Id, RelationshipType = "spouse" },       // Hank ↔ Marie
            new CharacterRelationship { CharacterId = characters[4].Id, RelatedCharacterId = characters[0].Id, RelationshipType = "client" },       // Saul ← Walt
            new CharacterRelationship { CharacterId = characters[5].Id, RelatedCharacterId = characters[6].Id, RelationshipType = "associate" },    // Gus ↔ Mike
        };
        context.CharacterRelationships.AddRange(relationships);
        context.SaveChanges();

        // Insert test admin user
        // BUG: Insecure MD5 hash (matching AuthController's hash method)
        // Password is "admin123" - MD5: 0192023a7bbd73250516f069df18b500
        var adminUser = new User
        {
            Email = "admin@fanhub.test",
            Username = "admin",
            DisplayName = "Admin User",
            PasswordHash = "0192023a7bbd73250516f069df18b500",
            Role = "admin"
        };
        context.Users.Add(adminUser);
        context.SaveChanges();
    }
}
