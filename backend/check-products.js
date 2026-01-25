const pool = require('./config/db');

async function checkProducts() {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        console.log('Products in database:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkProducts();
