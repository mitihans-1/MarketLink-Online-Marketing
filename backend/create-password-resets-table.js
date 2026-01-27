const db = require('./config/db');

const createPasswordResetsTable = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token_hash VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                used TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await db.query(createTableQuery);
        console.log('password_resets table created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating password_resets table:', error);
        process.exit(1);
    }
};

createPasswordResetsTable();
