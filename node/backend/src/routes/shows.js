// Shows routes - using async/await style
// This is the "good" pattern - other routes don't follow it

const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// GET all shows
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM shows ORDER BY title');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET single show by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM shows WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET show with all related data
router.get('/:id/full', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const showResult = await db.query('SELECT * FROM shows WHERE id = $1', [id]);
    if (showResult.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    
    const show = showResult.rows[0];
    
    // Get related data
    const [seasons, characters, episodes] = await Promise.all([
      db.query('SELECT * FROM seasons WHERE show_id = $1 ORDER BY season_number', [id]),
      db.query('SELECT * FROM characters WHERE show_id = $1 ORDER BY name', [id]),
      db.query('SELECT * FROM episodes WHERE show_id = $1 ORDER BY season_id, episode_number', [id]),
    ]);
    
    res.json({
      ...show,
      seasons: seasons.rows,
      characters: characters.rows,
      episodes: episodes.rows,
    });
  } catch (error) {
    next(error);
  }
});

// POST create show
router.post('/', async (req, res, next) => {
  try {
    const { title, description, genre, start_year, end_year, network, poster_url } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await db.query(
      `INSERT INTO shows (title, description, genre, start_year, end_year, network, poster_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, genre, start_year, end_year, network, poster_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT update show
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, genre, start_year, end_year, network, poster_url } = req.body;
    
    const result = await db.query(
      `UPDATE shows 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           genre = COALESCE($3, genre),
           start_year = COALESCE($4, start_year),
           end_year = COALESCE($5, end_year),
           network = COALESCE($6, network),
           poster_url = COALESCE($7, poster_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, genre, start_year, end_year, network, poster_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE show
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    
    res.json({ message: 'Show deleted', show: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
