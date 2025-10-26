const express = require('express');
const axios = require('axios');
const router = express.Router();

// Indian stock symbols mapping - EXPANDED LIST
const indianStocks = {
    'RELIANCE': { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE' },
    'TCS': { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE' },
    'HDFCBANK': { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE' },
    'INFY': { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE' },
    'HINDUNILVR': { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE' },
    'ICICIBANK': { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE' },
    'SBIN': { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE' },
    'BHARTIARTL': { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE' },
    'KOTAKBANK': { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE' },
    'ITC': { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE' },
    'LT': { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE' },
    'HCLTECH': { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE' },
    'AXISBANK': { symbol: 'AXISBANK', name: 'Axis Bank Ltd', exchange: 'NSE' },
    'MARUTI': { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE' },
    'ASIANPAINT': { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE' },
    'SUNPHARMA': { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', exchange: 'NSE' },
    'TITAN': { symbol: 'TITAN', name: 'Titan Company Ltd', exchange: 'NSE' },
    'ULTRACEMCO': { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE' },
    'WIPRO': { symbol: 'WIPRO', name: 'Wipro Ltd', exchange: 'NSE' },
    'NESTLEIND': { symbol: 'NESTLEIND', name: 'Nestle India Ltd', exchange: 'NSE' },
    'CIPLA': { symbol: 'CIPLA', name: 'Cipla Ltd', exchange: 'NSE' },
    'DRREDDY': { symbol: 'DRREDDY', name: 'Dr Reddys Laboratories Ltd', exchange: 'NSE' },
    'BIOCON': { symbol: 'BIOCON', name: 'Biocon Ltd', exchange: 'NSE' },
    'LUPIN': { symbol: 'LUPIN', name: 'Lupin Ltd', exchange: 'NSE' },
    'AUROPHARMA': { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd', exchange: 'NSE' }
};

// Helper function to generate realistic Indian stock prices with proper changes
const generateIndianStockPrice = (symbol) => {
    const basePrices = {
        'RELIANCE': 2450, 'TCS': 3400, 'HDFCBANK': 1650, 'INFY': 1550, 'HINDUNILVR': 2450,
        'ICICIBANK': 950, 'SBIN': 600, 'BHARTIARTL': 1150, 'KOTAKBANK': 1750, 'ITC': 430,
        'LT': 3200, 'HCLTECH': 1300, 'AXISBANK': 1050, 'MARUTI': 10500, 'ASIANPAINT': 2900,
        'SUNPHARMA': 1250, 'TITAN': 3500, 'ULTRACEMCO': 8500, 'WIPRO': 450, 'NESTLEIND': 24500,
        'CIPLA': 1200, 'DRREDDY': 5500, 'BIOCON': 250, 'LUPIN': 1300, 'AUROPHARMA': 600
    };

    const basePrice = basePrices[symbol] || 1000;

    // Increased volatility for more noticeable changes (5% instead of 2%)
    const volatility = 0.05;

    // Generate more significant changes
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;

    // Ensure changes are significant enough to display (minimum 0.5% change)
    const minChange = basePrice * 0.005;

    let finalChange = Math.round(change * 100) / 100;
    let finalChangePercent = Math.round(changePercent * 100) / 100;

    // If change is too small, make it more significant
    if (Math.abs(finalChange) < minChange) {
        finalChange = (Math.random() > 0.5 ? 1 : -1) * (minChange + Math.random() * minChange);
        finalChangePercent = (finalChange / basePrice) * 100;
        finalChangePercent = Math.round(finalChangePercent * 100) / 100;
    }

    return {
        price: Math.round(price * 100) / 100,
        change: finalChange,
        changePercent: finalChangePercent
    };
};

// ==================== DYNAMIC SEARCH ROUTE ====================
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;

        if (!query || query.length < 1) {
            return res.json([]);
        }

        console.log(`🔍 DYNAMIC SEARCH for: ${query}`);

        // FIRST: Try Yahoo Finance API for dynamic search
        try {
            const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=20&newsCount=0`;

            console.log(`🌐 Calling Yahoo Finance: ${searchUrl}`);

            const response = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });

            console.log('📊 Yahoo Finance raw response:', JSON.stringify(response.data, null, 2));

            if (response.data && response.data.quotes) {
                // Filter for Indian stocks
                const indianResults = response.data.quotes
                    .filter(quote =>
                        quote.symbol.includes('.NS') ||
                        quote.symbol.includes('.BO') ||
                        quote.exchange === 'NSI' ||
                        (quote.quoteType === 'EQUITY' && quote.region === 'IN')
                    )
                    .map(quote => ({
                        symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
                        name: quote.longname || quote.shortname || quote.name,
                        exchange: quote.exchange === 'NSI' ? 'NSE' : 'BSE',
                        type: quote.quoteType,
                        region: quote.region
                    }));

                console.log(`✅ Yahoo Finance DYNAMIC search found: ${indianResults.length} stocks for "${query}"`);

                if (indianResults.length > 0) {
                    return res.json(indianResults);
                }
            }
        } catch (yahooError) {
            console.error('❌ Yahoo Finance search failed:', yahooError.message);
        }

        // SECOND: Fallback to our predefined list
        console.log('📋 Falling back to predefined Indian stocks list');
        const fallbackResults = Object.values(indianStocks)
            .filter(stock =>
                stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
                stock.name.toLowerCase().includes(query.toLowerCase())
            )
            .map(stock => ({
                symbol: stock.symbol,
                name: stock.name,
                type: 'EQUITY',
                region: 'IN',
                exchange: stock.exchange
            }));

        console.log(`📋 Fallback search found: ${fallbackResults.length} stocks for "${query}"`);
        res.json(fallbackResults);

    } catch (error) {
        console.error('❌ ALL search methods failed:', error.message);

        // Ultimate fallback
        const { query } = req.params;
        const fallbackResults = Object.values(indianStocks)
            .filter(stock =>
                stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
                stock.name.toLowerCase().includes(query.toLowerCase())
            )
            .map(stock => ({
                symbol: stock.symbol,
                name: stock.name,
                type: 'EQUITY',
                region: 'IN',
                exchange: stock.exchange
            }));

        console.log(`🆘 Ultimate fallback: ${fallbackResults.length} stocks for "${query}"`);
        res.json(fallbackResults);
    }
});

// ==================== QUOTE ROUTE ====================
router.get('/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const upperSymbol = symbol.toUpperCase();

        console.log(`📈 Fetching quote for: ${upperSymbol}`);

        // Try Yahoo Finance first
        try {
            const yahooSymbol = `${upperSymbol}.NS`;
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 10000
                }
            );

            if (response.data.chart?.result?.[0]) {
                const result = response.data.chart.result[0];
                const meta = result.meta;
                const indicators = result.indicators.quote[0];

                const currentPrice = meta.regularMarketPrice;
                const previousClose = meta.previousClose;
                const change = currentPrice - previousClose;
                const changePercent = ((change / previousClose) * 100).toFixed(2);

                const stockInfo = indianStocks[upperSymbol] || {
                    name: meta.shortName || `${upperSymbol} Limited`,
                    exchange: 'NSE'
                };

                const stockData = {
                    symbol: upperSymbol,
                    currentPrice: currentPrice || 0,
                    open: indicators.open?.[0] || 0,
                    high: indicators.high?.[0] || 0,
                    low: indicators.low?.[0] || 0,
                    volume: indicators.volume?.[0] || 0,
                    previousClose: previousClose || 0,
                    change: change || 0,
                    changePercent: changePercent || '0',
                    companyName: stockInfo.name,
                    exchange: stockInfo.exchange,
                    currency: 'INR',
                    source: 'yahoo'
                };

                console.log(`✅ Yahoo: ${upperSymbol} - ₹${stockData.currentPrice} (${changePercent}%)`);
                return res.json(stockData);
            }
        } catch (yahooError) {
            console.log('❌ Yahoo Finance quote failed:', yahooError.message);
        }

        // Fallback to generated data with realistic changes
        const stockInfo = indianStocks[upperSymbol] || {
            name: `${upperSymbol} Limited`,
            exchange: 'NSE'
        };

        const generatedData = generateIndianStockPrice(upperSymbol);
        const stockData = {
            symbol: upperSymbol,
            currentPrice: generatedData.price,
            open: generatedData.price - generatedData.change + (Math.random() * 20),
            high: generatedData.price + (Math.random() * 50),
            low: generatedData.price - (Math.random() * 40),
            volume: Math.floor(Math.random() * 10000000),
            previousClose: generatedData.price - generatedData.change,
            change: generatedData.change,
            changePercent: generatedData.changePercent,
            companyName: stockInfo.name,
            exchange: stockInfo.exchange,
            currency: 'INR',
            source: 'generated'
        };

        console.log(`✅ Generated: ${upperSymbol} - ₹${stockData.currentPrice} (${generatedData.changePercent}%)`);
        res.json(stockData);

    } catch (error) {
        console.error('❌ All quote methods failed:', error.message);

        const { symbol } = req.params;
        const upperSymbol = symbol.toUpperCase();
        const generatedData = generateIndianStockPrice(upperSymbol);

        const stockData = {
            symbol: upperSymbol,
            currentPrice: generatedData.price,
            open: generatedData.price - generatedData.change,
            high: generatedData.price + 50,
            low: generatedData.price - 40,
            volume: Math.floor(Math.random() * 5000000),
            previousClose: generatedData.price - generatedData.change,
            change: generatedData.change,
            changePercent: generatedData.changePercent,
            companyName: `${upperSymbol} Limited`,
            exchange: 'NSE',
            currency: 'INR',
            source: 'error-fallback'
        };

        res.json(stockData);
    }
});

// ==================== BATCH QUOTES ROUTE ====================
router.get('/batch', async (req, res) => {
    try {
        const symbols = req.query.symbols || 'RELIANCE,TCS,HDFCBANK,INFY,HINDUNILVR,ICICIBANK,SBIN';
        const symbolList = symbols.split(',');

        console.log(`🔄 Batch fetching: ${symbols}`);

        const stockData = await Promise.all(
            symbolList.map(async (symbol) => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/stocks/quote/${symbol}`);
                    return response.data;
                } catch (error) {
                    console.log(`❌ Batch failed for ${symbol}`);
                    const upperSymbol = symbol.toUpperCase();
                    const stockInfo = indianStocks[upperSymbol] || { name: `${upperSymbol} Limited`, exchange: 'NSE' };
                    const generatedData = generateIndianStockPrice(upperSymbol);

                    return {
                        symbol: upperSymbol,
                        currentPrice: generatedData.price,
                        open: generatedData.price - generatedData.change,
                        high: generatedData.price + 50,
                        low: generatedData.price - 40,
                        volume: Math.floor(Math.random() * 5000000),
                        previousClose: generatedData.price - generatedData.change,
                        change: generatedData.change,
                        changePercent: generatedData.changePercent,
                        companyName: stockInfo.name,
                        exchange: stockInfo.exchange,
                        currency: 'INR'
                    };
                }
            })
        );

        const validStockData = stockData.filter(stock => stock !== null);
        console.log(`✅ Batch complete: ${validStockData.length} stocks`);
        res.json(validStockData);
    } catch (error) {
        console.error('❌ Batch error:', error);
        res.status(500).json({ error: 'Batch fetch failed' });
    }
});

// ==================== POPULAR STOCKS ROUTE ====================
router.get('/popular', async (req, res) => {
    try {
        const popularSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'SBIN', 'BHARTIARTL'];
        console.log(`📊 Fetching popular stocks`);

        const stockData = await Promise.all(
            popularSymbols.map(async (symbol) => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/stocks/quote/${symbol}`);
                    return response.data;
                } catch (error) {
                    console.log(`❌ Popular failed for ${symbol}`);
                    const stockInfo = indianStocks[symbol];
                    const generatedData = generateIndianStockPrice(symbol);

                    return {
                        symbol: symbol,
                        currentPrice: generatedData.price,
                        open: generatedData.price - generatedData.change,
                        high: generatedData.price + 50,
                        low: generatedData.price - 40,
                        volume: Math.floor(Math.random() * 5000000),
                        previousClose: generatedData.price - generatedData.change,
                        change: generatedData.change,
                        changePercent: generatedData.changePercent,
                        companyName: stockInfo.name,
                        exchange: stockInfo.exchange,
                        currency: 'INR'
                    };
                }
            })
        );

        console.log(`✅ Popular stocks fetched: ${stockData.length} stocks`);
        res.json(stockData);
    } catch (error) {
        console.error('❌ Popular stocks error:', error);
        res.status(500).json({ error: 'Popular stocks fetch failed' });
    }
});

// ==================== TRENDING STOCKS ROUTE ====================
router.get('/trending', async (req, res) => {
    try {
        const trendingSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
        console.log(`🔥 Fetching trending stocks`);

        const stockData = trendingSymbols.map(symbol => {
            const stockInfo = indianStocks[symbol];
            const generatedData = generateIndianStockPrice(symbol);

            // Ensure trending stocks have more significant changes
            const trendingChange = generatedData.change * 1.5; // 50% more volatility for trending
            const trendingChangePercent = (trendingChange / generatedData.price) * 100;

            return {
                symbol: symbol,
                currentPrice: generatedData.price + trendingChange,
                open: generatedData.price - trendingChange,
                high: generatedData.price + trendingChange + 30,
                low: generatedData.price + trendingChange - 25,
                volume: Math.floor(Math.random() * 8000000),
                previousClose: generatedData.price,
                change: trendingChange,
                changePercent: Math.round(trendingChangePercent * 100) / 100,
                companyName: stockInfo.name,
                exchange: stockInfo.exchange,
                currency: 'INR',
                isTrending: true
            };
        });

        console.log(`✅ Trending stocks generated: ${stockData.length} stocks`);
        res.json(stockData);
    } catch (error) {
        console.error('❌ Trending stocks error:', error);
        res.status(500).json({ error: 'Trending stocks fetch failed' });
    }
});

module.exports = router;