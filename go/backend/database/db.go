package database

import (
	"log"
	"time"

	"fanhub/config"
	"fanhub/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// BUG: Global DB variable instead of struct/interface
var DB *gorm.DB

// BUG: No proper error handling - missing error check on gorm.Open()!
// Code continues even if the database connection fails.
func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open(config.DBPath), &gorm.Config{})
	_ = err // BUG: Error ignored - DB may be nil!

	// Create schema via AutoMigrate
	if err := DB.AutoMigrate(
		&models.Show{},
		&models.Season{},
		&models.Episode{},
		&models.Character{},
		&models.Quote{},
		&models.User{},
	); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	SeedDB()
	log.Println("Database connection established")
}

// BUG: No error handling on this function
func CloseDB() {
	sqlDB, _ := DB.DB()
	sqlDB.Close()
}

// SeedDB populates the database with Breaking Bad data on first run.
func SeedDB() {
	var count int64
	DB.Model(&models.Show{}).Count(&count)
	if count > 0 {
		return
	}

	endYear := 2013
	show := models.Show{
		Title:       "Breaking Bad",
		Description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
		Genre:       "Crime Drama",
		StartYear:   2008,
		EndYear:     &endYear,
		Network:     "AMC",
	}
	DB.Create(&show)

	seasons := []models.Season{
		{ShowID: show.ID, SeasonNumber: 1, Title: "Season 1", EpisodeCount: 7},
		{ShowID: show.ID, SeasonNumber: 2, Title: "Season 2", EpisodeCount: 13},
		{ShowID: show.ID, SeasonNumber: 3, Title: "Season 3", EpisodeCount: 13},
		{ShowID: show.ID, SeasonNumber: 4, Title: "Season 4", EpisodeCount: 13},
		{ShowID: show.ID, SeasonNumber: 5, Title: "Season 5", EpisodeCount: 16},
	}
	for i := range seasons {
		DB.Create(&seasons[i])
	}
	s1, s2, s3, s4, s5 := seasons[0].ID, seasons[1].ID, seasons[2].ID, seasons[3].ID, seasons[4].ID

	type epDef struct {
		num  int
		sid  int
		title string
		desc  string
		mins  int
		date  string
	}
	parseDate := func(s string) *time.Time {
		t, err := time.Parse("2006-01-02", s)
		if err != nil {
			return nil
		}
		return &t
	}
	eps := []epDef{
		// S1
		{1, s1, "Pilot", "Walter White, a mild-mannered high school chemistry teacher, is diagnosed with inoperable lung cancer. Desperate to secure his family's future, he partners with former student Jesse Pinkman to cook and sell methamphetamine.", 58, "2008-01-20"},
		{2, s1, "Cat's in the Bag...", "Walt and Jesse attempt to dispose of the bodies of the two dealers they killed. They flip a coin to decide who handles which situation, leading to grim consequences.", 48, "2008-01-27"},
		{3, s1, "...And the Bag's in the River", "Walt and Jesse clean up after the bathtub incident. Walt is forced to make a life-or-death decision about their captive, Emilio's cousin Krazy-8.", 48, "2008-02-10"},
		{4, s1, "Cancer Man", "Walt keeps his cancer diagnosis secret from his family, but eventually tells his sister-in-law Marie. Jesse tries to reconnect with his family, with mixed results.", 48, "2008-02-17"},
		{5, s1, "Gray Matter", "Walt rejects financial help from his wealthy former business partners Elliott and Gretchen Schwartz. He refuses cancer treatment but is conflicted when Skyler makes it a family issue.", 48, "2008-02-24"},
		{6, s1, "Crazy Handful of Nothin'", "Walt shaves his head as his hair falls out from chemotherapy. He and Jesse make contact with volatile drug distributor Tuco Salamanca, and Walt's alter ego Heisenberg emerges.", 48, "2008-03-02"},
		{7, s1, "A No-Rough-Stuff-Type Deal", "Walt and Jesse agree to produce a larger quantity of meth for Tuco. Walt attempts to acquire methylamine and encounters unexpected obstacles at a chemical warehouse.", 48, "2008-03-09"},
		// S2
		{1,  s2, "Seven Thirty-Seven", "Walt and Jesse face the terrifying prospect of Tuco's retaliation after a violent meeting. Walt starts to consider that Tuco needs to be eliminated for their survival.", 47, "2009-03-08"},
		{2,  s2, "Grilled", "Walt and Jesse are held captive by Tuco in a remote desert shack, along with his wheelchair-bound uncle Hector Salamanca. A tense standoff leads to a violent conclusion.", 47, "2009-03-15"},
		{3,  s2, "Bit by a Dead Bee", "In the aftermath of Tuco's death, Walt and Jesse must create alibis for their whereabouts. Walt feigns a fugue state while Jesse deals with the police.", 47, "2009-03-22"},
		{4,  s2, "Down", "Jesse is evicted by his parents and faces homelessness. Walt fights with Skyler about money while hiding his drug income. Jesse hits rock bottom.", 47, "2009-03-29"},
		{5,  s2, "Breakage", "Walt and Jesse establish a new distribution chain. Hank suffers lasting trauma from the Tuco shootout. Walt invests drug money in Skyler's gambling winnings story.", 47, "2009-04-05"},
		{6,  s2, "Peekaboo", "Jesse tracks down two meth addicts who robbed one of their dealers. He discovers their neglected young son living in squalor and is moved by the child's plight.", 47, "2009-04-12"},
		{7,  s2, "Negro y Azul", "The impact of Heisenberg's blue meth reaches the Mexican cartel. Jesse tries to build street cred with his dealers. Hank is transferred to El Paso.", 47, "2009-04-19"},
		{8,  s2, "Better Call Saul", "Walt and Jesse are introduced to flamboyant criminal lawyer Saul Goodman, who quickly becomes indispensable to their operation.", 47, "2009-04-26"},
		{9,  s2, "4 Days Out", "Walt and Jesse take the RV out to the desert for a massive cook, but find themselves stranded when the battery dies. A harrowing test of survival and ingenuity follows.", 47, "2009-05-03"},
		{10, s2, "Over", "Walt receives encouraging news about his cancer. He begins to contemplate what life after meth would look like, but finds himself unable to simply walk away.", 47, "2009-05-10"},
		{11, s2, "Mandala", "Walt and Jesse secure a major new distribution deal through Saul. Jesse begins a romance with his neighbor Jane Margolis, unaware of her troubled past.", 47, "2009-05-17"},
		{12, s2, "Phoenix", "Jesse's relationship with Jane spirals into a dangerous relapse. Walt makes a devastating decision that will haunt him for the rest of the series.", 47, "2009-05-24"},
		{13, s2, "ABQ", "The season finale ties together the season's flash-forward images. A mid-air collision over Albuquerque results from a chain of events set in motion by Walt's actions.", 47, "2009-05-31"},
		// S3
		{1,  s3, "No Más", "Walt and Skyler's marriage reaches a breaking point. The Cousins arrive in Albuquerque targeting Walt. Gus Fring intervenes to protect his investment.", 47, "2010-03-21"},
		{2,  s3, "Caballo Sin Nombre", "Walt moves into an apartment after Skyler files for divorce. The Cousins close in on Walt, but are diverted at the last moment by a cryptic order.", 47, "2010-03-28"},
		{3,  s3, "I.F.T.", "Skyler has an affair with her boss Ted Beneke and announces it to Walt in a shocking confrontation. Walt refuses to leave the family home despite the separation.", 47, "2010-04-04"},
		{4,  s3, "Green Light", "Skyler grows closer to Ted. Jesse begins manufacturing on his own and encroaches on Gus's territory. Walt learns about the lab and tries to reclaim control.", 47, "2010-04-11"},
		{5,  s3, "Más", "Gus offers Walt an extraordinary deal to cook in a state-of-the-art underground superlab beneath a laundry facility. Walt is tempted despite his promises to get out.", 47, "2010-04-18"},
		{6,  s3, "Sunset", "Walt and Gale begin cooking in the superlab. Jesse discovers the RV could be found and works to destroy evidence. Hank closes in on the RV's location.", 47, "2010-04-25"},
		{7,  s3, "One Minute", "Hank brutally assaults Jesse after a tip. The Cousins ambush Hank in a parking lot in a stunning action sequence that leaves Hank fighting for his life.", 47, "2010-05-02"},
		{8,  s3, "I See You", "Walter waits at the hospital as Hank undergoes surgery. The cartel retaliates against the attack on the Cousins. Tensions escalate between Walt and Gus.", 47, "2010-05-09"},
		{9,  s3, "Kafkaesque", "Jesse proposes skimming product to sell on the side. Skyler discovers Walt's second phone and suspects infidelity. Hank recovers slowly and grows increasingly frustrated.", 47, "2010-05-16"},
		{10, s3, "Fly", "Walt becomes obsessed with eliminating a fly that has contaminated the lab. A fan-favorite bottle episode that delves into Walt's psyche.", 47, "2010-05-23"},
		{11, s3, "Abiquiú", "Jesse begins attending a support group where he meets Andrea and her young son Brock. Skyler investigates Ted's financial irregularities.", 47, "2010-05-30"},
		{12, s3, "Half Measures", "Jesse plans to kill two dealers working for Gus who used a child to commit murder. Walt makes a dramatic and violent intervention to protect Jesse at a critical moment.", 47, "2010-06-06"},
		{13, s3, "Full Measure", "Walt and Jesse face elimination by Gus. Walt sends Jesse to kill Gale Boetticher, Gus's other chemist, to make themselves indispensable. Jesse pulls the trigger.", 47, "2010-06-13"},
		// S4
		{1,  s4, "Box Cutter", "Gus responds to Gale's murder with a shocking act of violence intended to send Walt and Jesse a message. The superlab must continue running.", 47, "2011-07-17"},
		{2,  s4, "Thirty-Eight Snub", "Walt purchases an illegal handgun to protect himself from Gus. Jesse throws non-stop parties at his house to avoid confronting his guilt over Gale's death.", 47, "2011-07-24"},
		{3,  s4, "Open House", "Marie copes with stress by shoplifting and visiting open houses. Jesse continues his self-destructive party lifestyle. Walt tries to forge an alliance against Gus.", 47, "2011-07-31"},
		{4,  s4, "Bullet Points", "Skyler and Walt rehearse their cover story about his gambling winnings. Hank shows Walt his notes on Gale's murder, unknowingly revealing how close he is to the truth.", 47, "2011-08-07"},
		{5,  s4, "Shotgun", "Mike takes Jesse on a mysterious errand run. Walt grows jealous and paranoid at the thought that Gus is cultivating Jesse to replace him. Hank suspects Gale isn't Heisenberg.", 47, "2011-08-14"},
		{6,  s4, "Cornered", "Walt makes the infamous declaration that he is the danger, not in danger. Jesse gains respect in the cartel's eyes. Skyler grows increasingly troubled by Walt's behavior.", 47, "2011-08-21"},
		{7,  s4, "Problem Dog", "Jesse attends his support group and gives a veiled confession about killing Gale. Walt tries to convince Saul to arrange Gus's assassination but Saul refuses.", 47, "2011-08-28"},
		{8,  s4, "Hermanos", "Hank questions Gus about his connection to the Pollos Hermanos operation. Gus's tragic backstory in Mexico with his partner Max is revealed in flashback.", 47, "2011-09-04"},
		{9,  s4, "Bug", "Jesse gives Walt a GPS bug at Gus's command and Walt discovers Jesse's growing loyalty to Gus. The two engage in a brutal fistfight that ends their partnership temporarily.", 47, "2011-09-11"},
		{10, s4, "Salud", "Jesse accompanies Mike and Gus to Mexico to meet the cartel. Gus poisons the entire cartel leadership in a long-planned act of vengeance for Max's death.", 47, "2011-09-18"},
		{11, s4, "Crawl Space", "Walt discovers Skyler gave Ted Beneke his drug money to pay the IRS. When Walt goes to retrieve his cash reserves, he finds them nearly depleted — and breaks into hysterical laughter.", 47, "2011-09-25"},
		{12, s4, "End Times", "Walt prepares for Gus to kill him. Brock, Jesse's girlfriend Andrea's son, is poisoned. Jesse accuses Walt, but Walt manipulates him into believing Gus is responsible.", 47, "2011-10-02"},
		{13, s4, "Face Off", "Walt orchestrates Gus's assassination using Hector Salamanca as a suicide bomber. Gus walks out adjusting his tie before collapsing — revealing half his face is gone.", 54, "2011-10-09"},
		// S5
		{1,  s5, "Live Free or Die", "In a flash-forward, Walt celebrates his 52nd birthday alone with a machine gun. In the present, Walt, Jesse, and Mike use magnets to destroy Gus's laptop evidence.", 47, "2012-07-15"},
		{2,  s5, "Madrigal", "The DEA investigates Madrigal Electromotive, Gus's corporate parent. Walt, Jesse, and Mike form a new partnership.", 47, "2012-07-22"},
		{3,  s5, "Hazard Pay", "The new crew sets up a mobile meth lab inside fumigated houses. Walt manipulates Jesse into breaking up with Andrea. Saul warns Walt that three is a crowd.", 47, "2012-07-29"},
		{4,  s5, "Fifty-One", "Walt turns 51 and celebrates while Skyler's silent desperation grows. Skyler stages a breakdown to send the children to Hank and Marie's, trying to protect them from Walt.", 47, "2012-08-05"},
		{5,  s5, "Dead Freight", "The crew executes a stunning train heist to steal methylamine. Just as the perfect crime succeeds, young Drew Sharp witnesses the aftermath and is shot by Todd.", 47, "2012-08-12"},
		{6,  s5, "Buyout", "Jesse wants out after Drew Sharp's murder. Mike also wants to sell the methylamine. Walt refuses, insisting he is in the empire business.", 47, "2012-08-19"},
		{7,  s5, "Say My Name", "Walt negotiates directly with Declan, demanding recognition as Heisenberg. Walt kills Mike in a riverside confrontation.", 47, "2012-08-26"},
		{8,  s5, "Gliding Over All", "Walt has Mike's nine men killed simultaneously in prison. Hank discovers Walt is Heisenberg while reading in the bathroom.", 47, "2012-09-02"},
		{9,  s5, "Blood Money", "Hank confronts Walt in an explosive garage scene. Walt warns Hank to 'tread lightly.' Jesse disposes of his drug money by throwing it from his car.", 47, "2013-08-11"},
		{10, s5, "Buried", "Hank tries to turn Skyler against Walt. Walt buries his money in the desert. Hank secretly records Skyler and contacts an attorney.", 47, "2013-08-18"},
		{11, s5, "Confessions", "Walt records a fake confession video framing Hank as Heisenberg. Jesse figures out that Walt poisoned Brock and attacks Saul's office in fury.", 47, "2013-08-25"},
		{12, s5, "Rabid Dog", "Jesse attempts to burn down the White house but is stopped by Hank. Jesse agrees to help the DEA. Walt orders Jesse's death.", 47, "2013-09-01"},
		{13, s5, "To'hajiilee", "Jesse tricks Walt into leading them to his buried money. Walt calls the white supremacist gang — but they arrive anyway, and Hank is killed.", 47, "2013-09-08"},
		{14, s5, "Ozymandias", "Widely regarded as one of the greatest TV episodes ever made. Hank is executed. Walt's empire collapses entirely. Jesse is enslaved by the Nazis.", 47, "2013-09-15"},
		{15, s5, "Granite State", "Walt lives in exile in a New Hampshire cabin. Saul flees to Omaha. Jesse is forced to cook for the neo-Nazis as a prisoner.", 55, "2013-09-22"},
		{16, s5, "Felina", "Walt returns to Albuquerque for one final act. He liberates Jesse, kills the Nazi gang, and poisons Lydia. He dies in the lab.", 56, "2013-09-29"},
	}
	episodes := make([]models.Episode, len(eps))
	for i, e := range eps {
		ep := models.Episode{
			ShowID:         show.ID,
			SeasonID:       e.sid,
			EpisodeNumber:  e.num,
			Title:          e.title,
			Description:    e.desc,
			RuntimeMinutes: e.mins,
			AirDate:        parseDate(e.date),
		}
		DB.Create(&ep)
		episodes[i] = ep
	}

	// Characters — intentional duplicate Jesse Pinkman bug preserved
	type charDef struct {
		name, actor, bio, status, image string
		isMain                          bool
	}
	chars := []charDef{
		{"Walter White", "Bryan Cranston", `A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine manufacturer known as "Heisenberg". His diagnosis of inoperable lung cancer sets the entire story in motion.`, "deceased", "/images/characters/walter-white.jpg", true},
		{"Jesse Pinkman", "Aaron Paul", "Walt's former student and small-time meth dealer turned manufacturing partner. Jesse struggles with guilt, addiction, and his own moral code throughout the series.", "alive", "/images/characters/jesse-pinkman.jpg", true},
		{"Skyler White", "Anna Gunn", "Walter's pregnant wife and mother of Walt Jr. A meticulous bookkeeper who grows increasingly suspicious of Walt's activities before becoming an unwilling accomplice in money laundering.", "alive", "/images/characters/skyler-white.jpg", true},
		{"Hank Schrader", "Dean Norris", "Walter's boisterous brother-in-law and DEA agent whose investigation of Heisenberg leads him ever closer to the truth. Killed by Jack Welker's gang in the New Mexico desert.", "deceased", "/images/characters/hank-schrader.jpg", true},
		// BUG: DUPLICATE JESSE PINKMAN – intentional workshop bug
		{"Jesse Pinkman", "Aaron Paul", "Walt's former student and partner in the methamphetamine business.", "alive", "/images/characters/jesse-pinkman.jpg", true},
		{"Saul Goodman", "Bob Odenkirk", "Flamboyant criminal lawyer Jimmy McGill who operates under the alias Saul Goodman. Eventually flees to Omaha as 'Gene Takavic'.", "alive", "/images/characters/saul-goodman.jpg", false},
		{"Gustavo Fring", "Giancarlo Esposito", "The polite, meticulous owner of the Los Pollos Hermanos fast food chain who secretly operates a massive methamphetamine distribution network.", "deceased", "/images/characters/gustavo-fring.jpg", true},
		{"Mike Ehrmantraut", "Jonathan Banks", "Gus Fring's fixer and enforcer — a former Philadelphia cop with a strict moral code. Shot by Walt in a petulant rage.", "deceased", "/images/characters/mike-ehrmantraut.jpg", true},
		{"Marie Schrader", "Betsy Brandt", "Skyler's sister and Hank's wife. A radiologic technologist with a compulsive shoplifting habit.", "alive", "/images/characters/marie-schrader.jpg", true},
		{"Walter White Jr.", "RJ Mitte", "Walt and Skyler's teenage son, who has cerebral palsy and goes by the nickname Flynn. He idolizes his father and is devastated when the truth about Walt is revealed.", "alive", "/images/characters/walter-white-jr.jpg", true},
		{"Lydia Rodarte-Quayle", "Laura Fraser", "A high-strung Madrigal Electromotive executive who manages the methylamine supply chain. Poisoned by Walt with ricin in the finale.", "deceased", "/images/characters/lydia-rodarte-quayle.jpg", false},
		{"Todd Alquist", "Jesse Plemons", "A cheerful, sociopathic young man who kills young Drew Sharp without hesitation and holds Jesse captive as a slave.", "deceased", "/images/characters/todd-alquist.jpg", false},
		{"Tuco Salamanca", "Raymond Cruz", "A volatile, unpredictable cartel distributor who becomes Walt and Jesse's first major buyer. His erratic violence makes him one of the series' most dangerous early antagonists.", "deceased", "/images/characters/tuco-salamanca.jpg", false},
		{"Jane Margolis", "Krysten Ritter", "Jesse's neighbor and landlord who becomes his girlfriend and enables his relapse into heroin. Her death is a pivotal moral turning point.", "deceased", "/images/characters/jane-margolis.jpg", false},
		{"Gale Boetticher", "David Costabile", "A brilliant, idealistic chemist hired by Gus to work alongside Walt. Tragically shot by Jesse on Walt's orders.", "deceased", "/images/characters/gale-boetticher.jpg", false},
	}
	characters := make([]models.Character, len(chars))
	for i, c := range chars {
		ch := models.Character{
			ShowID:          show.ID,
			Name:            c.name,
			ActorName:       c.actor,
			Bio:             c.bio,
			IsMainCharacter: c.isMain,
			Status:          c.status,
			ImageURL:        c.image,
		}
		DB.Create(&ch)
		characters[i] = ch
	}

	// Sample quotes
	qs := []struct {
		char    *models.Character
		episode *models.Episode
		text    string
		famous  bool
	}{
		{&characters[0], &episodes[0],  "I am not in danger, Skyler. I am the danger!", true},
		{&characters[1], &episodes[0],  "Yeah, science!", true},
		{&characters[0], &episodes[52], "Say my name.", true},
		{&characters[4], &episodes[1],  "Yeah, Mr. White! Yeah, science!", false}, // duplicate Jesse (intentional bug)
		{&characters[2], &episodes[3],  "Someone has to protect this family from the man who protects this family.", true},
		{&characters[3], &episodes[4],  "Jesus Christ, Marie, they're minerals!", false},
		{&characters[6], &episodes[45], "I have been in the empire business long enough to know that an empire is never truly owned — only borrowed.", true},
		{&characters[7], &episodes[52], "No more half measures, Walter.", true},
	}
	for _, q := range qs {
		charID := q.char.ID
		epID := q.episode.ID
		DB.Create(&models.Quote{
			ShowID:      show.ID,
			CharacterID: &charID,
			EpisodeID:   &epID,
			QuoteText:   q.text,
			IsFamous:    q.famous,
		})
	}
}
