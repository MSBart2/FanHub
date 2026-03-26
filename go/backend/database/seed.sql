-- FanHub Seed Data — Breaking Bad (PostgreSQL)
-- Full dataset with intentional duplicate Jesse Pinkman bug for testing

-- Insert Breaking Bad
INSERT INTO shows (title, description, genre, start_year, end_year, network)
VALUES (
    'Breaking Bad',
    'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family''s future.',
    'Crime Drama',
    2008,
    2013,
    'AMC'
);

-- Insert seasons
INSERT INTO seasons (show_id, season_number, title, episode_count) VALUES
(1, 1, 'Season 1',  7),
(1, 2, 'Season 2', 13),
(1, 3, 'Season 3', 13),
(1, 4, 'Season 4', 13),
(1, 5, 'Season 5', 16);

-- Insert episodes — all 5 seasons
INSERT INTO episodes (show_id, season_id, episode_number, title, description, runtime_minutes, air_date) VALUES
-- Season 1
(1, 1,  1, 'Pilot',                       'Walter White, a mild-mannered high school chemistry teacher, is diagnosed with inoperable lung cancer. Desperate to secure his family''s future, he partners with former student Jesse Pinkman to cook and sell methamphetamine.', 58, '2008-01-20'),
(1, 1,  2, 'Cat''s in the Bag...',         'Walt and Jesse attempt to dispose of the bodies of the two dealers they killed. They flip a coin to decide who handles which situation, leading to grim consequences.', 48, '2008-01-27'),
(1, 1,  3, '...And the Bag''s in the River','Walt and Jesse clean up after the bathtub incident. Walt is forced to make a life-or-death decision about their captive, Emilio''s cousin Krazy-8.', 48, '2008-02-10'),
(1, 1,  4, 'Cancer Man',                   'Walt keeps his cancer diagnosis secret from his family, but eventually tells his sister-in-law Marie. Jesse tries to reconnect with his family, with mixed results.', 48, '2008-02-17'),
(1, 1,  5, 'Gray Matter',                  'Walt rejects financial help from his wealthy former business partners Elliott and Gretchen Schwartz. He refuses cancer treatment but is conflicted when Skyler makes it a family issue.', 48, '2008-02-24'),
(1, 1,  6, 'Crazy Handful of Nothin''',    'Walt shaves his head as his hair falls out from chemotherapy. He and Jesse make contact with volatile drug distributor Tuco Salamanca, and Walt''s alter ego Heisenberg emerges.', 48, '2008-03-02'),
(1, 1,  7, 'A No-Rough-Stuff-Type Deal',   'Walt and Jesse agree to produce a larger quantity of meth for Tuco. Walt attempts to acquire methylamine and encounters unexpected obstacles at a chemical warehouse.', 48, '2008-03-09'),
-- Season 2
(1, 2,  1, 'Seven Thirty-Seven',           'Walt and Jesse face the terrifying prospect of Tuco''s retaliation after a violent meeting. Walt starts to consider that Tuco needs to be eliminated for their survival.', 47, '2009-03-08'),
(1, 2,  2, 'Grilled',                      'Walt and Jesse are held captive by Tuco in a remote desert shack, along with his wheelchair-bound uncle Hector Salamanca. A tense standoff leads to a violent conclusion.', 47, '2009-03-15'),
(1, 2,  3, 'Bit by a Dead Bee',            'In the aftermath of Tuco''s death, Walt and Jesse must create alibis for their whereabouts. Walt feigns a fugue state while Jesse deals with the police.', 47, '2009-03-22'),
(1, 2,  4, 'Down',                         'Jesse is evicted by his parents and faces homelessness. Walt fights with Skyler about money while hiding his drug income. Jesse hits rock bottom.', 47, '2009-03-29'),
(1, 2,  5, 'Breakage',                     'Walt and Jesse establish a new distribution chain. Hank suffers lasting trauma from the Tuco shootout. Walt invests drug money in Skyler''s gambling winnings story.', 47, '2009-04-05'),
(1, 2,  6, 'Peekaboo',                     'Jesse tracks down two meth addicts who robbed one of their dealers. He discovers their neglected young son living in squalor and is moved by the child''s plight.', 47, '2009-04-12'),
(1, 2,  7, 'Negro y Azul',                 'The impact of Heisenberg''s blue meth reaches the Mexican cartel. Jesse tries to build street cred with his dealers. Hank is transferred to El Paso.', 47, '2009-04-19'),
(1, 2,  8, 'Better Call Saul',             'Walt and Jesse are introduced to flamboyant criminal lawyer Saul Goodman, who quickly becomes indispensable to their operation.', 47, '2009-04-26'),
(1, 2,  9, '4 Days Out',                   'Walt and Jesse take the RV out to the desert for a massive cook, but find themselves stranded when the battery dies. A harrowing test of survival and ingenuity follows.', 47, '2009-05-03'),
(1, 2, 10, 'Over',                         'Walt receives encouraging news about his cancer. He begins to contemplate what life after meth would look like, but finds himself unable to simply walk away.', 47, '2009-05-10'),
(1, 2, 11, 'Mandala',                      'Walt and Jesse secure a major new distribution deal through Saul. Jesse begins a romance with his neighbor Jane Margolis, unaware of her troubled past.', 47, '2009-05-17'),
(1, 2, 12, 'Phoenix',                      'Jesse''s relationship with Jane spirals into a dangerous relapse. Walt makes a devastating decision that will haunt him for the rest of the series.', 47, '2009-05-24'),
(1, 2, 13, 'ABQ',                          'The season finale ties together the season''s flash-forward images. A mid-air collision over Albuquerque results from a chain of events set in motion by Walt''s actions.', 47, '2009-05-31'),
-- Season 3
(1, 3,  1, 'No Más',                       'Walt and Skyler''s marriage reaches a breaking point. The Cousins arrive in Albuquerque targeting Walt. Gus Fring intervenes to protect his investment.', 47, '2010-03-21'),
(1, 3,  2, 'Caballo Sin Nombre',           'Walt moves into an apartment after Skyler files for divorce. The Cousins close in on Walt, but are diverted at the last moment by a cryptic order.', 47, '2010-03-28'),
(1, 3,  3, 'I.F.T.',                       'Skyler has an affair with her boss Ted Beneke and announces it to Walt in a shocking confrontation. Walt refuses to leave the family home despite the separation.', 47, '2010-04-04'),
(1, 3,  4, 'Green Light',                  'Skyler grows closer to Ted. Jesse begins manufacturing on his own and encroaches on Gus''s territory. Walt learns about the lab and tries to reclaim control.', 47, '2010-04-11'),
(1, 3,  5, 'Más',                          'Gus offers Walt an extraordinary deal to cook in a state-of-the-art underground superlab beneath a laundry facility. Walt is tempted despite his promises to get out.', 47, '2010-04-18'),
(1, 3,  6, 'Sunset',                       'Walt and Gale begin cooking in the superlab. Jesse discovers the RV could be found and works to destroy evidence. Hank closes in on the RV''s location.', 47, '2010-04-25'),
(1, 3,  7, 'One Minute',                   'Hank brutally assaults Jesse after a tip. The Cousins ambush Hank in a parking lot in a stunning action sequence that leaves Hank fighting for his life.', 47, '2010-05-02'),
(1, 3,  8, 'I See You',                    'Walter waits at the hospital as Hank undergoes surgery. The cartel retaliates against the attack on the Cousins. Tensions escalate between Walt and Gus.', 47, '2010-05-09'),
(1, 3,  9, 'Kafkaesque',                   'Jesse proposes skimming product to sell on the side. Skyler discovers Walt''s second phone and suspects infidelity. Hank recovers slowly and grows increasingly frustrated.', 47, '2010-05-16'),
(1, 3, 10, 'Fly',                          'Walt becomes obsessed with eliminating a fly that has contaminated the lab. A fan-favorite bottle episode that delves into Walt''s psyche.', 47, '2010-05-23'),
(1, 3, 11, 'Abiquiú',                      'Jesse begins attending a support group where he meets Andrea and her young son Brock. Skyler investigates Ted''s financial irregularities.', 47, '2010-05-30'),
(1, 3, 12, 'Half Measures',                'Jesse plans to kill two dealers working for Gus who used a child to commit murder. Walt makes a dramatic and violent intervention to protect Jesse at a critical moment.', 47, '2010-06-06'),
(1, 3, 13, 'Full Measure',                 'Walt and Jesse face elimination by Gus. Walt sends Jesse to kill Gale Boetticher, Gus''s other chemist, to make themselves indispensable. Jesse pulls the trigger.', 47, '2010-06-13'),
-- Season 4
(1, 4,  1, 'Box Cutter',                   'Gus responds to Gale''s murder with a shocking act of violence intended to send Walt and Jesse a message. The superlab must continue running.', 47, '2011-07-17'),
(1, 4,  2, 'Thirty-Eight Snub',            'Walt purchases an illegal handgun to protect himself from Gus. Jesse throws non-stop parties at his house to avoid confronting his guilt over Gale''s death.', 47, '2011-07-24'),
(1, 4,  3, 'Open House',                   'Marie copes with stress by shoplifting and visiting open houses. Jesse continues his self-destructive party lifestyle. Walt tries to forge an alliance against Gus.', 47, '2011-07-31'),
(1, 4,  4, 'Bullet Points',                'Skyler and Walt rehearse their cover story about his gambling winnings. Hank shows Walt his notes on Gale''s murder, unknowingly revealing how close he is to the truth.', 47, '2011-08-07'),
(1, 4,  5, 'Shotgun',                      'Mike takes Jesse on a mysterious errand run. Walt grows jealous and paranoid at the thought that Gus is cultivating Jesse to replace him. Hank suspects Gale isn''t Heisenberg.', 47, '2011-08-14'),
(1, 4,  6, 'Cornered',                     'Walt makes the infamous declaration that he is the danger, not in danger. Jesse gains respect in the cartel''s eyes. Skyler grows increasingly troubled by Walt''s behavior.', 47, '2011-08-21'),
(1, 4,  7, 'Problem Dog',                  'Jesse attends his support group and gives a veiled confession about killing Gale. Walt tries to convince Saul to arrange Gus''s assassination but Saul refuses.', 47, '2011-08-28'),
(1, 4,  8, 'Hermanos',                     'Hank questions Gus about his connection to the Pollos Hermanos operation. Gus''s tragic backstory in Mexico with his partner Max is revealed in flashback.', 47, '2011-09-04'),
(1, 4,  9, 'Bug',                          'Jesse gives Walt a GPS bug at Gus''s command and Walt discovers Jesse''s growing loyalty to Gus. The two engage in a brutal fistfight that ends their partnership temporarily.', 47, '2011-09-11'),
(1, 4, 10, 'Salud',                        'Jesse accompanies Mike and Gus to Mexico to meet the cartel. Gus poisons the entire cartel leadership in a long-planned act of vengeance for Max''s death.', 47, '2011-09-18'),
(1, 4, 11, 'Crawl Space',                  'Walt discovers Skyler gave Ted Beneke his drug money to pay the IRS. When Walt goes to retrieve his cash reserves, he finds them nearly depleted — and breaks into hysterical laughter.', 47, '2011-09-25'),
(1, 4, 12, 'End Times',                    'Walt prepares for Gus to kill him. Brock, Jesse''s girlfriend Andrea''s son, is poisoned. Jesse accuses Walt, but Walt manipulates him into believing Gus is responsible.', 47, '2011-10-02'),
(1, 4, 13, 'Face Off',                     'Walt orchestrates Gus''s assassination using Hector Salamanca as a suicide bomber. Gus walks out adjusting his tie before collapsing — revealing half his face is gone.', 54, '2011-10-09'),
-- Season 5
(1, 5,  1, 'Live Free or Die',             'In a flash-forward, Walt celebrates his 52nd birthday alone with a machine gun. In the present, Walt, Jesse, and Mike use magnets to destroy Gus''s laptop evidence.', 47, '2012-07-15'),
(1, 5,  2, 'Madrigal',                     'The DEA investigates Madrigal Electromotive, Gus''s corporate parent. Walt, Jesse, and Mike form a new partnership. Mike searches for the names on Gus''s secret payroll list.', 47, '2012-07-22'),
(1, 5,  3, 'Hazard Pay',                   'The new crew sets up a mobile meth lab inside fumigated houses. Walt manipulates Jesse into breaking up with Andrea. Saul warns Walt that three is a crowd.', 47, '2012-07-29'),
(1, 5,  4, 'Fifty-One',                    'Walt turns 51 and celebrates while Skyler''s silent desperation grows. Skyler stages a breakdown to send the children to Hank and Marie''s, trying to protect them from Walt.', 47, '2012-08-05'),
(1, 5,  5, 'Dead Freight',                 'The crew executes a stunning train heist to steal methylamine. Just as the perfect crime succeeds, young Drew Sharp witnesses the aftermath and is shot by Todd.', 47, '2012-08-12'),
(1, 5,  6, 'Buyout',                       'Jesse wants out after Drew Sharp''s murder. Mike also wants to sell the methylamine. Walt refuses, insisting he is in the empire business.', 47, '2012-08-19'),
(1, 5,  7, 'Say My Name',                  'Walt negotiates directly with Declan, demanding recognition as Heisenberg. Walt kills Mike in a riverside confrontation.', 47, '2012-08-26'),
(1, 5,  8, 'Gliding Over All',             'Walt has Mike''s nine men killed simultaneously in prison. Hank discovers Walt is Heisenberg while reading in the bathroom.', 47, '2012-09-02'),
(1, 5,  9, 'Blood Money',                  'Hank confronts Walt in an explosive garage scene. Walt warns Hank to tread lightly. Jesse disposes of his drug money by throwing it from his car.', 47, '2013-08-11'),
(1, 5, 10, 'Buried',                       'Hank tries to turn Skyler against Walt. Walt buries his money in the desert. Hank secretly records Skyler and contacts an attorney.', 47, '2013-08-18'),
(1, 5, 11, 'Confessions',                  'Walt records a fake confession video framing Hank as Heisenberg. Jesse figures out that Walt poisoned Brock and attacks Saul''s office in fury.', 47, '2013-08-25'),
(1, 5, 12, 'Rabid Dog',                    'Jesse attempts to burn down the White house but is stopped by Hank. Jesse agrees to help the DEA. Walt orders Jesse''s death.', 47, '2013-09-01'),
(1, 5, 13, 'To''hajiilee',                 'Jesse tricks Walt into leading them to his buried money. Walt calls the white supremacist gang for backup — but they arrive anyway, and Hank is killed.', 47, '2013-09-08'),
(1, 5, 14, 'Ozymandias',                   'Widely regarded as one of the greatest TV episodes ever made. Hank is executed. Walt''s empire collapses entirely. Jesse is enslaved by the Nazis.', 47, '2013-09-15'),
(1, 5, 15, 'Granite State',                'Walt lives in exile in a New Hampshire cabin. Saul flees to Omaha. Jesse is forced to cook for the neo-Nazis as a prisoner.', 55, '2013-09-22'),
(1, 5, 16, 'Felina',                       'Walt returns to Albuquerque for one final act. He liberates Jesse, kills the Nazi gang, and poisons Lydia. He dies in the lab.', 56, '2013-09-29');

-- Insert characters
-- BUG: Notice there are TWO "Jesse Pinkman" entries with slightly different data!
-- This is the intentional bug for testing (character id 2 and id 5)
INSERT INTO characters (show_id, name, actor_name, bio, image_url, is_main_character, status) VALUES
(1, 'Walter White',         'Bryan Cranston',     'A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine manufacturer known as "Heisenberg". His diagnosis of inoperable lung cancer sets the entire story in motion.', '/images/characters/walter-white.jpg',         true,  'deceased'),
(1, 'Jesse Pinkman',        'Aaron Paul',         'Walt''s former student and small-time meth dealer turned manufacturing partner. Jesse struggles with guilt, addiction, and his own moral code throughout the series.',                                  '/images/characters/jesse-pinkman.jpg',         true,  'alive'),
(1, 'Skyler White',         'Anna Gunn',          'Walter''s pregnant wife and mother of Walt Jr. A meticulous bookkeeper who grows increasingly suspicious of Walt''s activities before becoming an unwilling accomplice in money laundering.',          '/images/characters/skyler-white.jpg',          true,  'alive'),
(1, 'Hank Schrader',        'Dean Norris',        'Walter''s boisterous brother-in-law and DEA agent whose investigation of Heisenberg leads him ever closer to the truth. Killed by Jack Welker''s gang in the New Mexico desert.',                    '/images/characters/hank-schrader.jpg',         true,  'deceased'),
(1, 'Jesse Pinkman',        'Aaron Paul',         'Walt''s former student and partner in the methamphetamine business.',                                                                                                                                 '/images/characters/jesse-pinkman.jpg',         true,  'alive'),  -- DUPLICATE BUG!
(1, 'Saul Goodman',         'Bob Odenkirk',       'Flamboyant criminal lawyer Jimmy McGill who operates under the alias Saul Goodman. Eventually flees to Omaha as Gene Takavic.',                                                                      '/images/characters/saul-goodman.jpg',          false, 'alive'),
(1, 'Gustavo Fring',        'Giancarlo Esposito', 'The polite, meticulous owner of the Los Pollos Hermanos fast food chain who secretly operates a massive methamphetamine distribution network.',                                                        '/images/characters/gustavo-fring.jpg',         true,  'deceased'),
(1, 'Mike Ehrmantraut',     'Jonathan Banks',     'Gus Fring''s fixer and enforcer — a former Philadelphia cop with a strict moral code. Shot by Walt in a petulant rage.',                                                                              '/images/characters/mike-ehrmantraut.jpg',      true,  'deceased'),
(1, 'Marie Schrader',       'Betsy Brandt',       'Skyler''s sister and Hank''s wife. A radiologic technologist with a compulsive shoplifting habit.',                                                                                                   '/images/characters/marie-schrader.jpg',        true,  'alive'),
(1, 'Walter White Jr.',     'RJ Mitte',           'Walt and Skyler''s teenage son, who has cerebral palsy and goes by the nickname Flynn. He idolizes his father and is devastated when the truth about Walt is revealed.',                                '/images/characters/walter-white-jr.jpg',       true,  'alive'),
(1, 'Lydia Rodarte-Quayle', 'Laura Fraser',       'A high-strung Madrigal Electromotive executive who manages the methylamine supply chain. Poisoned by Walt with ricin in the finale.',                                                                  '/images/characters/lydia-rodarte-quayle.jpg',  false, 'deceased'),
(1, 'Todd Alquist',         'Jesse Plemons',      'A cheerful, sociopathic young man who kills young Drew Sharp without hesitation and holds Jesse captive as a slave.',                                                                                  '/images/characters/todd-alquist.jpg',          false, 'deceased'),
(1, 'Tuco Salamanca',       'Raymond Cruz',       'A volatile, unpredictable cartel distributor who becomes Walt and Jesse''s first major buyer. His erratic violence makes him one of the series'' most dangerous early antagonists.',                   '/images/characters/tuco-salamanca.jpg',        false, 'deceased'),
(1, 'Jane Margolis',        'Krysten Ritter',     'Jesse''s neighbor and landlord who becomes his girlfriend and enables his relapse into heroin. Her death is a pivotal moral turning point.',                                                           '/images/characters/jane-margolis.jpg',         false, 'deceased'),
(1, 'Gale Boetticher',      'David Costabile',    'A brilliant, idealistic chemist hired by Gus to work alongside Walt. Tragically shot by Jesse on Walt''s orders.',                                                                                    '/images/characters/gale-boetticher.jpg',       false, 'deceased');

-- Link characters to episodes (sample — Walt and Jesse in all Season 1 episodes)
INSERT INTO character_episodes (character_id, episode_id, is_featured) VALUES
(1, 1, true), (1, 2, true), (1, 3, true), (1, 4, true), (1, 5, true), (1, 6, true), (1, 7, true),
(2, 1, true), (2, 2, true), (2, 3, true), (2, 4, false), (2, 5, true), (2, 6, true), (2, 7, true),
(3, 1, true), (3, 2, false), (3, 3, false), (3, 4, true), (3, 5, true),
(4, 1, true), (4, 2, false), (4, 5, true);

-- Insert quotes
-- Note: episode IDs here assume the inserts above produced IDs 1–62 in order.
-- id 1=S1E1 Pilot, id 53=S5E7 Say My Name, id 2=S1E2, id 4=S1E4, id 5=S1E5, id 46=S4E13, id 15=S2E8
INSERT INTO quotes (show_id, character_id, episode_id, quote_text, is_famous) VALUES
(1, 1, 1,  'I am not in danger, Skyler. I am the danger!', true),
(1, 2, 1,  'Yeah, science!', true),
(1, 1, 53, 'Say my name.', true),
(1, 5, 2,  'Yeah, Mr. White! Yeah, science!', false),  -- uses DUPLICATE Jesse (id 5)!
(1, 3, 4,  'Someone has to protect this family from the man who protects this family.', true),
(1, 4, 5,  'Jesus Christ, Marie, they''re minerals!', false),
(1, 7, 46, 'I have been in the empire business long enough to know that an empire is never truly owned — only borrowed.', true),
(1, 8, 53, 'No more half measures, Walter.', true);

-- Insert a test admin user (password: 'admin123' - DO NOT use in production!)
-- Password hash is bcrypt of 'admin123'
INSERT INTO users (email, password_hash, username, display_name, role) VALUES
('admin@fanhub.test', '$2b$10$rQZ5QZQZ5QZQZ5QZQZ5QZOeH5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'admin', 'Admin User', 'admin');
