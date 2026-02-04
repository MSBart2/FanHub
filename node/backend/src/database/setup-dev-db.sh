#!/bin/bash

# FanHub Development Database Setup
# Creates a SQLite development database for MCP integration testing
# This mirrors the PostgreSQL production schema but uses SQLite for local development

# Configuration
DB_DIR="/workspaces/CopilotTraining/dev-data"
DB_PATH="$DB_DIR/fanhub-dev.db"

# Create directory if it doesn't exist
mkdir -p "$DB_DIR"

# Remove old database if it exists
rm -f "$DB_PATH"

echo "🔨 Creating FanHub development database..."

# Create database with schema (SQLite-adapted version)
sqlite3 "$DB_PATH" << 'SQL'
-- FanHub Database Schema (SQLite version)
-- Adapted from fanhub/backend/src/database/schema.sql

-- Shows table
CREATE TABLE shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    start_year INTEGER,
    end_year INTEGER,
    network TEXT,
    poster_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seasons table
CREATE TABLE seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title TEXT,
    episode_count INTEGER,
    air_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    air_date DATE,
    runtime_minutes INTEGER,
    director TEXT,
    writer TEXT,
    thumbnail_url TEXT,
    rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    actor_name TEXT,
    bio TEXT,
    image_url TEXT,
    is_main_character BOOLEAN DEFAULT 0,
    first_appearance INTEGER REFERENCES episodes(id),
    status TEXT CHECK (status IN ('alive', 'deceased', 'unknown')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Character appearances in episodes (many-to-many)
CREATE TABLE character_episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT 0,
    UNIQUE(character_id, episode_id)
);

-- Quotes table
CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
    quote_text TEXT NOT NULL,
    context TEXT,
    is_famous BOOLEAN DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for MCP testing
INSERT INTO shows (id, title, description, genre, start_year, end_year, network) VALUES
(1, 'Breaking Bad', 'A high school chemistry teacher turned methamphetamine manufacturer', 'Drama', 2008, 2013, 'AMC'),
(2, 'Better Call Saul', 'The story of Jimmy McGill becoming Saul Goodman', 'Drama', 2015, 2022, 'AMC'),
(3, 'The Office', 'Mockumentary about office workers in Scranton, PA', 'Comedy', 2005, 2013, 'NBC'),
(4, 'Stranger Things', 'Supernatural events in the town of Hawkins', 'Sci-Fi', 2016, 2025, 'Netflix');

INSERT INTO seasons (show_id, season_number, title, episode_count) VALUES
(1, 1, 'Season 1', 7),
(1, 2, 'Season 2', 13),
(3, 1, 'Season 1', 6),
(4, 1, 'Season 1', 8);

INSERT INTO episodes (show_id, season_id, episode_number, title, description, runtime_minutes) VALUES
(1, 1, 1, 'Pilot', 'Walter White is diagnosed with cancer', 58),
(1, 1, 2, 'Cat''s in the Bag...', 'Walter and Jesse dispose of Emilio', 48),
(1, 1, 3, '...And the Bag''s in the River', 'Walter faces a difficult decision with Krazy-8', 48),
(3, 3, 1, 'Pilot', 'First day at Dunder Mifflin Scranton', 22),
(3, 3, 2, 'Diversity Day', 'Michael causes problems with diversity training', 22),
(4, 4, 1, 'Chapter One: The Vanishing of Will Byers', 'Will disappears in Hawkins', 47);

INSERT INTO characters (show_id, name, actor_name, bio, is_main_character, status) VALUES
(1, 'Walter White', 'Bryan Cranston', 'High school chemistry teacher turned meth cook', 1, 'deceased'),
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walter''s former student and partner', 1, 'alive'),
(1, 'Skyler White', 'Anna Gunn', 'Walter''s wife', 1, 'alive'),
(1, 'Hank Schrader', 'Dean Norris', 'DEA agent and Walter''s brother-in-law', 1, 'deceased'),
(2, 'Saul Goodman', 'Bob Odenkirk', 'Criminal lawyer Jimmy McGill', 1, 'alive'),
(2, 'Kim Wexler', 'Rhea Seehorn', 'Lawyer and Jimmy''s partner', 1, 'alive'),
(3, 'Jim Halpert', 'John Krasinski', 'Salesman with a sense of humor', 1, 'alive'),
(3, 'Pam Beesly', 'Jenna Fischer', 'Receptionist turned saleswoman', 1, 'alive'),
(3, 'Dwight Schrute', 'Rainn Wilson', 'Assistant regional manager', 1, 'alive'),
(3, 'Michael Scott', 'Steve Carell', 'Regional manager of Scranton branch', 1, 'alive'),
(4, 'Eleven', 'Millie Bobby Brown', 'Girl with telekinetic powers', 1, 'alive'),
(4, 'Mike Wheeler', 'Finn Wolfhard', 'Leader of the group searching for Will', 1, 'alive');

INSERT INTO quotes (show_id, character_id, quote_text, is_famous) VALUES
(1, 1, 'I am the one who knocks!', 1),
(1, 1, 'Say my name.', 1),
(1, 2, 'Yeah, science!', 1),
(3, 9, 'That''s what she said.', 1),
(3, 9, 'Bears. Beets. Battlestar Galactica.', 1),
(4, 11, 'Friends don''t lie.', 1);

-- Indexes for performance
CREATE INDEX idx_characters_show ON characters(show_id);
CREATE INDEX idx_episodes_show ON episodes(show_id);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_quotes_character ON quotes(character_id);
CREATE INDEX idx_character_episodes_character ON character_episodes(character_id);
SQL

echo "✅ Development database created!"
echo "📍 Location: $DB_PATH"
echo "📊 Sample data: 4 shows, 12 characters"
echo ""
echo "Use this database with MCP by pointing the SQLite MCP server to:"
echo "   $DB_PATH"
