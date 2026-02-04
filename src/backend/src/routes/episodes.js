// Episodes routes - YET ANOTHER STYLE!
// This file uses older callback patterns mixed with async
// The contractor was clearly learning as they went

const express = require('express');
const router = express.Router();
const database = require('../database/connection'); // Yet another import name!

// Helper function - only in this file
function handleError(res, error, message = 'An error occurred') {
  console.error(message, error);
  return res.status(500).json({ 
    success: false, // Different response structure!
    message: message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

// GET /api/episodes - list all or by show
router.get('/', (req, res) => { // No async! Using .then()
  const { show_id, season_id } = req.query;
  
  let query = `
    SELECT e.*, s.season_number, sh.title as show_title
    FROM episodes e
    LEFT JOIN seasons s ON e.season_id = s.id
    LEFT JOIN shows sh ON e.show_id = sh.id
    WHERE 1=1
  `;
  const params = [];
  
  if (show_id) {
    params.push(show_id);
    query += ` AND e.show_id = $${params.length}`;
  }
  
  if (season_id) {
    params.push(season_id);
    query += ` AND e.season_id = $${params.length}`;
  }
  
  query += ' ORDER BY e.show_id, s.season_number, e.episode_number';
  
  database.query(query, params)
    .then(result => {
      res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    })
    .catch(error => handleError(res, error, 'Failed to fetch episodes'));
});

// GET /api/episodes/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get episode with show and season info
    const episodeQuery = `
      SELECT e.*, 
             s.season_number, s.title as season_title,
             sh.title as show_title
      FROM episodes e
      LEFT JOIN seasons s ON e.season_id = s.id
      LEFT JOIN shows sh ON e.show_id = sh.id
      WHERE e.id = $1
    `;
    
    const episodeResult = await database.query(episodeQuery, [id]);
    
    if (episodeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Episode not found' });
    }
    
    const episode = episodeResult.rows[0];
    
    // Get characters in this episode
    const charactersQuery = `
      SELECT c.id, c.name, c.actor_name, c.image_url, ce.is_featured
      FROM characters c
      JOIN character_episodes ce ON c.id = ce.character_id
      WHERE ce.episode_id = $1
      ORDER BY ce.is_featured DESC, c.name
    `;
    
    const charactersResult = await database.query(charactersQuery, [id]);
    episode.characters = charactersResult.rows;
    
    // Get quotes from this episode
    const quotesQuery = `
      SELECT q.*, c.name as character_name
      FROM quotes q
      LEFT JOIN characters c ON q.character_id = c.id
      WHERE q.episode_id = $1
      ORDER BY q.is_famous DESC
    `;
    
    const quotesResult = await database.query(quotesQuery, [id]);
    episode.quotes = quotesResult.rows;
    
    res.json({ success: true, data: episode });
    
  } catch (error) {
    handleError(res, error, 'Failed to fetch episode');
  }
});

// POST /api/episodes - create new episode
router.post('/', function(req, res) { // Old-school function
  const { 
    show_id, season_id, episode_number, title, 
    description, air_date, runtime_minutes, director, writer 
  } = req.body;
  
  // Different validation approach
  const errors = [];
  if (!show_id) errors.push('show_id is required');
  if (!season_id) errors.push('season_id is required');
  if (!episode_number) errors.push('episode_number is required');
  if (!title) errors.push('title is required');
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors: errors }); // Array of errors!
  }
  
  const insertQuery = `
    INSERT INTO episodes 
    (show_id, season_id, episode_number, title, description, air_date, runtime_minutes, director, writer)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  database.query(insertQuery, [
    show_id, season_id, episode_number, title, 
    description, air_date, runtime_minutes, director, writer
  ])
    .then(result => {
      res.status(201).json({ success: true, data: result.rows[0] });
    })
    .catch(error => handleError(res, error, 'Failed to create episode'));
});

// PUT /api/episodes/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    episode_number, title, description, 
    air_date, runtime_minutes, director, writer, rating 
  } = req.body;
  
  try {
    const result = await database.query(
      `UPDATE episodes SET
        episode_number = COALESCE($1, episode_number),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        air_date = COALESCE($4, air_date),
        runtime_minutes = COALESCE($5, runtime_minutes),
        director = COALESCE($6, director),
        writer = COALESCE($7, writer),
        rating = COALESCE($8, rating),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [episode_number, title, description, air_date, runtime_minutes, director, writer, rating, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Episode not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    handleError(res, error, 'Failed to update episode');
  }
});

// DELETE /api/episodes/:id
router.delete('/:id', (req, res) => {
  database.query('DELETE FROM episodes WHERE id = $1 RETURNING id', [req.params.id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Episode not found' });
      }
      res.json({ success: true, message: 'Episode deleted', id: result.rows[0].id });
    })
    .catch(error => handleError(res, error, 'Failed to delete episode'));
});

module.exports = router;
