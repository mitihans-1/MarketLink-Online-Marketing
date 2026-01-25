const pool = require('./config/db');
const fs = require('fs');

async function dump() {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        fs.writeFileSync('dump_products.txt', JSON.stringify(rows, null, 2));
        console.log('Dumped ' + rows.length + ' products');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
dump();
