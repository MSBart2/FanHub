/**
 * Quotes routes
 * 
 * STYLE: This file uses JSDoc comments (others don't)
 * Also uses a class-based approach because why not mix it up
 */

const express = require('express');
const db = require('../database/connection');

const router = express.Router();

/**
 * @typedef {Object} Quote
 * @property {number} id
 * @property {number} show_id
 * @property {number} character_id
 * @property {number} episode_id
 * @property {string} quote_text
 * @property {string} context
 * @property {boolean} is_famous
 * @property {number} likes_count
 */

/**
 * Get all quotes with optional filters
 * @route GET /api/quotes
 */
router.get('/', async (req, res, next) => {
  const { show_id, character_id, episode_id, famous_only, limit = 50 } = req.query;
  
  try {
    let sql = `
      SELECT q.*, 
             c.name as character_name,
             e.title as episode_title,
             e.episode_number,
             s.season_number
      FROM quotes q
      LEFT JOIN characters c ON q.character_id = c.id
      LEFT JOIN episodes e ON q.episode_id = e.id
      LEFT JOIN seasons s ON e.season_id = s.id
      WHERE 1=1
    `;
    const params = [];
    
    if (show_id) {
      params.push(show_id);
      sql += ` AND q.show_id = $${params.length}`;
    }
    
    if (character_id) {
      params.push(character_id);
      sql += ` AND q.character_id = $${params.length}`;
    }
    
    if (episode_id) {
      params.push(episode_id);
      sql += ` AND q.episode_id = $${params.length}`;
    }
    
    if (famous_only === 'true') {
      sql += ` AND q.is_famous = true`;
    }
    
    sql += ` ORDER BY q.is_famous DESC, q.likes_count DESC`;
    
    params.push(parseInt(limit));
    sql += ` LIMIT $${params.length}`;
    
    const result = await db.query(sql, params);
    
    // Different response format - just the array
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * Get random quote (fun feature!)
 * @route GET /api/quotes/random
 */
router.get('/random', async (req, res) => {
  const { show_id, famous_only } = req.query;
  
  let sql = `
    SELECT q.*, c.name as character_name
    FROM quotes q
    LEFT JOIN characters c ON q.character_id = c.id
    WHERE 1=1
  `;
  const params = [];
  
  if (show_id) {
    params.push(show_id);
    sql += ` AND q.show_id = $${params.length}`;
  }
  
  if (famous_only === 'true') {
    sql += ` AND q.is_famous = true`;
  }
  
  sql += ` ORDER BY RANDOM() LIMIT 1`;
  
  try {
    const result = await db.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No quotes found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get random quote' });
  }
});

/**
 * Get single quote
 * @route GET /api/quotes/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT q.*, c.name as character_name, e.title as episode_title
       FROM quotes q
       LEFT JOIN characters c ON q.character_id = c.id
       LEFT JOIN episodes e ON q.episode_id = e.id
       WHERE q.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * Create new quote
 * @route POST /api/quotes
 */
router.post('/', async (req, res) => {
  const { show_id, character_id, episode_id, quote_text, context, is_famous } = req.body;
  
  // Minimal validation - inconsistent with other routes
  if (!quote_text) {
    return res.status(400).json({ error: 'quote_text is required' });
  }
  
  if (!show_id) {
    return res.status(400).json({ error: 'show_id is required' });
  }
  
  try {
    const result = await db.query(
      `INSERT INTO quotes (show_id, character_id, episode_id, quote_text, context, is_famous)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [show_id, character_id || null, episode_id || null, quote_text, context, is_famous || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

/**
 * Like a quote (increment likes_count)
 * @route POST /api/quotes/:id/like
 */
router.post('/:id/like', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE quotes SET likes_count = likes_count + 1 WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json({ likes_count: result.rows[0].likes_count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like quote' });
  }
});

/**
 * Update quote
 * @route PUT /api/quotes/:id
 */
router.put('/:id', async (req, res) => {
  const { quote_text, context, is_famous, character_id, episode_id } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE quotes SET
        quote_text = COALESCE($1, quote_text),
        context = COALESCE($2, context),
        is_famous = COALESCE($3, is_famous),
        character_id = COALESCE($4, character_id),
        episode_id = COALESCE($5, episode_id)
       WHERE id = $6
       RETURNING *`,
      [quote_text, context, is_famous, character_id, episode_id, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

/**
 * Delete quote
 * @route DELETE /api/quotes/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM quotes WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    // Yet another response format
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

module.exports = router;
