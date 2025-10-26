import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, TrendingUp, RefreshCw, Star } from 'lucide-react';
import StockCard from './StockCard';
import TradeModal from './TradeModal';
import toast from 'react-hot-toast';

function Dashboard() {
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Popular Indian stocks to show on dashboard
    const trendingStocks = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR',
        'ICICIBANK', 'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'ITC',
        'LT', 'HCLTECH', 'AXISBANK', 'MARUTI', 'ASIANPAINT',
        'SUNPHARMA', 'TITAN', 'ULTRACEMCO', 'WIPRO', 'NESTLEIND'
    ];

    // Load trending stocks on component mount
    useEffect(() => {
        fetchTrendingStocks();
    }, []);

    // Fetch trending stocks using batch endpoint
    const fetchTrendingStocks = async () => {
        try {
            setLoading(true);
            setError('');

            // Use batch endpoint for better performance
            const symbols = trendingStocks.join(',');
            const response = await axios.get(`http://localhost:5000/api/stocks/batch?symbols=${symbols}`);

            const validStocks = response.data.filter(Boolean);

            // Remove duplicates and ensure we have valid data
            const uniqueStocks = validStocks.filter((stock, index, self) =>
                index === self.findIndex(s => s.symbol === stock.symbol)
            );

            console.log('Fetched stocks:', uniqueStocks);
            setStocks(uniqueStocks);

            if (uniqueStocks.length === 0) {
                setError('Unable to fetch trending stocks data');
            }
        } catch (error) {
            console.error('Error fetching trending stocks:', error);
            setError('Failed to load stock data');

            // Fallback: try individual requests
            try {
                const stockPromises = trendingStocks.map(symbol =>
                    axios.get(`http://localhost:5000/api/stocks/quote/${symbol}`)
                        .then(res => res.data)
                        .catch(() => null)
                );

                const stockData = await Promise.all(stockPromises);
                const validStocks = stockData.filter(Boolean);
                const uniqueStocks = validStocks.filter((stock, index, self) =>
                    index === self.findIndex(s => s.symbol === stock.symbol)
                );

                setStocks(uniqueStocks);

                if (uniqueStocks.length > 0) {
                    setError('');
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Manual refresh with timestamp to prevent caching
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            toast.success('Refreshing stock prices...');

            // Add timestamp to prevent caching
            const timestamp = Date.now();
            const symbols = trendingStocks.join(',');

            const response = await axios.get(`http://localhost:5000/api/stocks/batch?symbols=${symbols}&t=${timestamp}`);

            const validStocks = response.data.filter(Boolean);
            const uniqueStocks = validStocks.filter((stock, index, self) =>
                index === self.findIndex(s => s.symbol === stock.symbol)
            );

            setStocks(uniqueStocks);

            // Check if we have actual changes
            const hasChanges = uniqueStocks.some(stock =>
                Math.abs(stock.change) > 0.01 || Math.abs(stock.changePercent) > 0.01
            );

            if (hasChanges) {
                toast.success('Stock prices updated!');
            } else {
                toast('Prices are current', { icon: 'ℹ️' });
            }

        } catch (error) {
            console.error('Refresh error:', error);
            toast.error('Failed to refresh prices');
        } finally {
            setRefreshing(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.length > 1) {
            try {
                setShowSearchResults(true);
                const response = await axios.get(
                    `http://localhost:5000/api/stocks/search/${query}`
                );
                setSearchResults(response.data || []);
            } catch (error) {
                console.error('Error searching stocks:', error);
                setSearchResults([]);
            }
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    };

    // View stock details when clicked from search results
    const viewStockDetails = async (stockSymbol) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/stocks/quote/${stockSymbol}`
            );

            if (response.data) {
                const stockData = response.data;

                // Add to stocks array to display
                setStocks(prev => {
                    const filtered = prev.filter(s => s.symbol !== stockSymbol);
                    return [stockData, ...filtered];
                });

                setSearchResults([]);
                setSearchQuery('');
                setShowSearchResults(false);
                toast.success(`Showing ${stockSymbol} details`);
            }
        } catch (error) {
            toast.error(`Failed to fetch ${stockSymbol} data`);
        }
    };

    const openTradeModal = (stock, type) => {
        if (!stock) return;
        setSelectedStock(stock);
        setTradeType(type);
        setIsTradeModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Indian Stock Market
                            </h1>
                            <p className="text-gray-400">
                                Real-time trending Indian stocks and prices
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search Indian stocks (e.g., RELIANCE, TCS, INFY)..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Search Results */}
                        <AnimatePresence>
                            {showSearchResults && searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-10 w-full mt-2 bg-gray-800 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                                >
                                    {searchResults
                                        .filter((stock, index, self) =>
                                            index === self.findIndex(s => s.symbol === stock.symbol)
                                        )
                                        .map((stock) => (
                                            <div
                                                key={`search-${stock.symbol}-${stock.exchange}`}
                                                className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors group"
                                                onClick={() => viewStockDetails(stock.symbol)}
                                            >
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white">{stock.symbol}</div>
                                                    <div className="text-sm text-gray-400">{stock.name}</div>
                                                    <div className="text-xs text-gray-500">{stock.exchange}</div>
                                                </div>
                                                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Trending Info */}
                    {stocks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 flex items-center space-x-2 text-sm text-gray-400"
                        >
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Showing {stocks.length} trending stocks</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stock Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <StockCard key={index} isLoading={true} />
                        ))}
                    </div>
                ) : (
                    <>
                        {stocks.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                <AnimatePresence>
                                    {stocks
                                        .filter((stock, index, self) =>
                                            index === self.findIndex(s => s.symbol === stock.symbol)
                                        )
                                        .map((stock, index) => (
                                            <motion.div
                                                key={`${stock.symbol}-${stock.currentPrice}-${index}-${Date.now()}`}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <StockCard
                                                    stock={stock}
                                                    onBuy={() => openTradeModal(stock, 'BUY')}
                                                    onSell={() => openTradeModal(stock, 'SELL')}
                                                />
                                            </motion.div>
                                        ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No stocks available
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Check your connection and try refreshing
                                </p>
                                <button
                                    onClick={handleRefresh}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Trade Modal */}
            {selectedStock && (
                <TradeModal
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    stock={selectedStock}
                    type={tradeType}
                    onSuccess={() => {
                        setIsTradeModalOpen(false);
                        fetchTrendingStocks();
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;