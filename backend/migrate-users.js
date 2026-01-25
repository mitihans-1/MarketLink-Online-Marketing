const pool = require('./config/db');

async function migrateUsers() {
    try {
        console.log('Adding phone, address, and bio to users table...');

        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS bio TEXT
        `);

        console.log('Users table migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration Error:', err.message);
        process.exit(1);
    }
}

migrateUsers();
