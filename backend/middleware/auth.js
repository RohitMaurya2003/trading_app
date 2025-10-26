const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        console.log('🔐 Auth middleware - Token received:', token ? 'Yes' : 'No');

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 Token decoded for user ID:', decoded.id);

        // Find user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('❌ User not found for token');
            return res.status(401).json({ error: 'Token is not valid - user not found' });
        }

        req.user = user;
        console.log('✅ User authenticated:', user.username);
        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = auth;