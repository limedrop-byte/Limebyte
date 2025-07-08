const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up LIMEBYTE database...');
    console.log('🗑️  Dropping existing tables...');
    
    // Drop all tables (in correct order to handle foreign keys)
    await pool.query(`DROP TABLE IF EXISTS posts CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS links CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS subscribers CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS settings CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS site_settings CASCADE;`);
    
    console.log('✅ Tables dropped successfully');
    
    console.log('📋 Creating tables...');
    
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
    console.log('✅ Users table created');
    
    // Create posts table (with view_count included)
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
    console.log('✅ Posts table created');
    
    // Create links table
    await pool.query(`
      CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Links table created');
    
    // Create subscribers table
    await pool.query(`
      CREATE TABLE subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Subscribers table created');
    
    // Create settings table (with all columns)
    await pool.query(`
      CREATE TABLE settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255) DEFAULT 'LIMEBYTE',
        footer_text TEXT DEFAULT 'Building the future, one commit at a time.',
        site_description TEXT DEFAULT 'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'
      );
    `);
    console.log('✅ Settings table created');
    
    console.log('🔑 Creating default admin user...');
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    await pool.query(`
      INSERT INTO users (username, password, display_name) 
      VALUES ('admin', $1, 'Admin')
    `, [hashedPassword]);
    console.log('✅ Default admin user created (username: admin, password: admin)');
    
    console.log('⚙️  Inserting default settings...');
    
    // Insert default settings
    await pool.query(`
      INSERT INTO settings (site_title, footer_text, site_description) 
      VALUES (
        'LIMEBYTE',
        'Building the future, one commit at a time.',
        'No expectations, just building weird stuff for fun. Made with AI. Repo''s public. Check out the shorts, the games, and join the newsletter n'' shit.'
      )
    `);
    console.log('✅ Default settings inserted');
    
    console.log('📂 Running existing migrations...');
    
    // Run any existing migrations (but skip the ones we've already applied)
    const migrationsDir = path.join(__dirname, '../migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .filter(file => !file.includes('add_view_count')) // Skip since we already included it
        .sort();
      
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        console.log(`📂 Running migration: ${file}`);
        
        // Split SQL by semicolons and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            await pool.query(statement.trim());
          }
        }
        
        console.log(`✅ Completed: ${file}`);
      }
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📋 All tables created and populated with default data');
    console.log('\n🔐 Default credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    console.log('\n🚀 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\n💡 Common fixes:');
    console.error('   - Make sure PostgreSQL is running');
    console.error('   - Check your database connection settings in config/database.js');
    console.error('   - Ensure the database "limebyte_blog" exists');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 