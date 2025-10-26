const express = require('express');
const axios = require('axios');
const router = express.Router();

const FMP_API_KEY = process.env.FMP_API_KEY;

// Financial Modeling Prep API - 250 requests/day free
const getFMPData = async (symbol) => {
    try {
        const response = await axios.get(
            `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
        );

        const data = response.data[0];

        return {
            symbol: data.symbol,
            price: data.price,
            open: data.open,
            high: data.dayHigh,
            low: data.dayLow,
            volume: data.volume,
            previousClose: data.previousClose,
            change: data.change,
            changePercent: data.changesPercentage
        };
    } catch (error) {
        throw new Error('Failed to fetch from FMP');
    }
};

// Get stock quote with FMP as primary
router.get('/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;

        console.log(`📈 Fetching quote for: ${symbol}`);

        // Try FMP first
        if (FMP_API_KEY && FMP_API_KEY !== 'your-free-fmp-api-key-here') {
            try {
                const stockData = await getFMPData(symbol);
                console.log(`✅ Successfully fetched ${symbol} from FMP: $${stockData.price}`);
                return res.json(stockData);
            } catch (fmpError) {
                console.log('❌ FMP failed, trying Yahoo Finance...');
            }
        }

        // Fallback to Yahoo Finance
        try {
            const yahooResponse = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
            );

            const result = yahooResponse.data.chart.result[0];
            const meta = result.meta;
            const indicators = result.indicators.quote[0];

            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.previousClose;
            const change = currentPrice - previousClose;
            const changePercent = ((change / previousClose) * 100).toFixed(2);

            const stockData = {
                symbol: symbol,
                price: currentPrice,
                open: indicators.open[0],
                high: indicators.high[0],
                low: indicators.low[0],
                volume: indicators.volume[0],
                previousClose: previousClose,
                change: change,
                changePercent: changePercent
            };

            console.log(`✅ Successfully fetched ${symbol} from Yahoo Finance: $${stockData.price}`);
            return res.json(stockData);
        } catch (yahooError) {
            console.log('❌ Yahoo Finance failed, using mock data...');
            getMockStockData(symbol, res);
        }
    } catch (error) {
        console.error('❌ All APIs failed:', error.message);
        getMockStockData(symbol, res);
    }
});

// Rest of the routes remain similar to previous example...
// [Include the search, batch, and mock functions from above]