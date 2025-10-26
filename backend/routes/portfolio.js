const express = require('express');
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Debug middleware to log auth info
router.use((req, res, next) => {
    console.log('🔐 Portfolio route - User:', req.user?.id, req.user?.username);
    next();
});

// Get user portfolio
router.get('/', async (req, res) => {
    try {
        console.log('📊 Fetching portfolio for user:', req.user.id);

        let portfolio = await Portfolio.findOne({ user: req.user.id }).populate('user');

        if (!portfolio) {
            console.log('📝 Creating new portfolio for user:', req.user.id);
            portfolio = await Portfolio.create({ user: req.user.id, stocks: [] });
        }

        console.log('✅ Portfolio fetched successfully');
        res.json(portfolio);
    } catch (error) {
        console.error('❌ Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

// Buy stocks
router.post('/buy', async (req, res) => {
    try {
        const { symbol, quantity, price } = req.body;

        // Validate request data
        if (!symbol || !quantity || !price) {
            return res.status(400).json({
                error: 'Missing required fields: symbol, quantity, price'
            });
        }

        const parsedQuantity = parseInt(quantity);
        const parsedPrice = parseFloat(price);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                error: 'Quantity must be a positive number'
            });
        }

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                error: 'Price must be a positive number'
            });
        }

        const totalCost = parsedQuantity * parsedPrice;
        const userId = req.user.id;

        console.log(`🛒 Buy request: ${parsedQuantity} ${symbol} @ $${parsedPrice} = $${totalCost} for user: ${userId}`);

        // Check if user has sufficient balance
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found:', userId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`💰 User balance: $${user.balance}, Required: $${totalCost}`);

        if (user.balance < totalCost) {
            console.log('❌ Insufficient balance');
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Update user balance
        user.balance -= totalCost;
        await user.save();
        console.log('✅ User balance updated:', user.balance);

        // Update portfolio
        let portfolio = await Portfolio.findOne({ user: userId });
        if (!portfolio) {
            console.log('📝 Creating new portfolio');
            portfolio = new Portfolio({ user: userId, stocks: [] });
        }

        const existingStockIndex = portfolio.stocks.findIndex(stock => stock.symbol === symbol);

        if (existingStockIndex > -1) {
            const existingStock = portfolio.stocks[existingStockIndex];
            const newTotalQuantity = existingStock.quantity + parsedQuantity;
            const newTotalInvested = existingStock.totalInvested + totalCost;

            portfolio.stocks[existingStockIndex].quantity = newTotalQuantity;
            portfolio.stocks[existingStockIndex].averagePrice = newTotalInvested / newTotalQuantity;
            portfolio.stocks[existingStockIndex].totalInvested = newTotalInvested;
            console.log(`📈 Updated existing stock: ${symbol}, new quantity: ${newTotalQuantity}`);
        } else {
            portfolio.stocks.push({
                symbol,
                quantity: parsedQuantity,
                averagePrice: parsedPrice,
                totalInvested: totalCost
            });
            console.log(`🆕 Added new stock: ${symbol}, quantity: ${parsedQuantity}`);
        }

        await portfolio.save();
        console.log('✅ Portfolio saved successfully');

        // Record transaction
        await Transaction.create({
            user: userId,
            type: 'BUY',
            symbol,
            quantity: parsedQuantity,
            price: parsedPrice,
            totalAmount: totalCost
        });
        console.log('✅ Transaction recorded');

        res.json({
            message: 'Stock purchased successfully',
            balance: user.balance,
            portfolio: portfolio.stocks
        });
    } catch (error) {
        console.error('❌ Error buying stock:', error);
        res.status(400).json({ error: error.message });
    }
});

// Sell stocks
router.post('/sell', async (req, res) => {
    try {
        const { symbol, quantity, price } = req.body;

        // Validate request data
        if (!symbol || !quantity || !price) {
            return res.status(400).json({
                error: 'Missing required fields: symbol, quantity, price'
            });
        }

        const parsedQuantity = parseInt(quantity);
        const parsedPrice = parseFloat(price);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                error: 'Quantity must be a positive number'
            });
        }

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                error: 'Price must be a positive number'
            });
        }

        const totalRevenue = parsedQuantity * parsedPrice;
        const userId = req.user.id;

        console.log(`💰 Sell request: ${parsedQuantity} ${symbol} @ $${parsedPrice} = $${totalRevenue} for user: ${userId}`);

        // Check if user owns the stock and has sufficient quantity
        let portfolio = await Portfolio.findOne({ user: userId });
        if (!portfolio) {
            console.log('❌ No portfolio found for user:', userId);
            return res.status(400).json({ error: 'No stocks found' });
        }

        const existingStockIndex = portfolio.stocks.findIndex(stock => stock.symbol === symbol);
        if (existingStockIndex === -1) {
            console.log('❌ Stock not found in portfolio:', symbol);
            return res.status(400).json({ error: 'Stock not found in portfolio' });
        }

        const existingStock = portfolio.stocks[existingStockIndex];
        if (existingStock.quantity < parsedQuantity) {
            console.log(`❌ Insufficient quantity: Have ${existingStock.quantity}, Trying to sell ${parsedQuantity}`);
            return res.status(400).json({ error: 'Insufficient stock quantity' });
        }

        // Update user balance
        const user = await User.findById(userId);
        user.balance += totalRevenue;
        await user.save();
        console.log('✅ User balance updated:', user.balance);

        // Update portfolio
        existingStock.quantity -= parsedQuantity;
        existingStock.totalInvested = existingStock.averagePrice * existingStock.quantity;

        // Remove stock if quantity becomes zero
        if (existingStock.quantity === 0) {
            portfolio.stocks.splice(existingStockIndex, 1);
            console.log(`🗑️ Removed stock from portfolio: ${symbol}`);
        }

        await portfolio.save();
        console.log('✅ Portfolio updated');

        // Record transaction
        await Transaction.create({
            user: userId,
            type: 'SELL',
            symbol,
            quantity: parsedQuantity,
            price: parsedPrice,
            totalAmount: totalRevenue
        });
        console.log('✅ Sell transaction recorded');

        res.json({
            message: 'Stock sold successfully',
            balance: user.balance,
            portfolio: portfolio.stocks
        });
    } catch (error) {
        console.error('❌ Error selling stock:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;