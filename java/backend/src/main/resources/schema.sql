-- FanHub Database Schema — SQLite
-- Generic schema for any TV show fan site

-- Shows table
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

-- Seasons table
CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title TEXT,
    episode_count INTEGER,
    air_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
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

-- Characters table
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

-- Character appearances in episodes (many-to-many)
CREATE TABLE IF NOT EXISTS character_episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    is_featured INTEGER DEFAULT 0,
    UNIQUE(character_id, episode_id)
);

-- Quotes table
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

-- Users table (for future auth)
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

-- User favorites (for future feature)
CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, character_id)
);

-- Indexes for performance (CREATE INDEX IF NOT EXISTS is supported in SQLite 3.3.7+)
CREATE INDEX IF NOT EXISTS idx_characters_show ON characters(show_id);
CREATE INDEX IF NOT EXISTS idx_episodes_show ON episodes(show_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_quotes_character ON quotes(character_id);
CREATE INDEX IF NOT EXISTS idx_quotes_episode ON quotes(episode_id);
CREATE INDEX IF NOT EXISTS idx_character_episodes_character ON character_episodes(character_id);
CREATE INDEX IF NOT EXISTS idx_character_episodes_episode ON character_episodes(episode_id);
