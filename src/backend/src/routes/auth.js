// Auth routes - INCOMPLETE!
// The contractor left this half-done
// TODO: Finish implementing authentication

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_not_for_production';
const JWT_EXPIRES_IN = '24h';

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, username, display_name } = req.body;
  
  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['email', 'password', 'username']
    });
  }
  
  // Password requirements - should be stronger!
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, display_name, role, created_at`,
      [email, password_hash, username, display_name || username]
    );
    
    const user = result.rows[0];
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: user,
      token: token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Don't send password hash!
    delete user.password_hash;
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        role: user.role
      },
      token: token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /auth/me - get current user (requires token)
router.get('/me', async (req, res) => {
  // TODO: This should use middleware!
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await db.query(
      'SELECT id, email, username, display_name, avatar_url, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// TODO: Add these routes:
// - POST /auth/logout (invalidate token - need redis?)
// - POST /auth/refresh (refresh token)
// - POST /auth/forgot-password
// - POST /auth/reset-password
// - PUT /auth/change-password

// Middleware for protected routes - NOT USED YET
// Export it for other routes to use... eventually
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Admin-only middleware - also not used yet
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = router;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
