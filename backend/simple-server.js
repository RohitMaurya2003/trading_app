const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test basic route first
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Test individual routes one by one
try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.log('❌ Auth routes error:', error.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Simple server running on port ${PORT}`);
});