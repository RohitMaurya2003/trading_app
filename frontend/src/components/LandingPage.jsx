import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    TrendingUp,
    Shield,
    Zap,
    BarChart3,
    Smartphone,
    ArrowRight,
    Play,
    Star,
    CheckCircle2
} from 'lucide-react';

function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 100], [1, 0]);
    const scale = useTransform(scrollY, [0, 100], [1, 0.8]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: TrendingUp,
            title: 'Real-time Market Data',
            description: 'Live stock prices and charts updated every second'
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Professional tools and indicators for smart trading'
        },
        {
            icon: Shield,
            title: 'Secure & Safe',
            description: 'Paper trading with zero financial risk'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Instant order execution and real-time updates'
        },
        {
            icon: Smartphone,
            title: 'Mobile Ready',
            description: 'Trade anywhere with our responsive design'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Active Traders' },
        { value: '$2.5M+', label: 'Virtual Portfolio Value' },
        { value: '99.9%', label: 'Uptime' },
        { value: '50+', label: 'Supported Stocks' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-gray-900" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                TradeHub
              </span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                How It Works
                            </a>
                            <a href="#testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                Testimonials
                            </a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-2 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-yellow-500/25"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent"></div>

                    {/* Animated Grid */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, -5, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-xl"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2"
                                >
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 text-sm font-medium">Trusted by 10,000+ traders</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-5xl lg:text-6xl font-bold leading-tight"
                                >
                                    Trade Smarter,{' '}
                                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Not Harder
                  </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xl text-gray-300 leading-relaxed"
                                >
                                    Join TradeHub and master the markets with commission-free paper trading.
                                    Practice with virtual cash and build your confidence before investing real money.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link
                                    to="/register"
                                    className="group bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center justify-center space-x-2"
                                >
                                    <span>Start Trading Free</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button className="group border border-gray-600 text-gray-300 px-8 py-4 rounded-xl hover:border-yellow-500 hover:text-yellow-400 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-2">
                                    <Play className="w-5 h-5" />
                                    <span>Watch Demo</span>
                                </button>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Animated Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 p-6 shadow-2xl">
                                {/* Mock Trading Interface */}
                                <div className="space-y-6">
                                    {/* Chart Header */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-2xl font-bold text-white">AAPL</div>
                                            <div className="text-green-400 flex items-center space-x-1">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>$182.52 (+2.5%)</span>
                                            </div>
                                        </div>
                                        <div className="text-gray-400">Apple Inc.</div>
                                    </div>

                                    {/* Mock Chart */}
                                    <div className="h-48 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg relative overflow-hidden">
                                        {/* Animated Chart Line */}
                                        <motion.div
                                            className="absolute inset-0"
                                            initial={{ clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)' }}
                                            animate={{
                                                clipPath: 'polygon(0% 100%, 0% 80%, 20% 75%, 40% 50%, 60% 70%, 80% 40%, 100% 60%, 100% 100%)'
                                            }}
                                            transition={{ duration: 2, delay: 1 }}
                                        >
                                            <svg viewBox="0 0 400 200" className="w-full h-full">
                                                <path
                                                    d="M0,160 L100,150 L200,100 L300,130 L400,120"
                                                    stroke="url(#chartGradient)"
                                                    strokeWidth="3"
                                                    fill="none"
                                                />
                                                <defs>
                                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#f59e0b" />
                                                        <stop offset="100%" stopColor="#84cc16" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </motion.div>
                                    </div>

                                    {/* Trading Actions */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-green-500/20 text-green-400 border border-green-500/30 py-3 rounded-lg font-semibold hover:bg-green-500/30 transition-colors"
                                        >
                                            Buy
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                                        >
                                            Sell
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-4 -right-4 bg-yellow-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30"
                            >
                                <TrendingUp className="w-6 h-6 text-yellow-400" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Succeed
              </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Powerful tools and features designed to help you learn, practice, and master stock trading
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 hover:border-yellow-500/30 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                Start Trading in{' '}
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Minutes
                </span>
                            </h2>

                            <div className="space-y-6">
                                {[
                                    'Create your free account in seconds',
                                    'Get $10,000 in virtual cash to start',
                                    'Explore real-time market data',
                                    'Practice buying and selling stocks',
                                    'Track your portfolio performance'
                                ].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <span className="text-gray-300 text-lg">{step}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="mt-8"
                            >
                                <Link
                                    to="/register"
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold text-lg"
                                >
                                    <span>Start Free Today</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-8 border border-gray-600 shadow-2xl">
                                {/* Mock Portfolio */}
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">Virtual Portfolio</div>
                                        <div className="text-4xl font-bold text-yellow-400 mt-2">$12,456.78</div>
                                        <div className="text-green-400 text-sm mt-1">+$2,456.78 (24.5%)</div>
                                    </div>

                                    {/* Portfolio Items */}
                                    <div className="space-y-3">
                                        {[
                                            { symbol: 'AAPL', name: 'Apple Inc.', value: '$2,456', change: '+5.2%' },
                                            { symbol: 'TSLA', name: 'Tesla Inc.', value: '$1,890', change: '+12.4%' },
                                            { symbol: 'MSFT', name: 'Microsoft', value: '$3,210', change: '+3.8%' },
                                            { symbol: 'GOOGL', name: 'Alphabet', value: '$2,100', change: '+7.1%' }
                                        ].map((stock, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                                className="flex justify-between items-center p-3 bg-gray-600/30 rounded-lg"
                                            >
                                                <div>
                                                    <div className="font-semibold text-white">{stock.symbol}</div>
                                                    <div className="text-gray-400 text-sm">{stock.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-white">{stock.value}</div>
                                                    <div className="text-green-400 text-sm">{stock.change}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold">
                            Ready to Start Your{' '}
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Trading Journey?
              </span>
                        </h2>

                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Join thousands of traders who are already mastering the markets with TradeHub.
                            No risk, no commitment - just pure learning and growth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="group bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center justify-center space-x-2"
                            >
                                <span>Create Free Account</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/dashboard"
                                className="group border border-gray-600 text-gray-300 px-8 py-4 rounded-xl hover:border-yellow-500 hover:text-yellow-400 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-2"
                            >
                                <span>View Live Demo</span>
                                <Play className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="text-gray-400 text-sm">
                            No credit card required • Free forever • Real-time data
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-gray-900" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                TradeHub
              </span>
                        </div>

                        <div className="flex space-x-6 text-gray-400">
                            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-yellow-400 transition-colors">How It Works</a>
                            <Link to="/login" className="hover:text-yellow-400 transition-colors">Login</Link>
                        </div>

                        <div className="text-gray-400 text-sm mt-4 md:mt-0">
                            © 2024 TradeHub. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;