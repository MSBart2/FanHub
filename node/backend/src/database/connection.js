// Database connection — SQLite via better-sqlite3
"use strict";

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "..", "fanhub.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    start_year INTEGER,
    end_year INTEGER,
    network TEXT,
    poster_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title TEXT,
    episode_count INTEGER,
    air_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    air_date TEXT,
    runtime_minutes INTEGER,
    director TEXT,
    writer TEXT,
    thumbnail_url TEXT,
    rating REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    actor_name TEXT,
    bio TEXT,
    image_url TEXT,
    is_main_character INTEGER DEFAULT 0,
    first_appearance INTEGER REFERENCES episodes(id),
    status TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS character_episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    is_featured INTEGER DEFAULT 0,
    UNIQUE(character_id, episode_id)
  );
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
    quote_text TEXT NOT NULL,
    context TEXT,
    is_famous INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// ── Seed ──────────────────────────────────────────────────────────────────────
(function seed() {
  if (db.prepare("SELECT COUNT(*) as n FROM shows").get().n > 0) return;

  const showId = db
    .prepare(
      `INSERT INTO shows (title, description, genre, start_year, end_year, network) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      "Breaking Bad",
      "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
      "Crime Drama",
      2008,
      2013,
      "AMC",
    ).lastInsertRowid;

  const insSeason = db.prepare(
    `INSERT INTO seasons (show_id, season_number, title, episode_count) VALUES (?, ?, ?, ?)`,
  );
  const s1 = insSeason.run(showId, 1, "Season 1", 7).lastInsertRowid;
  const s2 = insSeason.run(showId, 2, "Season 2", 13).lastInsertRowid;
  const s3 = insSeason.run(showId, 3, "Season 3", 13).lastInsertRowid;
  const s4 = insSeason.run(showId, 4, "Season 4", 13).lastInsertRowid;
  const s5 = insSeason.run(showId, 5, "Season 5", 16).lastInsertRowid;

  const insEp = db.prepare(
    `INSERT INTO episodes (show_id, season_id, episode_number, title, description, runtime_minutes, air_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const ep = (...a) => insEp.run(...a).lastInsertRowid;

  // Season 1
  const e1_1 = ep(
    showId,
    s1,
    1,
    "Pilot",
    "Walter White, a mild-mannered high school chemistry teacher, is diagnosed with inoperable lung cancer. Desperate to secure his family's future, he partners with former student Jesse Pinkman to cook and sell methamphetamine.",
    58,
    "2008-01-20",
  );
  const e1_2 = ep(
    showId,
    s1,
    2,
    "Cat's in the Bag...",
    "Walt and Jesse attempt to dispose of the bodies of the two dealers they killed. They flip a coin to decide who handles which situation, leading to grim consequences.",
    48,
    "2008-01-27",
  );
  const e1_3 = ep(
    showId,
    s1,
    3,
    "...And the Bag's in the River",
    "Walt and Jesse clean up after the bathtub incident. Walt is forced to make a life-or-death decision about their captive, Emilio's cousin Krazy-8.",
    48,
    "2008-02-10",
  );
  const e1_4 = ep(
    showId,
    s1,
    4,
    "Cancer Man",
    "Walt keeps his cancer diagnosis secret from his family, but eventually tells his sister-in-law Marie. Jesse tries to reconnect with his family, with mixed results.",
    48,
    "2008-02-17",
  );
  const e1_5 = ep(
    showId,
    s1,
    5,
    "Gray Matter",
    "Walt rejects financial help from his wealthy former business partners Elliott and Gretchen Schwartz. He refuses cancer treatment but is conflicted when Skyler makes it a family issue.",
    48,
    "2008-02-24",
  );
  const e1_6 = ep(
    showId,
    s1,
    6,
    "Crazy Handful of Nothin'",
    "Walt shaves his head as his hair falls out from chemotherapy. He and Jesse make contact with volatile drug distributor Tuco Salamanca, and Walt's alter ego Heisenberg emerges.",
    48,
    "2008-03-02",
  );
  const e1_7 = ep(
    showId,
    s1,
    7,
    "A No-Rough-Stuff-Type Deal",
    "Walt and Jesse agree to produce a larger quantity of meth for Tuco. Walt attempts to acquire methylamine and encounters unexpected obstacles at a chemical warehouse.",
    48,
    "2008-03-09",
  );

  // Season 2
  const e2_1 = ep(
    showId,
    s2,
    1,
    "Seven Thirty-Seven",
    "Walt and Jesse face the terrifying prospect of Tuco's retaliation after a violent meeting. Walt starts to consider that Tuco needs to be eliminated for their survival.",
    47,
    "2009-03-08",
  );
  const e2_2 = ep(
    showId,
    s2,
    2,
    "Grilled",
    "Walt and Jesse are held captive by Tuco in a remote desert shack, along with his wheelchair-bound uncle Hector Salamanca. A tense standoff leads to a violent conclusion.",
    47,
    "2009-03-15",
  );
  const e2_3 = ep(
    showId,
    s2,
    3,
    "Bit by a Dead Bee",
    "In the aftermath of Tuco's death, Walt and Jesse must create alibis for their whereabouts. Walt feigns a fugue state while Jesse deals with the police.",
    47,
    "2009-03-22",
  );
  const e2_4 = ep(
    showId,
    s2,
    4,
    "Down",
    "Jesse is evicted by his parents and faces homelessness. Walt fights with Skyler about money while hiding his drug income. Jesse hits rock bottom.",
    47,
    "2009-03-29",
  );
  const e2_5 = ep(
    showId,
    s2,
    5,
    "Breakage",
    "Walt and Jesse establish a new distribution chain. Hank suffers lasting trauma from the Tuco shootout. Walt invests drug money in Skyler's gambling winnings story.",
    47,
    "2009-04-05",
  );
  const e2_6 = ep(
    showId,
    s2,
    6,
    "Peekaboo",
    "Jesse tracks down two meth addicts who robbed one of their dealers. He discovers their neglected young son living in squalor and is moved by the child's plight.",
    47,
    "2009-04-12",
  );
  const e2_7 = ep(
    showId,
    s2,
    7,
    "Negro y Azul",
    "The impact of Heisenberg's blue meth reaches the Mexican cartel. Jesse tries to build street cred with his dealers. Hank is transferred to El Paso.",
    47,
    "2009-04-19",
  );
  const e2_8 = ep(
    showId,
    s2,
    8,
    "Better Call Saul",
    "Walt and Jesse are introduced to flamboyant criminal lawyer Saul Goodman, who quickly becomes indispensable to their operation.",
    47,
    "2009-04-26",
  );
  const e2_9 = ep(
    showId,
    s2,
    9,
    "4 Days Out",
    "Walt and Jesse take the RV out to the desert for a massive cook, but find themselves stranded when the battery dies. A harrowing test of survival and ingenuity follows.",
    47,
    "2009-05-03",
  );
  const e2_10 = ep(
    showId,
    s2,
    10,
    "Over",
    "Walt receives encouraging news about his cancer. He begins to contemplate what life after meth would look like, but finds himself unable to simply walk away.",
    47,
    "2009-05-10",
  );
  const e2_11 = ep(
    showId,
    s2,
    11,
    "Mandala",
    "Walt and Jesse secure a major new distribution deal through Saul. Jesse begins a romance with his neighbor Jane Margolis, unaware of her troubled past.",
    47,
    "2009-05-17",
  );
  const e2_12 = ep(
    showId,
    s2,
    12,
    "Phoenix",
    "Jesse's relationship with Jane spirals into a dangerous relapse. Walt makes a devastating decision that will haunt him for the rest of the series.",
    47,
    "2009-05-24",
  );
  const e2_13 = ep(
    showId,
    s2,
    13,
    "ABQ",
    "The season finale ties together the season's flash-forward images. A mid-air collision over Albuquerque results from a chain of events set in motion by Walt's actions.",
    47,
    "2009-05-31",
  );

  // Season 3
  const e3_1 = ep(
    showId,
    s3,
    1,
    "No Más",
    "Walt and Skyler's marriage reaches a breaking point. The Cousins arrive in Albuquerque targeting Walt. Gus Fring intervenes to protect his investment.",
    47,
    "2010-03-21",
  );
  const e3_2 = ep(
    showId,
    s3,
    2,
    "Caballo Sin Nombre",
    "Walt moves into an apartment after Skyler files for divorce. The Cousins close in on Walt, but are diverted at the last moment by a cryptic order.",
    47,
    "2010-03-28",
  );
  const e3_3 = ep(
    showId,
    s3,
    3,
    "I.F.T.",
    "Skyler has an affair with her boss Ted Beneke and announces it to Walt in a shocking confrontation. Walt refuses to leave the family home despite the separation.",
    47,
    "2010-04-04",
  );
  const e3_4 = ep(
    showId,
    s3,
    4,
    "Green Light",
    "Skyler grows closer to Ted. Jesse begins manufacturing on his own and encroaches on Gus's territory. Walt learns about the lab and tries to reclaim control.",
    47,
    "2010-04-11",
  );
  const e3_5 = ep(
    showId,
    s3,
    5,
    "Más",
    "Gus offers Walt an extraordinary deal to cook in a state-of-the-art underground superlab beneath a laundry facility. Walt is tempted despite his promises to get out.",
    47,
    "2010-04-18",
  );
  const e3_6 = ep(
    showId,
    s3,
    6,
    "Sunset",
    "Walt and Gale begin cooking in the superlab. Jesse discovers the RV could be found and works to destroy evidence. Hank closes in on the RV's location.",
    47,
    "2010-04-25",
  );
  const e3_7 = ep(
    showId,
    s3,
    7,
    "One Minute",
    "Hank brutally assaults Jesse after a tip. The Cousins ambush Hank in a parking lot in a stunning action sequence that leaves Hank fighting for his life.",
    47,
    "2010-05-02",
  );
  const e3_8 = ep(
    showId,
    s3,
    8,
    "I See You",
    "Walter waits at the hospital as Hank undergoes surgery. The cartel retaliates against the attack on the Cousins. Tensions escalate between Walt and Gus.",
    47,
    "2010-05-09",
  );
  const e3_9 = ep(
    showId,
    s3,
    9,
    "Kafkaesque",
    "Jesse proposes skimming product to sell on the side. Skyler discovers Walt's second phone and suspects infidelity. Hank recovers slowly and grows increasingly frustrated.",
    47,
    "2010-05-16",
  );
  const e3_10 = ep(
    showId,
    s3,
    10,
    "Fly",
    "Walt becomes obsessed with eliminating a fly that has contaminated the lab. A fan-favorite bottle episode that delves into Walt's psyche.",
    47,
    "2010-05-23",
  );
  const e3_11 = ep(
    showId,
    s3,
    11,
    "Abiquiú",
    "Jesse begins attending a support group where he meets Andrea and her young son Brock. Skyler investigates Ted's financial irregularities.",
    47,
    "2010-05-30",
  );
  const e3_12 = ep(
    showId,
    s3,
    12,
    "Half Measures",
    "Jesse plans to kill two dealers working for Gus who used a child to commit murder. Walt makes a dramatic and violent intervention to protect Jesse at a critical moment.",
    47,
    "2010-06-06",
  );
  const e3_13 = ep(
    showId,
    s3,
    13,
    "Full Measure",
    "Walt and Jesse face elimination by Gus. Walt sends Jesse to kill Gale Boetticher, Gus's other chemist, to make themselves indispensable. Jesse pulls the trigger.",
    47,
    "2010-06-13",
  );

  // Season 4
  const e4_1 = ep(
    showId,
    s4,
    1,
    "Box Cutter",
    "Gus responds to Gale's murder with a shocking act of violence intended to send Walt and Jesse a message. The superlab must continue running.",
    47,
    "2011-07-17",
  );
  const e4_2 = ep(
    showId,
    s4,
    2,
    "Thirty-Eight Snub",
    "Walt purchases an illegal handgun to protect himself from Gus. Jesse throws non-stop parties at his house to avoid confronting his guilt over Gale's death.",
    47,
    "2011-07-24",
  );
  const e4_3 = ep(
    showId,
    s4,
    3,
    "Open House",
    "Marie copes with stress by shoplifting and visiting open houses. Jesse continues his self-destructive party lifestyle. Walt tries to forge an alliance against Gus.",
    47,
    "2011-07-31",
  );
  const e4_4 = ep(
    showId,
    s4,
    4,
    "Bullet Points",
    "Skyler and Walt rehearse their cover story about his gambling winnings. Hank shows Walt his notes on Gale's murder, unknowingly revealing how close he is to the truth.",
    47,
    "2011-08-07",
  );
  const e4_5 = ep(
    showId,
    s4,
    5,
    "Shotgun",
    "Mike takes Jesse on a mysterious errand run. Walt grows jealous and paranoid at the thought that Gus is cultivating Jesse to replace him. Hank suspects Gale isn't Heisenberg.",
    47,
    "2011-08-14",
  );
  const e4_6 = ep(
    showId,
    s4,
    6,
    "Cornered",
    "Walt makes the infamous declaration that he is the danger, not in danger. Jesse gains respect in the cartel's eyes. Skyler grows increasingly troubled by Walt's behavior.",
    47,
    "2011-08-21",
  );
  const e4_7 = ep(
    showId,
    s4,
    7,
    "Problem Dog",
    "Jesse attends his support group and gives a veiled confession about killing Gale. Walt tries to convince Saul to arrange Gus's assassination but Saul refuses.",
    47,
    "2011-08-28",
  );
  const e4_8 = ep(
    showId,
    s4,
    8,
    "Hermanos",
    "Hank questions Gus about his connection to the Pollos Hermanos operation. Gus's tragic backstory in Mexico with his partner Max is revealed in flashback.",
    47,
    "2011-09-04",
  );
  const e4_9 = ep(
    showId,
    s4,
    9,
    "Bug",
    "Jesse gives Walt a GPS bug at Gus's command and Walt discovers Jesse's growing loyalty to Gus. The two engage in a brutal fistfight that ends their partnership temporarily.",
    47,
    "2011-09-11",
  );
  const e4_10 = ep(
    showId,
    s4,
    10,
    "Salud",
    "Jesse accompanies Mike and Gus to Mexico to meet the cartel. Gus poisons the entire cartel leadership in a long-planned act of vengeance for Max's death.",
    47,
    "2011-09-18",
  );
  const e4_11 = ep(
    showId,
    s4,
    11,
    "Crawl Space",
    "Walt discovers Skyler gave Ted Beneke his drug money to pay the IRS. When Walt goes to retrieve his cash reserves, he finds them nearly depleted — and breaks into hysterical laughter.",
    47,
    "2011-09-25",
  );
  const e4_12 = ep(
    showId,
    s4,
    12,
    "End Times",
    "Walt prepares for Gus to kill him. Brock, Jesse's girlfriend Andrea's son, is poisoned. Jesse accuses Walt, but Walt manipulates him into believing Gus is responsible.",
    47,
    "2011-10-02",
  );
  const e4_13 = ep(
    showId,
    s4,
    13,
    "Face Off",
    "Walt orchestrates Gus's assassination using Hector Salamanca as a suicide bomber. Gus walks out adjusting his tie before collapsing — revealing half his face is gone.",
    54,
    "2011-10-09",
  );

  // Season 5
  const e5_1 = ep(
    showId,
    s5,
    1,
    "Live Free or Die",
    "In a flash-forward, Walt celebrates his 52nd birthday alone with a machine gun. In the present, Walt, Jesse, and Mike use magnets to destroy Gus's laptop evidence.",
    47,
    "2012-07-15",
  );
  const e5_2 = ep(
    showId,
    s5,
    2,
    "Madrigal",
    "The DEA investigates Madrigal Electromotive, Gus's corporate parent. Walt, Jesse, and Mike form a new partnership.",
    47,
    "2012-07-22",
  );
  const e5_3 = ep(
    showId,
    s5,
    3,
    "Hazard Pay",
    "The new crew sets up a mobile meth lab inside fumigated houses. Walt manipulates Jesse into breaking up with Andrea. Saul warns Walt that three is a crowd.",
    47,
    "2012-07-29",
  );
  const e5_4 = ep(
    showId,
    s5,
    4,
    "Fifty-One",
    "Walt turns 51 and celebrates while Skyler's silent desperation grows. Skyler stages a breakdown to send the children to Hank and Marie's, trying to protect them from Walt.",
    47,
    "2012-08-05",
  );
  const e5_5 = ep(
    showId,
    s5,
    5,
    "Dead Freight",
    "The crew executes a stunning train heist to steal methylamine. Just as the perfect crime succeeds, young Drew Sharp witnesses the aftermath and is shot by Todd.",
    47,
    "2012-08-12",
  );
  const e5_6 = ep(
    showId,
    s5,
    6,
    "Buyout",
    "Jesse wants out after Drew Sharp's murder. Mike also wants to sell the methylamine. Walt refuses, insisting he is in the empire business.",
    47,
    "2012-08-19",
  );
  const e5_7 = ep(
    showId,
    s5,
    7,
    "Say My Name",
    "Walt negotiates directly with Declan, demanding recognition as Heisenberg. Walt kills Mike in a riverside confrontation.",
    47,
    "2012-08-26",
  );
  const e5_8 = ep(
    showId,
    s5,
    8,
    "Gliding Over All",
    "Walt has Mike's nine men killed simultaneously in prison. Hank discovers Walt is Heisenberg while reading in the bathroom.",
    47,
    "2012-09-02",
  );
  const e5_9 = ep(
    showId,
    s5,
    9,
    "Blood Money",
    "Hank confronts Walt in an explosive garage scene. Walt warns Hank to 'tread lightly.' Jesse disposes of his drug money by throwing it from his car.",
    47,
    "2013-08-11",
  );
  const e5_10 = ep(
    showId,
    s5,
    10,
    "Buried",
    "Hank tries to turn Skyler against Walt. Walt buries his money in the desert. Hank secretly records Skyler and contacts an attorney.",
    47,
    "2013-08-18",
  );
  const e5_11 = ep(
    showId,
    s5,
    11,
    "Confessions",
    "Walt records a fake confession video framing Hank as Heisenberg. Jesse figures out that Walt poisoned Brock and attacks Saul's office in fury.",
    47,
    "2013-08-25",
  );
  const e5_12 = ep(
    showId,
    s5,
    12,
    "Rabid Dog",
    "Jesse attempts to burn down the White house but is stopped by Hank. Jesse agrees to help the DEA. Walt orders Jesse's death.",
    47,
    "2013-09-01",
  );
  const e5_13 = ep(
    showId,
    s5,
    13,
    "To'hajiilee",
    "Jesse tricks Walt into leading them to his buried money. Walt calls the white supremacist gang for backup — but they arrive anyway, and Hank is killed.",
    47,
    "2013-09-08",
  );
  const e5_14 = ep(
    showId,
    s5,
    14,
    "Ozymandias",
    "Widely regarded as one of the greatest TV episodes ever made. Hank is executed. Walt's empire collapses entirely. Jesse is enslaved by the Nazis.",
    47,
    "2013-09-15",
  );
  const e5_15 = ep(
    showId,
    s5,
    15,
    "Granite State",
    "Walt lives in exile in a New Hampshire cabin. Saul flees to Omaha. Jesse is forced to cook for the neo-Nazis as a prisoner.",
    55,
    "2013-09-22",
  );
  const e5_16 = ep(
    showId,
    s5,
    16,
    "Felina",
    "Walt returns to Albuquerque for one final act. He liberates Jesse, kills the Nazi gang, and poisons Lydia. He dies in the lab.",
    56,
    "2013-09-29",
  );

  // Characters (intentional duplicate Jesse Pinkman bug preserved)
  const insChar = db.prepare(
    `INSERT INTO characters (show_id, name, actor_name, bio, is_main_character, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const char = (...a) => insChar.run(...a).lastInsertRowid;

  const cWalt = char(
    showId,
    "Walter White",
    "Bryan Cranston",
    'A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine manufacturer known as "Heisenberg". His diagnosis of inoperable lung cancer sets the entire story in motion.',
    1,
    "deceased",
    "/images/characters/walter-white.jpg",
  );
  const cJesse = char(
    showId,
    "Jesse Pinkman",
    "Aaron Paul",
    "Walt's former student and small-time meth dealer turned manufacturing partner. Jesse struggles with guilt, addiction, and his own moral code throughout the series.",
    1,
    "alive",
    "/images/characters/jesse-pinkman.jpg",
  );
  const cSkyler = char(
    showId,
    "Skyler White",
    "Anna Gunn",
    "Walter's pregnant wife and mother of Walt Jr. A meticulous bookkeeper who grows increasingly suspicious of Walt's activities before becoming an unwilling accomplice in money laundering.",
    1,
    "alive",
    "/images/characters/skyler-white.jpg",
  );
  const cHank = char(
    showId,
    "Hank Schrader",
    "Dean Norris",
    "Walter's boisterous brother-in-law and DEA agent whose investigation of Heisenberg leads him ever closer to the truth. Killed by Jack Welker's gang in the New Mexico desert.",
    1,
    "deceased",
    "/images/characters/hank-schrader.jpg",
  );
  // BUG: DUPLICATE JESSE PINKMAN – intentional workshop bug
  const cJesse2 = char(
    showId,
    "Jesse Pinkman",
    "Aaron Paul",
    "Walt's former student and partner in the methamphetamine business.",
    1,
    "alive",
    "/images/characters/jesse-pinkman.jpg",
  );
  const cSaul = char(
    showId,
    "Saul Goodman",
    "Bob Odenkirk",
    "Flamboyant criminal lawyer Jimmy McGill who operates under the alias Saul Goodman. Eventually flees to Omaha as 'Gene Takavic'.",
    0,
    "alive",
    "/images/characters/saul-goodman.jpg",
  );
  const cGus = char(
    showId,
    "Gustavo Fring",
    "Giancarlo Esposito",
    "The polite, meticulous owner of the Los Pollos Hermanos fast food chain who secretly operates a massive methamphetamine distribution network.",
    1,
    "deceased",
    "/images/characters/gustavo-fring.jpg",
  );
  const cMike = char(
    showId,
    "Mike Ehrmantraut",
    "Jonathan Banks",
    "Gus Fring's fixer and enforcer — a former Philadelphia cop with a strict moral code. Shot by Walt in a petulant rage.",
    1,
    "deceased",
    "/images/characters/mike-ehrmantraut.jpg",
  );
  const cMarie = char(
    showId,
    "Marie Schrader",
    "Betsy Brandt",
    "Skyler's sister and Hank's wife. A radiologic technologist with a compulsive shoplifting habit.",
    1,
    "alive",
    "/images/characters/marie-schrader.jpg",
  );
  const cWaltJr = char(
    showId,
    "Walter White Jr.",
    "RJ Mitte",
    "Walt and Skyler's teenage son, who has cerebral palsy and goes by the nickname Flynn. He idolizes his father and is devastated when the truth about Walt is revealed.",
    1,
    "alive",
    "/images/characters/walter-white-jr.jpg",
  );
  const cLydia = char(
    showId,
    "Lydia Rodarte-Quayle",
    "Laura Fraser",
    "A high-strung Madrigal Electromotive executive who manages the methylamine supply chain. Poisoned by Walt with ricin in the finale.",
    0,
    "deceased",
    "/images/characters/lydia-rodarte-quayle.jpg",
  );
  const cTodd = char(
    showId,
    "Todd Alquist",
    "Jesse Plemons",
    "A cheerful, sociopathic young man who kills young Drew Sharp without hesitation and holds Jesse captive as a slave.",
    0,
    "deceased",
    "/images/characters/todd-alquist.jpg",
  );
  const cTuco = char(
    showId,
    "Tuco Salamanca",
    "Raymond Cruz",
    "A volatile, unpredictable cartel distributor who becomes Walt and Jesse's first major buyer. His erratic violence makes him one of the series' most dangerous early antagonists.",
    0,
    "deceased",
    "/images/characters/tuco-salamanca.jpg",
  );
  const cJane = char(
    showId,
    "Jane Margolis",
    "Krysten Ritter",
    "Jesse's neighbor and landlord who becomes his girlfriend and enables his relapse into heroin. Her death is a pivotal moral turning point.",
    0,
    "deceased",
    "/images/characters/jane-margolis.jpg",
  );
  const cGale = char(
    showId,
    "Gale Boetticher",
    "David Costabile",
    "A brilliant, idealistic chemist hired by Gus to work alongside Walt. Tragically shot by Jesse on Walt's orders.",
    0,
    "deceased",
    "/images/characters/gale-boetticher.jpg",
  );

  // Quotes
  const insQ = db.prepare(
    `INSERT INTO quotes (show_id, character_id, episode_id, quote_text, is_famous) VALUES (?, ?, ?, ?, ?)`,
  );
  insQ.run(
    showId,
    cWalt,
    e1_1,
    "I am not in danger, Skyler. I am the danger!",
    1,
  );
  insQ.run(showId, cJesse, e1_1, "Yeah, science!", 1);
  insQ.run(showId, cWalt, e5_7, "Say my name.", 1);
  insQ.run(showId, cJesse2, e1_2, "Yeah, Mr. White! Yeah, science!", 0); // uses duplicate Jesse (intentional bug)
  insQ.run(
    showId,
    cSkyler,
    e1_4,
    "Someone has to protect this family from the man who protects this family.",
    1,
  );
  insQ.run(showId, cHank, e1_5, "Jesus Christ, Marie, they're minerals!", 0);
  insQ.run(
    showId,
    cGus,
    e4_13,
    "I have been in the empire business long enough to know that an empire is never truly owned — only borrowed.",
    1,
  );
  insQ.run(showId, cMike, e5_7, "No more half measures, Walter.", 1);
})();

// ── Query helper ──────────────────────────────────────────────────────────────
// Converts PostgreSQL $1,$2 placeholders and ILIKE/NOW() to SQLite equivalents
function pgToSqlite(sql) {
  return sql
    .replace(/\$\d+/g, "?")
    .replace(/\bILIKE\b/gi, "LIKE")
    .replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");
}

function query(sql, params = []) {
  try {
    const sqliteSql = pgToSqlite(sql);
    const upper = sqliteSql.trim().toUpperCase();
    const stmt = db.prepare(sqliteSql);

    if (
      upper.startsWith("SELECT") ||
      upper.startsWith("WITH") ||
      upper.includes("RETURNING")
    ) {
      const rows = stmt.all(...params);
      return Promise.resolve({ rows, rowCount: rows.length });
    } else {
      const info = stmt.run(...params);
      return Promise.resolve({
        rows: [],
        rowCount: info.changes,
        lastInsertRowid: info.lastInsertRowid,
      });
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getClient() {
  return { query: (sql, params) => query(sql, params), release: () => {} };
}

module.exports = { query, getClient, pool: { query } };
module.exports.default = { query, getClient };
