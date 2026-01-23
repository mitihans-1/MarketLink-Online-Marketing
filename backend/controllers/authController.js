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

        // Send verification email (Optional now but kept for logic, users can still login)
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const message = `Please verify your email by clicking the link: ${verificationUrl}`;
        const html = `
            <h1>Email Verification</h1>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        `;

        console.log(`Attempting to send verification email to: ${email}`);
        try {
            await sendEmail({
                email: email,
                subject: 'MarketLink - Account Created',
                message,
                html
            });
            console.log('Notification email sent successfully');

            res.status(201).json({
                message: 'Registration successful! You can now log in.',
                success: true
            });
        } catch (emailError) {
            console.error('Email sending failed (non-critical):', emailError);
            res.status(201).json({
                message: 'Registration successful! You can now log in.',
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
        console.log(`Verifying token: ${token}`);
        const [users] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);

        if (users.length === 0) {
            console.log(`Verification failed: Token not found or already used.`);
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        const user = users[0];
        console.log(`Found user for verification: ${user.email} (ID: ${user.id})`);

        const [updateResult] = await db.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
            [user.id]
        );
        console.log(`Update result for user ${user.id}:`, updateResult);

        res.json({ message: 'Email verified successfully! You can now log in.', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
    const { email, name, googleId, avatar, role } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            // Register new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);

            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?)',
                [name || email.split('@')[0], email, hashedPassword, role || 'buyer', true, avatar || '']
            );

            const [newUsers] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUsers[0];

            // Send welcome email for Google registration
            try {
                const message = `
                    <h1>Welcome to MarketLink!</h1>
                    <p>You have successfully registered using your Google account.</p>
                    <p>We are excited to have you on board.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p>The MarketLink Team</p>
                `;

                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to MarketLink',
                    message: 'Welcome to MarketLink! Your account has been created via Google.',
                    html: message
                });
                console.log(`Welcome email sent to Google user: ${user.email}`);
            } catch (emailError) {
                console.error('Failed to send welcome email (Google):', emailError);
            }
        }

        // Return token and user info
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            storeName: user.store_name,
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
    const { email, name, facebookId, avatar, role } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            // Register new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);

            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?)',
                [name || email.split('@')[0], email, hashedPassword, role || 'buyer', true, avatar || '']
            );

            const [newUsers] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUsers[0];

            // Send welcome email for Facebook registration
            try {
                const message = `
                    <h1>Welcome to MarketLink!</h1>
                    <p>You have successfully registered using your Facebook account.</p>
                    <p>We are excited to have you on board.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p>The MarketLink Team</p>
                `;

                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to MarketLink',
                    message: 'Welcome to MarketLink! Your account has been created via Facebook.',
                    html: message
                });
                console.log(`Welcome email sent to Facebook user: ${user.email}`);
            } catch (emailError) {
                console.error('Failed to send welcome email (Facebook):', emailError);
            }
        }

        // Return token and user info
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            storeName: user.store_name,
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
        // Check for user email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            // Email verification check bypassed as requested (default verified)
            if (!user.is_verified) {
                return res.status(401).json({ message: 'Please verify your email before logging in' });
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                storeName: user.store_name,
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

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    googleAuth,
    facebookAuth
};
