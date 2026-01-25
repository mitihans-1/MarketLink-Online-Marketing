const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        // Check if user exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'user', false, verificationToken]
        );

        const userId = result.insertId;

        // Send verification email
        const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-email/${verificationToken}`;

        const message = `Please verify your email by clicking the link: ${verificationUrl}`;
        const html = `
            <h1>Email Verification</h1>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        `;

        try {
            await sendEmail({
                email: email,
                subject: 'MarketLink - Account Created',
                message,
                html
            });
            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.',
                success: true
            });
        } catch (emailError) {
            console.error('Email sending failed (non-critical):', emailError);
            res.status(201).json({
                message: 'Registration successful! However, we could not send a verification email. Please contact support.',
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);

        if (users.length === 0) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&message=invalid_token`);
        }

        const user = users[0];
        await db.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
            [user.id]
        );

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&message=server_error`);
    }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
    const { email, name, avatar, role } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);

            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?)',
                [name || email.split('@')[0], email, hashedPassword, role || 'user', true, avatar || '']
            );

            const [newUsers] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUsers[0];
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user.id),
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate with Facebook
// @route   POST /api/auth/facebook
const facebookAuth = async (req, res) => {
    const { email, name, avatar, role } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);

            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?)',
                [name || email.split('@')[0], email, hashedPassword, role || 'user', true, avatar || '']
            );

            const [newUsers] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUsers[0];
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user.id),
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.is_verified) {
                return res.status(401).json({ message: 'Please verify your email before logging in' });
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user.id),
                success: true
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, avatar, phone, address, bio FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const { name, phone, address, bio } = req.body;

    try {
        await db.query(
            'UPDATE users SET name = ?, phone = ?, address = ?, bio = ? WHERE id = ?',
            [name, phone, address, bio, req.user.id]
        );

        const [users] = await db.query('SELECT id, name, email, role, avatar, phone, address, bio FROM users WHERE id = ?', [req.user.id]);

        res.json({
            message: 'Profile updated successfully',
            user: users[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, created_at, avatar FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const { role } = req.body;
    try {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Switch user role to seller
// @route   POST /api/auth/switch-to-seller
// @access  Private
const switchToSeller = async (req, res) => {
    try {
        // Update user role to 'both'
        await db.query('UPDATE users SET role = ? WHERE id = ?', ['both', req.user.id]);

        const [users] = await db.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.user.id]);

        res.json({
            message: 'Account upgraded to seller successfully!',
            user: users[0],
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    googleAuth,
    facebookAuth,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserRole,
    deleteUser,
    switchToSeller
};
