const axios = require('axios');

async function testYahooFinance() {
    try {
        console.log('Testing Yahoo Finance API...');

        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

        for (const symbol of symbols) {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
            );

            const result = response.data.chart.result[0];
            const meta = result.meta;

            console.log(`✅ ${symbol}: $${meta.regularMarketPrice} (Change: ${((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100).toFixed(2)}%)`);

            // Small delay to be respectful
            await new Promise(resolve => setTimeout(resolve, 100));
        }

    } catch (error) {
        console.error('❌ Yahoo Finance test failed:', error.message);
    }
}

testYahooFinance();