const pool = require('./config/db');

async function checkUsers() {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role FROM users');
        console.log('Users in database:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkUsers();
