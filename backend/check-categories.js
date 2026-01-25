const pool = require('./config/db');

async function checkCategories() {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        console.log('Categories in database:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkCategories();
