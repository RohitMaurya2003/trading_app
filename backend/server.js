const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Configure CORS properly
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/ai-trading', require('./routes/ai-trading'));

// Import routes
try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.log('❌ Auth routes failed to load:', error.message);
}

try {
    const stocksRoutes = require('./routes/stocks');
    app.use('/api/stocks', stocksRoutes);
    console.log('✅ Stocks routes loaded');
} catch (error) {
    console.log('❌ Stocks routes failed to load:', error.message);
}

try {
    const portfolioRoutes = require('./routes/portfolio');
    app.use('/api/portfolio', portfolioRoutes);
    console.log('✅ Portfolio routes loaded');
} catch (error) {
    console.log('❌ Portfolio routes loaded failed to load:', error.message);
}

try {
    const transactionsRoutes = require('./routes/transactions');
    app.use('/api/transactions', transactionsRoutes);
    console.log('✅ Transactions routes loaded');
} catch (error) {
    console.log('❌ Transactions routes failed to load:', error.message);
}

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Basic health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'OK',
        message: 'Server is running',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Test route to check if API is working
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});