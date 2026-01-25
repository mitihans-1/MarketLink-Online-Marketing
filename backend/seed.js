const pool = require('./config/db');

const products = [
    {
        name: "Premium Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with 30hr battery life",
        price: 299.99,
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category_name: "Electronics",
        stock: 45
    },
    {
        name: "Smart Fitness Watch",
        description: "Track your health with heart rate, sleep, and activity monitoring",
        price: 199.99,
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category_name: "Wearables",
        stock: 28
    },
    {
        name: "Professional Camera Kit",
        description: "DSLR camera with 24.1MP sensor and 18-55mm lens",
        price: 899.99,
        image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category_name: "Photography",
        stock: 12
    },
    {
        name: "Ergonomic Office Chair",
        description: "Adjustable lumbar support with breathable mesh back",
        price: 349.99,
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category_name: "Furniture",
        stock: 62
    }
];

async function seed() {
    try {
        // 1. Get a seller/admin ID
        const [users] = await pool.query("SELECT id FROM users WHERE role IN ('seller', 'admin') LIMIT 1");
        if (users.length === 0) {
            console.error("No seller or admin found to associate products with. Please register a seller first.");
            process.exit(1);
        }
        const sellerId = users[0].id;
        console.log(`Using seller ID: ${sellerId}`);

        for (const p of products) {
            // 2. Ensure category exists
            let [categories] = await pool.query("SELECT id FROM categories WHERE name = ?", [p.category_name]);
            let categoryId;
            if (categories.length === 0) {
                const slug = p.category_name.toLowerCase().replace(/ /g, '-');
                const [result] = await pool.query("INSERT INTO categories (name, slug) VALUES (?, ?)", [p.category_name, slug]);
                categoryId = result.insertId;
                console.log(`Created category: ${p.category_name}`);
            } else {
                categoryId = categories[0].id;
            }

            // 3. Insert product
            await pool.query(
                "INSERT INTO products (name, description, price, image_url, category_id, stock, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [p.name, p.description, p.price, p.image_url, categoryId, p.stock, sellerId]
            );
            console.log(`Inserted product: ${p.name}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();
