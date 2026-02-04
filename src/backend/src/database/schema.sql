-- FanHub Database Schema
-- Generic schema for any TV show fan site

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    start_year INTEGER,
    end_year INTEGER,
    network VARCHAR(100),
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seasons table
CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title VARCHAR(255),
    episode_count INTEGER,
    air_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    air_date DATE,
    runtime_minutes INTEGER,
    director VARCHAR(255),
    writer VARCHAR(255),
    thumbnail_url TEXT,
    rating DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    actor_name VARCHAR(255),
    bio TEXT,
    image_url TEXT,
    is_main_character BOOLEAN DEFAULT false,
    first_appearance INTEGER REFERENCES episodes(id),
    status VARCHAR(50), -- alive, deceased, unknown
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Character appearances in episodes (many-to-many)
CREATE TABLE IF NOT EXISTS character_episodes (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT false,
    UNIQUE(character_id, episode_id)
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
    quote_text TEXT NOT NULL,
    context TEXT,
    is_famous BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for future auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user', -- user, admin, moderator
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorites (for future feature)
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, character_id)
);

-- Indexes for performance
CREATE INDEX idx_characters_show ON characters(show_id);
CREATE INDEX idx_episodes_show ON episodes(show_id);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_quotes_character ON quotes(character_id);
CREATE INDEX idx_quotes_episode ON quotes(episode_id);
CREATE INDEX idx_character_episodes_character ON character_episodes(character_id);
CREATE INDEX idx_character_episodes_episode ON character_episodes(episode_id);
