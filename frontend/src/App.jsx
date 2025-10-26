import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Transactions from './components/Transactions';
import StockDetail from './components/StockDetail'; // Make sure this import exists
import './index.css';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-background text-foreground">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Navbar />
                                        <Dashboard />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/portfolio"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Navbar />
                                        <Portfolio />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/transactions"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Navbar />
                                        <Transactions />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        {/* Stock Detail Route - Make sure this exists */}
                        <Route
                            path="/stock/:symbol"
                            element={
                                <ProtectedRoute>
                                    <StockDetail />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1f2937',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                            success: {
                                style: {
                                    background: '#059669',
                                },
                            },
                            error: {
                                style: {
                                    background: '#dc2626',
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;