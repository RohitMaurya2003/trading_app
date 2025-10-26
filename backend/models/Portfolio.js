const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stocks: [{
        symbol: {
            type: String,
            required: true,
            uppercase: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        averagePrice: {
            type: Number,
            required: true,
            min: 0
        },
        totalInvested: {
            type: Number,
            required: true,
            min: 0
        }
    }]
});

// Remove the unique index that might cause issues
portfolioSchema.index({ user: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);