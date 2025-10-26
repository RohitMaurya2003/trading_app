const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.use(auth);

// Get user's transaction history
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transactions for a specific stock
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const transactions = await Transaction.find({
            user: req.user.id,
            symbol: symbol.toUpperCase()
        }).sort({ timestamp: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;