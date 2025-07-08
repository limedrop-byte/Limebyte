const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function deployFresh() {
  try {
    console.log('🚀 FRESH DEPLOY - LIMEBYTE DATABASE');
    console.log('🗑️  Dropping ALL existing tables...');
    
    // Drop EVERYTHING - no mercy
    await pool.query(`DROP TABLE IF EXISTS posts CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS links CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS subscribers CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS settings CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS site_settings CASCADE;`);
    
    console.log('✅ All tables nuked');
    
    console.log('🏗️  Creating complete database structure...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create posts table with ALL features
    await pool.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        view_count INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes for posts
    await pool.query(`CREATE INDEX idx_posts_slug ON posts(slug);`);
    await pool.query(`CREATE INDEX idx_posts_view_count ON posts(view_count);`);
    await pool.query(`CREATE INDEX idx_posts_created_at ON posts(created_at);`);
    
    // Create links table
    await pool.query(`
      CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create subscribers table
    await pool.query(`
      CREATE TABLE subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create settings table
    await pool.query(`
      CREATE TABLE settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255) DEFAULT 'LIMEBYTE',
        footer_text TEXT DEFAULT 'Building the future, one commit at a time.',
        site_description TEXT DEFAULT 'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create site_settings table (the one you wanted kept)
    await pool.query(`
      CREATE TABLE site_settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255) NOT NULL DEFAULT 'LIMEBYTE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        footer_text TEXT DEFAULT 'Building the future, one commit at a time.',
        site_description TEXT DEFAULT 'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'
      );
    `);
    
    console.log('✅ All tables created with indexes');
    
    console.log('👤 Creating admin user...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    await pool.query(`
      INSERT INTO users (username, password, display_name) 
      VALUES ('admin', $1, 'Admin')
    `, [hashedPassword]);
    
    console.log('⚙️  Inserting default settings...');
    
    // Insert into settings table
    await pool.query(`
      INSERT INTO settings (site_title, footer_text, site_description) 
      VALUES (
        'LIMEBYTE',
        'Building the future, one commit at a time.',
        'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'
      )
    `);
    
    // Insert into site_settings table
    await pool.query(`
      INSERT INTO site_settings (site_title, footer_text, site_description) 
      VALUES (
        'LIMEBYTE',
        'Building the future, one commit at a time.',
        'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'
      )
    `);
    
    console.log('🎯 Adding some sample data...');
    
    // Add a sample post
    await pool.query(`
      INSERT INTO posts (subject, message, slug, author_id, view_count) 
      VALUES (
        'Welcome to LIMEBYTE',
        '<p>This is your first post! The view count and sorting features are ready to go.</p><p>You can now sort by date or views, and each post tracks how many times it''s been viewed.</p>',
        '123456',
        1,
        5
      )
    `);
    
    console.log('\n🎉 FRESH DEPLOY COMPLETE!');
    console.log('📊 Database Statistics:');
    console.log('   - 6 tables created');
    console.log('   - Admin user ready');
    console.log('   - Settings configured');
    console.log('   - Sample post added');
    console.log('   - View counting enabled');
    console.log('   - Sorting ready');
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    
    console.log('\n🚀 Ready to launch: npm start');
    
  } catch (error) {
    console.error('❌ DEPLOY FAILED:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

deployFresh(); 