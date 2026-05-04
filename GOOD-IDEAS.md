# 💡 GOOD-IDEAS.md — Fun, Creative, Expansive Things to Build in FanHub

> A grab-bag of feature ideas, side quests, and "wouldn't it be cool if…" experiments for workshop participants, instructors, and weekend hackers.
>
> FanHub ships pre-branded as a **_Breaking Bad_ fan site** (see [docs/breaking-bad-universe.md](docs/breaking-bad-universe.md)), but every idea below works just as well after reskinning to _The Office_, _Stranger Things_, _Ted Lasso_, _Severance_, or your own obsession.
>
> Most ideas are framed as **"prompt seeds"** — paste them into Copilot Chat (after wiring up repo instructions and the MCP server) and watch what happens.

---

## How to Use This File

- 🟢 **Beginner** — One sitting, mostly UI or single-endpoint work
- 🟡 **Intermediate** — Multiple files, a new model, or some design thought
- 🔴 **Ambitious** — Cross-cutting, agentic, or requires a new service
- ⏱ **Time estimates** are for vibe-coding with Copilot (not from scratch)
- 🔥 = High wow-factor — looks great in a demo or screenshot

Pick one, fork a branch, and let Copilot drive. If you build something cool, add it to a `SHOWCASE.md`.

---

## ⚡ 45-Minute Session Menus

Don't waste time choosing. Pick a menu, paste the prompts in order, and let Copilot cook.

### Menu A: "The Crowd-Pleaser" (visual, shareable)
| # | Idea | Est. |
|---|------|------|
| 1 | Quote of the day on the homepage | ~10 min |
| 2 | Quote-to-meme generator | ~15 min |
| 3 | Heisenberg Mode toggle | ~15 min |
| | _Buffer: polish & screenshots_ | ~5 min |

### Menu B: "The Fan Experience" (interactive, fun)
| # | Idea | Est. |
|---|------|------|
| 1 | "Walt or Jesse?" quote quiz | ~15 min |
| 2 | Episode rating + reviews | ~15 min |
| 3 | Most-quoted character chart | ~10 min |
| | _Buffer: polish & screenshots_ | ~5 min |

### Menu C: "The Deep Cut" (one meaty feature)
| # | Idea | Est. |
|---|------|------|
| 1 | Character DM simulator | ~30 min |
| 2 | "Ask the Showrunner" chat widget | ~10 min |
| | _These share a chat UI — build one, clone the other_ | |

### Menu D: "The Builder" (backend + admin focus)
| # | Idea | Est. |
|---|------|------|
| 1 | Markdown-powered episode editor | ~20 min |
| 2 | Bulk-import via CSV / JSON | ~20 min |
| | _Buffer: polish & testing_ | ~5 min |

### Menu E: "The One Big Thing" (pick exactly one 🟡)
Spend the full 45 minutes on a single intermediate idea. Best for participants who want depth over breadth. Good picks: **Spoiler-aware browsing**, **Season tier-list builder**, or **Show-aware skinning engine**.

> **🔴 Ambitious ideas are multi-session projects.** Don't start one in a 45-minute window unless you're okay with a half-finished prototype. They're here for hackathons and weekend projects.

---

## 🎨 Theming & Visual Identity

### 🟢 Heisenberg Mode toggle

A dark-mode switch that flips the entire site into "Heisenberg" — black background, acid-green accents, Walt's pork-pie hat as the cursor, and a faint blue-meth crystal pattern in the corners.

### 🟢 Periodic-table loading spinner

Replace the default spinner with an animated periodic table that highlights **Br** (35) and **Ba** (56) — the chemical symbols that form the show's title sequence.

### 🟡 Show-aware skinning engine

Build a `themes/` folder with a config-driven theme loader. Drop in `breaking-bad.json`, `the-office.json`, `stranger-things.json` — each defines palette, fonts, hero imagery, and tagline. Switch shows from a settings page.

### 🟡 Crystal Ship hero animation

A WebGL or CSS hero banner of the desert RV from the pilot, with parallax tumbleweeds and a slow zoom on the license plate.

### 🔴 Generative episode posters

Wire up an image-generation MCP server. Each episode gets an auto-generated retro VHS-style poster derived from its synopsis. Cache them server-side.

---

## 🔍 Search, Discovery & Navigation

### 🟢 Quote search with fuzzy matching

"I am the one who knocks" should match even if the user types "im the one that knock". Add Fuse.js (or your language's equivalent) and a global ⌘K search palette.

### 🟡 "Find a character like…" recommender

Vector-embed every character bio, then let users type "morally grey lawyer with a flexible code" and surface Saul Goodman + similar.

### 🟡 Spoiler-aware browsing

Users pick the latest episode they've watched. The site automatically blurs character status, future quotes, and episode synopses past that point. Hover to reveal with confirmation.

### 🔴 Knowledge-graph explorer

Render characters, episodes, locations, and factions as an interactive D3 / Cytoscape graph. Click Walt → see all related quotes, episodes, and connected characters. Filter by season.

---

## 🎬 Episode & Lore Features

### 🟢 "On this day" widget

Show the homepage which episodes aired on today's date in show history.

### 🟢 Episode rating + reviews

Five-star rating with a comment field. Aggregate to a leaderboard of "most beloved" and "most divisive" episodes.

### 🟡 Watchalong timer

Pick an episode, hit play, and the page advances scene-by-scene with synced trivia popups ("Did you know the pink teddy bear was foreshadowed for two seasons?").

### 🟡 Season tier-list builder

Drag-and-drop episodes into S/A/B/C/D/F tiers. Save, share via URL, compare with the community average.

### 🔴 Auto-generated recap videos

Pull synopses for a season, run them through a TTS + stock-footage pipeline, and produce a 90-second "previously on…" recap. Embed on each season page.

---

## 💬 Quotes & Social

### 🟢 Quote of the day on the homepage

Deterministic by date so everyone sees the same one. Add a "tweet this" button.

### 🟢 Quote-to-meme generator

Pick a quote, pick a character image, get a downloadable PNG. Bonus points for an Impact-font option.

### 🟡 Misquote detector

Users submit quotes; the system flags ones that don't match any known transcript line. Crowdsource canonical corrections.

### 🟡 Character DM simulator

A chat UI where you "text" Saul Goodman. Backed by an LLM with a system prompt seeded from his bio + greatest hits. Add a "Better Call Saul" hotline button.

### 🔴 Multi-character group-chat roleplay

Drop Walt, Jesse, and Mike into a Slack-style channel. They argue about a hypothetical ("should we trust Lydia?") in-character, with you as the wildcard fourth participant.

---

## 🧪 Trivia, Games & Engagement

### 🟢 "Walt or Jesse?" quote quiz

Show a quote, two buttons, score over time, share results. Easy first-timer feature.

### 🟢 Daily Wordle clone — "Heisengrid"

A 5×5 character-guessing game. Each row narrows down a mystery character by trait (occupation, alignment, season debut, fate).

### 🟡 Rank-the-villains bracket

March-Madness-style elimination bracket. Tuco vs. Gus vs. Lydia vs. Todd vs. Jack. Persist results, show global winners.

### 🟡 "Choose your own meth empire" interactive fiction

Branching story engine. Players make Walt-style choices and see their alignment / body-count / net-worth meter shift. Multiple endings.

### 🔴 Real-time multiplayer trivia rooms

WebSocket-backed quiz rooms. Host picks a category, 4–8 players buzz in, leaderboard at the end. Use it for watch parties.

---

## 🛠 Admin, Authoring & Moderation

### 🟢 Markdown-powered episode editor

Admin page where staff can edit synopses with live preview, image upload, and tag autocomplete.

### 🟡 Bulk-import via CSV / JSON

Drop a CSV of new characters or quotes; the system validates, dedupes (looking at you, Jesse Pinkman), and previews changes before commit.

### 🟡 Audit log + soft delete

Every edit/delete recorded with user, timestamp, and diff. Restore deleted records from a recycle bin.

### 🔴 Copilot-powered content moderator

An MCP-backed agent that reviews user-submitted quotes/comments for spoilers, profanity, and off-topic content, then suggests rewrites.

---

## 🤖 AI & Copilot-Native Features

### 🟢 "Ask the Showrunner" chat widget

Floating chat button that answers fan questions using only the lore in [docs/breaking-bad-universe.md](docs/breaking-bad-universe.md) as grounding. Refuses to make things up.

### 🟡 Auto-tagger for quotes

On quote creation, an LLM suggests themes (loyalty, hubris, family, science, danger). Admins approve.

### 🟡 Episode-similarity engine

Embed every synopsis. "If you liked S2E10, watch these 5 next." Works across shows once you reskin.

### 🔴 Self-healing seed data agent

A scheduled agent that scans for the duplicate-Jesse class of bug, opens a PR with a fix, and tags the on-call engineer. Showcase for Module 7.

### 🔴 Lore-consistency checker (CI step)

Before merge, an agent reads new content and flags contradictions with established lore ("This says Hank survived season 5"). Fails the PR with a friendly comment.

---

## 📈 Analytics & Insights

### 🟢 Most-quoted character chart

Simple bar chart on a `/insights` page. Updates as quotes are added.

### 🟡 Sentiment-arc visualization

Plot per-episode sentiment over the series. Hover to see the dominant emotion and a representative quote.

### 🟡 "Body count" tracker

Per-character kill / death stats with a morbidly-tasteful timeline. Easter-egg toggle to switch units to "pizzas thrown on roofs."

### 🔴 Predictive "who dies next" model

Train on character bios + episode appearances. Output a ranked danger-meter. Pure fun, zero accuracy guaranteed.

---

## 🌍 Community & Social

### 🟢 Fan watchlist

Users mark episodes watched / unwatched. Progress bar per season.

### 🟡 Public profiles

`/u/<username>` shows a user's favorite character, top quotes, tier list, and quiz scores.

### 🟡 Fan-fic submissions

Markdown editor + tagging + reactions. Light moderation queue.

### 🔴 Cross-show universe

Add _Better Call Saul_ and _El Camino_ as linked shows. Characters can appear in multiple, with a shared timeline view spanning all three.

---

## 🔌 Integrations & APIs

### 🟢 iCal feed of original air dates

Subscribe to a calendar that surfaces "today in Breaking Bad history."

### 🟡 Public REST API + OpenAPI spec

Properly versioned `/v1/` API with rate limiting, an interactive Swagger UI at `/docs`, and SDK generation.

### 🟡 Discord bot companion

Slash commands: `/quote random`, `/character walt`, `/episode S3E07`. Powered by the same backend.

### 🔴 Spotify mood playlists per character

For each character, generate (and refresh weekly) a Spotify playlist that matches their arc. Embed the player on their profile.

---

## ♿ Accessibility, Performance & Polish

### 🟢 Real alt text for every image

Audit pass + Copilot prompt: "Generate descriptive alt text for each character portrait based on their bio."

### 🟢 Reduced-motion mode

Respect `prefers-reduced-motion` everywhere. Heisenberg-mode animations off by default for those users.

### 🟡 Full keyboard navigation + skip links

ARIA-correct nav, focus rings, escape-to-close on every modal.

### 🟡 i18n scaffolding

Wrap UI strings in a translation layer. Ship English + one fan-translated language (Spanish would be canonically perfect for _Breaking Bad_).

### 🔴 Offline-first PWA

Service worker, installable app, browse cached characters and quotes on a plane. Sync new quotes when you land.

---

## 🧠 Workshop & Meta Ideas

### 🟢 `BUGS-FIXED.md` companion

Each time a workshop cohort fixes one of the intentional bugs, append the fix + Copilot prompts that worked.

### 🟡 "Time to first green build" leaderboard

GitHub Action that records how long each Codespace takes from `code .` to passing tests. Friendly competition between language tracks.

### 🟡 Reskin-in-a-day challenge

Document the exact set of files to swap for a new show. Goal: a participant can theme FanHub for _The Office_ in a single workshop session.

### 🔴 "Ship it" autonomous agent

A Module-7-style custom agent that takes a one-line feature request, opens a draft PR with code + tests + screenshots, and asks the human to review. Use it on any idea above.

---

## 🐣 Easter Eggs (Just for Fun)

- 🟢 Konami code unlocks a hidden "Heisenberg Says" page with random Walt quotes
- 🟢 Type "say my name" in the search bar → site greets you as Heisenberg
- 🟢 404 page shows the desert RV with "You took a wrong turn at Albuquerque"
- 🟡 The 50th visitor of the day sees a tiny pink teddy bear floating across the screen
- 🟡 Click the periodic-table favicon 5 times to enable "developer commentary" mode where Vince Gilligan-style notes appear on hover

---

## Contributing an Idea

Have a wilder idea? Open a PR adding a bullet to the right section. Keep it:

1. **Achievable** — Even ambitious ideas should fit a long weekend
2. **Show-agnostic where possible** — Phrase it so a _Stranger Things_ reskin still makes sense
3. **Copilot-friendly** — Bonus points if you include a prompt seed someone can paste into Chat

Happy building. Stay out of the empire business. 🧪
