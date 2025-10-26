import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Star,
    Calendar,
    DollarSign,
    PieChart as PieChartIcon,
    Building,
    Users,
    BarChart3,
    Info
} from 'lucide-react';
import TradeModal from './TradeModal';
import toast from 'react-hot-toast';

// Tab Components
const OverviewTab = ({ performanceData }) => (
    <div className="grid md:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Performance</span>
            </h3>
            <div className="space-y-3">
                {Object.entries(performanceData).map(([period, data]) => (
                    <div key={period} className="flex justify-between items-center py-2">
                        <span className="text-gray-400">{period}</span>
                        <span className={`font-semibold ${
                            data.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
              {data.isPositive ? '+' : ''}{data.value}%
            </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span>Key Metrics</span>
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white font-semibold">₹15.2L Cr</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">P/E Ratio</span>
                    <span className="text-white font-semibold">24.3</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Dividend Yield</span>
                    <span className="text-white font-semibold">1.8%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">52W High</span>
                    <span className="text-white font-semibold">₹320.50</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">52W Low</span>
                    <span className="text-white font-semibold">₹210.25</span>
                </div>
            </div>
        </div>
    </div>
);

const FinancialsTab = ({ financialData }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>Financial Performance</span>
        </h3>

        <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹ Cr)" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit (₹ Cr)" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Revenue Growth</div>
                <div className="text-green-400 font-semibold text-xl">+18.5%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Profit Margin</div>
                <div className="text-green-400 font-semibold text-xl">29.2%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm">ROE</div>
                <div className="text-green-400 font-semibold text-xl">15.8%</div>
            </div>
        </div>
    </div>
);

const AboutTab = ({ stockData }) => (
    <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Info className="w-5 h-5 text-yellow-400" />
                <span>Company Description</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
                {stockData.companyName} is a leading Indian company with strong market presence and consistent performance.
                The company has demonstrated robust growth and maintains a competitive edge in its sector through
                strategic investments and innovation.
            </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-400" />
                <span>Company Details</span>
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Industry</span>
                    <span className="text-white font-semibold">Diversified</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sector</span>
                    <span className="text-white font-semibold">Various</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Exchange</span>
                    <span className="text-white font-semibold">{stockData.exchange || 'NSE'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Currency</span>
                    <span className="text-white font-semibold">{stockData.currency || 'INR'}</span>
                </div>
            </div>
        </div>
    </div>
);

const HoldingsTab = ({ shareholdingData }) => (
    <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-green-400" />
                <span>Shareholding Pattern</span>
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={shareholdingData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {shareholdingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Holdings Breakdown</span>
            </h3>
            <div className="space-y-4">
                {shareholdingData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-white font-semibold">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Main StockDetail Component
function StockDetail() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState('1Y');
    const [activeTab, setActiveTab] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('BUY');
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', 'MAX'];

    // Mock historical data for chart
    const historicalData = [
        { date: 'Jan', price: 2400, volume: 4500000 },
        { date: 'Feb', price: 2600, volume: 5200000 },
        { date: 'Mar', price: 2550, volume: 4800000 },
        { date: 'Apr', price: 2700, volume: 5100000 },
        { date: 'May', price: 2650, volume: 4900000 },
        { date: 'Jun', price: 2800, volume: 5500000 },
        { date: 'Jul', price: 2740, volume: 5300000 },
        { date: 'Aug', price: 2900, volume: 5700000 },
        { date: 'Sep', price: 2850, volume: 5600000 },
        { date: 'Oct', price: 3000, volume: 6000000 },
        { date: 'Nov', price: 2950, volume: 5800000 },
        { date: 'Dec', price: 2740, volume: 5400000 },
    ];

    // Mock financial data
    const financialData = [
        { year: '2020', revenue: 4500, profit: 1200, netWorth: 8900 },
        { year: '2021', revenue: 5200, profit: 1500, netWorth: 10400 },
        { year: '2022', revenue: 6100, profit: 1800, netWorth: 12200 },
        { year: '2023', revenue: 7200, profit: 2100, netWorth: 14300 },
    ];

    // Mock shareholding data
    const shareholdingData = [
        { name: 'Promoters', value: 45, color: '#10b981' },
        { name: 'Retail', value: 25, color: '#3b82f6' },
        { name: 'FII', value: 18, color: '#8b5cf6' },
        { name: 'DII', value: 12, color: '#f59e0b' },
    ];

    // Mock performance data
    const performanceData = {
        '1W': { value: 2.5, isPositive: true },
        '1M': { value: 8.2, isPositive: true },
        '3M': { value: 15.7, isPositive: true },
        '6M': { value: 22.3, isPositive: true },
        '1Y': { value: 34.1, isPositive: true },
        'YTD': { value: 28.6, isPositive: true },
    };

    useEffect(() => {
        fetchStockData();
    }, [symbol]);

    const fetchStockData = async () => {
        try {
            setLoading(true);
            console.log('Fetching Indian stock data for:', symbol);
            const response = await axios.get(`http://localhost:5000/api/stocks/quote/${symbol}`);
            console.log('Indian stock data received:', response.data);
            setStockData(response.data);
        } catch (error) {
            console.error('Error fetching Indian stock data:', error);
            // Use mock data if API fails
            setStockData({
                symbol: symbol,
                currentPrice: 2740.34,
                price: 2740.34,
                change: 52.5,
                changePercent: '1.95',
                open: 2695.50,
                high: 2768.80,
                low: 2682.20,
                volume: 2450000,
                companyName: `${symbol} Limited`,
                exchange: 'NSE',
                currency: 'INR'
            });
            toast.error('Using demo data - API connection failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleWatchlist = () => {
        setIsInWatchlist(!isInWatchlist);
        toast.success(!isInWatchlist ? 'Added to watchlist' : 'Removed from watchlist');
    };

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleTradeSuccess = () => {
        setIsModalOpen(false);
        toast.success(`Stock ${modalType.toLowerCase()}ed successfully!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading Indian stock data...</div>
            </div>
        );
    }

    if (!stockData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-lg">Indian stock not found</div>
            </div>
        );
    }

    // FIXED: Use currentPrice instead of price, with proper fallbacks
    const currentPrice = stockData.currentPrice || stockData.price || 0;
    const change = stockData.change || 0;
    const changePercent = stockData.changePercent || 0;
    const isPositive = change >= 0;

    // FIXED: Ensure all price data has proper fallbacks
    const openPrice = stockData.open || 0;
    const highPrice = stockData.high || 0;
    const lowPrice = stockData.low || 0;
    const volume = stockData.volume || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button and Stock Info */}
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </motion.button>

                            <div>
                                <h1 className="text-xl font-bold">{stockData.symbol}</h1>
                                <p className="text-gray-400 text-sm">
                                    {stockData.companyName || `${stockData.symbol} Limited`}
                                </p>
                                <p className="text-gray-500 text-xs">{stockData.exchange} • {stockData.currency}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleWatchlist}
                                className={`p-2 rounded-lg border transition-all ${
                                    isInWatchlist
                                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-yellow-500/30'
                                }`}
                            >
                                <Star className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('BUY')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold"
                            >
                                Buy
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Price and Chart Section */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Price and Stats */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                        >
                            <div className="space-y-4">
                                <div>
                                    <div className="text-4xl font-bold text-white">₹{currentPrice.toFixed(2)}</div>
                                    <div className={`flex items-center space-x-2 text-lg ${
                                        isPositive ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {isPositive ? (
                                            <TrendingUp className="w-5 h-5" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5" />
                                        )}
                                        <span>
                      {isPositive ? '+' : ''}₹{Math.abs(change).toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)
                    </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-gray-400">Open</div>
                                        <div className="text-white font-semibold">₹{openPrice.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-gray-400">Volume</div>
                                        <div className="text-white font-semibold">
                                            {volume ? `${(volume / 1000000).toFixed(1)}M` : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-gray-400">High</div>
                                        <div className="text-white font-semibold">₹{highPrice.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-gray-400">Low</div>
                                        <div className="text-white font-semibold">₹{lowPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                        >
                            {/* Time Range Selector */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Price Chart (₹)</h3>
                                <div className="flex space-x-2">
                                    {timeRanges.map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setSelectedRange(range)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                                selectedRange === range
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#9CA3AF"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px',
                                                color: 'white'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-white/5 rounded-xl p-1 mb-6">
                    {['overview', 'financials', 'about', 'holdings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <OverviewTab performanceData={performanceData} />}
                        {activeTab === 'financials' && <FinancialsTab financialData={financialData} />}
                        {activeTab === 'about' && <AboutTab stockData={stockData} />}
                        {activeTab === 'holdings' && <HoldingsTab shareholdingData={shareholdingData} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticky Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-4 py-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openModal('BUY')}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold text-lg"
                        >
                            Buy
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openModal('SELL')}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-semibold text-lg"
                        >
                            Sell
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Trade Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <TradeModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        stock={stockData}
                        type={modalType}
                        onSuccess={handleTradeSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default StockDetail;