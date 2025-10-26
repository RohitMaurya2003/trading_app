import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
        try {
            setError('');
            setLoading(true);
            const result = await register(formData.username, formData.email, formData.password);
            if (result.success) navigate('/dashboard');
            else setError(result.error);
        } catch {
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Neon blobs background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Glass card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 backdrop-blur-3xl bg-black/50 border border-blue-500/40 rounded-2xl shadow-lg p-8 w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-14 h-14 mx-auto bg-gradient-to-r from-blue-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <UserPlus className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                        Create Account
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Join the futuristic trading hub 🚀</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {['username', 'email', 'password', 'confirmPassword'].map((field) => (
                        <div key={field}>
                            <input
                                type={field.includes('password') ? 'password' : 'text'}
                                name={field}
                                required
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            />
                        </div>
                    ))}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0,255,255,0.6)' }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full py-3 mt-2 rounded-xl font-semibold text-lg transition-all duration-300 ${
                            loading
                                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                : 'bg-gradient-to-r from-blue-400 to-pink-400 text-black hover:from-pink-400 hover:to-blue-400 shadow-md'
                        }`}
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </motion.button>

                    <div className="text-center mt-3 text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-pink-400 underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Register;
