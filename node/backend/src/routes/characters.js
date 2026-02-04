// Characters routes - DIFFERENT STYLE than shows.js!
// Uses a mix of patterns - the contractor was experimenting

const express = require('express');
const router = express.Router();
const { query } = require('../database/connection'); // Different import style!

// GET all characters - with optional filtering
// NOTE: This endpoint does too much - should be split
router.get('/', async (req, res) => {
  // No try/catch here - inconsistent error handling!
  const { show_id, is_main, status, search } = req.query;
  
  let sql = 'SELECT * FROM characters WHERE 1=1';
  const params = [];
  let paramCount = 0;
  
  if (show_id) {
    paramCount++;
    sql += ` AND show_id = $${paramCount}`;
    params.push(show_id);
  }
  
  if (is_main !== undefined) {
    paramCount++;
    sql += ` AND is_main_character = $${paramCount}`;
    params.push(is_main === 'true');
  }
  
  if (status) {
    paramCount++;
    sql += ` AND status = $${paramCount}`;
    params.push(status);
  }
  
  if (search) {
    paramCount++;
    sql += ` AND (name ILIKE $${paramCount} OR actor_name ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }
  
  sql += ' ORDER BY is_main_character DESC, name ASC';
  
  const result = await query(sql, params);
  res.json(result.rows);
});

// GET character by ID - with episodes they appear in
router.get('/:id', async function(req, res, next) { // Different function style!
  try {
    const characterResult = await query(
      'SELECT * FROM characters WHERE id = $1',
      [req.params.id]
    );
    
    if (characterResult.rows.length === 0) {
      // Different error response format than shows.js!
      return res.status(404).send({ message: 'Character not found', code: 'NOT_FOUND' });
    }
    
    const character = characterResult.rows[0];
    
    // Get episodes - nested query (could be optimized)
    const episodesResult = await query(
      `SELECT e.*, ce.is_featured 
       FROM episodes e 
       JOIN character_episodes ce ON e.id = ce.episode_id 
       WHERE ce.character_id = $1
       ORDER BY e.season_id, e.episode_number`,
      [req.params.id]
    );
    
    character.episodes = episodesResult.rows;
    
    res.json(character);
  } catch (err) {
    // Different error handling!
    console.error('Error fetching character:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST new character
router.post('/', async (req, res) => {
  const { 
    show_id, 
    name, 
    actor_name, 
    bio, 
    image_url, 
    is_main_character, 
    status 
  } = req.body;
  
  // Validation - different style than shows.js
  if (!show_id || !name) {
    return res.status(400).send('show_id and name are required'); // Plain text response!
  }
  
  try {
    const result = await query(
      `INSERT INTO characters 
       (show_id, name, actor_name, bio, image_url, is_main_character, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [show_id, name, actor_name, bio, image_url, is_main_character || false, status || 'alive']
    );
    
    // 200 instead of 201 - inconsistent!
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Exposing error details!
  }
});

// PATCH update character - using PATCH instead of PUT like shows.js
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Dynamic update building - different approach than shows.js
  const fields = [];
  const values = [];
  let paramCount = 0;
  
  const allowedFields = ['name', 'actor_name', 'bio', 'image_url', 'is_main_character', 'status'];
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      paramCount++;
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  
  paramCount++;
  values.push(id);
  
  const sql = `UPDATE characters SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
  
  try {
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE character
router.delete('/:id', async (req, res) => {
  // No confirmation, no soft delete - just gone
  const result = await query('DELETE FROM characters WHERE id = $1 RETURNING id, name', [req.params.id]);
  
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    // Different response format again!
    res.json({ deleted: true, character: result.rows[0] });
  }
});

module.exports = router;
