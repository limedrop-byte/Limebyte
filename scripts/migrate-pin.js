const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function migratePinColumn() {
  try {
    console.log('🔄 Adding pinned column to posts table...');
    
    // Check if column already exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'posts' AND column_name = 'pinned'
    `);
    
    if (columnCheck.rows.length > 0) {
      console.log('✅ Pinned column already exists');
      return;
    }
    
    // Read and execute migration
    const migrationPath = path.join(__dirname, '../migrations/add_pinned_to_posts.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    
    console.log('✅ Successfully added pinned column to posts table');
    console.log('📌 All existing posts are set to pinned = false by default');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migratePinColumn()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migratePinColumn; 