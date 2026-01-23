const db = require('./config/db');

const createSubscribersTable = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.query(createTableQuery);
        console.log('Subscribers table created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating subscribers table:', error);
        process.exit(1);
    }
};

createSubscribersTable();
