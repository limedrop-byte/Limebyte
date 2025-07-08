const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get site settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT site_title FROM settings LIMIT 1');
    
    if (result.rows.length === 0) {
      // If no settings exist, return default
      return res.json({ site_title: 'LIMEBYTE' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update site settings (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { site_title } = req.body;

    if (!site_title || !site_title.trim()) {
      return res.status(400).json({ error: 'Site title is required' });
    }

    // Check if settings row exists
    const existingResult = await pool.query('SELECT id FROM settings LIMIT 1');
    
    if (existingResult.rows.length === 0) {
      // Insert new settings row
      const result = await pool.query(`
        INSERT INTO settings (site_title) 
        VALUES ($1) 
        RETURNING site_title
      `, [site_title.trim()]);
      
      res.json({
        message: 'Settings updated successfully',
        settings: result.rows[0]
      });
    } else {
      // Update existing settings
      const result = await pool.query(`
        UPDATE settings 
        SET site_title = $1 
        RETURNING site_title
      `, [site_title.trim()]);
      
      res.json({
        message: 'Settings updated successfully',
        settings: result.rows[0]
      });
    }

  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 