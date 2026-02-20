import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Login to access your portfolio' : 'Join MRU Trading Platform today'}</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-form" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());

                    try {
                        if (isLogin) {
                            // Simple login via username check for demo
                            const user = await api.getUserByUsername(data.email.split('@')[0]); // Assuming username is part of email for this demo, or ask for username
                            // In a real app, use a proper login endpoint with password check
                            localStorage.setItem('user', JSON.stringify(user));
                            alert(`Welcome back, ${user.username}!`);
                            onClose();
                            window.location.reload(); // Reload to update UI state
                        } else {
                            // Register
                            const registerData = {
                                username: data.email.split('@')[0], // Generate username from email
                                email: data.email,
                                password: data.password,
                                fullName: data.name,
                                phoneNumber: "1234567890" // Placeholder or add field
                            };
                            const newUser = await api.register(registerData);
                            localStorage.setItem('user', JSON.stringify(newUser));
                            alert('Registration successful!');
                            onClose();
                            window.location.reload();
                        }
                    } catch (err) {
                        alert(`Authentication failed: ${err.message}`);
                    }
                }}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input type="text" name="name" placeholder="John Doe" required />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input type="email" name="email" placeholder="student@mru.edu.in" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input type="password" name="password" placeholder="••••••••" required />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input type="password" name="confirmPassword" placeholder="••••••••" required />
                            </div>
                        </div>
                    )}

                    {isLogin && (
                        <div className="form-footer">
                            <label className="checkbox-label">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>
                    )}

                    <button type="submit" className="btn-submit">
                        {isLogin ? 'Login' : 'Register'} <ArrowRight size={18} />
                    </button>
                </form>


                <div className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
