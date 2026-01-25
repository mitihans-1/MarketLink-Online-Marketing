const db = require('./config/db');

const fixUsers = async () => {
    try {
        const [result] = await db.query(
            "UPDATE users SET role = 'buyer' WHERE role IS NULL OR role = '' OR role = 'user'"
        );
        console.log(`Successfully updated ${result.affectedRows} users to 'buyer' role.`);

        const [users] = await db.query("SELECT email, role FROM users");
        console.log('Current User Roles:');
        users.forEach(u => console.log(`${u.email}: ${u.role}`));

        process.exit(0);
    } catch (error) {
        console.error('Error updating users:', error);
        process.exit(1);
    }
};

fixUsers();
