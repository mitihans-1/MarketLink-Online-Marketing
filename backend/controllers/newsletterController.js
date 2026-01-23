const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
const subscribe = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if email already exists
        const [existingSubscriber] = await db.query('SELECT * FROM subscribers WHERE email = ?', [email]);

        if (existingSubscriber.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        }

        // Insert new subscriber
        await db.query('INSERT INTO subscribers (email) VALUES (?)', [email]);

        // Send welcome email
        try {
            const message = `
                <h1>Welcome to MarketLink Newsletter!</h1>
                <p>Thank you for subscribing to our newsletter.</p>
                <p>You will now receive updates about our:</p>
                <ul>
                    <li>Latest Product Launches</li>
                    <li>Exclusive Deals & Discounts</li>
                    <li>Seller Success Stories</li>
                </ul>
                <p>Stay tuned!</p>
                <br>
                <p>Best Regards,</p>
                <p>The MarketLink Team</p>
            `;

            await sendEmail({
                email: email,
                subject: 'Welcome to MarketLink Newsletter',
                message: 'Thank you for subscribing to MarketLink! Stay tuned for updates.',
                html: message
            });
            console.log(`Newsletter welcome email sent to: ${email}`);
        } catch (emailError) {
            console.error('Failed to send newsletter email:', emailError);
            // We don't fail the request if email fails, but we log it
        }

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

module.exports = {
    subscribe
};
