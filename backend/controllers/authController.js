const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, seller, admin]
 */

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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset code (Step 1)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code sent to email
 *       404:
 *         description: User not found
 */
// @desc    Request password reset (Step 1)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const user = users[0];

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Invalidate previous codes for this user
        await db.query('UPDATE password_resets SET used = 1 WHERE user_id = ?', [user.id]);

        await db.query(
            'INSERT INTO password_resets (user_id, token_hash, expires_at, used) VALUES (?, ?, ?, ?)',
            [user.id, resetCode, expires, 0]
        );

        const message = `Your password reset code is: ${resetCode}. It will expire in 10 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">Reset Your Password</h2>
                <p>You requested to reset your password. Use the verification code below to proceed:</p>
                <div style="background: #f0f4f8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #102a43;">${resetCode}</h1>
                </div>
                <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 20px 0;">
                <p style="font-size: 12px; color: #627d98; text-align: center;">MarketLink - Online Marketing Platform</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'MarketLink - Password Reset Code',
                message,
                html
            });
            res.json({ message: 'Reset code sent to your email' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(500).json({ message: 'Failed to send reset email' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @swagger
 * /auth/verify-reset-code:
 *   post:
 *     summary: Verify the 6-digit reset code (Step 2)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid or expired code
 */
// @desc    Verify reset code (Step 2)
// @route   POST /api/auth/verify-reset-code
const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        const [rows] = await db.query(
            'SELECT * FROM password_resets WHERE user_id = ? AND token_hash = ? AND used = 0 AND expires_at > ?',
            [user.id, code, new Date()]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        res.json({ message: 'Code verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using code (Step 3)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid code or token
 */
// @desc    Reset password (Step 3)
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        const [rows] = await db.query(
            'SELECT * FROM password_resets WHERE user_id = ? AND token_hash = ? AND used = 0 AND expires_at > ?',
            [user.id, code, new Date()]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        const resetEntry = rows[0];

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

        // Mark code used
        await db.query('UPDATE password_resets SET used = 1 WHERE id = ?', [resetEntry.id]);

        res.json({ message: 'Password reset successful', success: true });
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
    switchToSeller,
    forgotPassword,
    verifyResetCode,
    resetPassword
};

