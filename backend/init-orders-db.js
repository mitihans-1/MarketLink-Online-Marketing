const pool = require('./config/db');

async function initOrdersTable() {
    try {
        console.log('Creating orders and order_items tables...');

        // 1. Create Orders Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                shipping_address TEXT NOT NULL,
                city VARCHAR(100) NOT NULL,
                state VARCHAR(100) NOT NULL,
                zip_code VARCHAR(20) NOT NULL,
                country VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                payment_method VARCHAR(50) DEFAULT 'Card',
                status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('- Orders table created/verified');

        // 2. Create Order Items Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('- Order Items table created/verified');

        console.log('Order system database setup successful!');
        process.exit(0);
    } catch (err) {
        console.error('Database Error:', err.message);
        process.exit(1);
    }
}

initOrdersTable();
