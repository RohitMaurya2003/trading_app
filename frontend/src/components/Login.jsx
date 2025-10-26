import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error);
            }
        } catch {
            setError('Failed to log in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Neon blobs */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Glass card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 backdrop-blur-3xl bg-black/50 border border-blue-500/30 rounded-2xl shadow-lg p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <LogIn className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mt-2">Login to continue your journey 🚀</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-blue-500/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-pink-500/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,0,255,0.7)' }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full py-3 mt-4 rounded-xl text-black font-semibold text-lg transition-all duration-300 ${
                            loading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 shadow-lg'
                        }`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>

                    <div className="text-center mt-4">
                        <Link to="/register" className="text-blue-400 hover:text-pink-400 transition-colors">
                            Don’t have an account? <span className="underline">Sign up</span>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Login;
