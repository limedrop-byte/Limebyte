const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Insert email into subscribers table
    await pool.query(`
      INSERT INTO subscribers (email) 
      VALUES ($1)
    `, [email.toLowerCase().trim()]);

    res.json({ message: 'Successfully subscribed to newsletter!' });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Check if it's a duplicate email error
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(409).json({ error: 'Email is already subscribed' });
    }
    
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, created_at 
      FROM subscribers 
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 