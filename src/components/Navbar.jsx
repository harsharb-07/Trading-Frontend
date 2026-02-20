import React, { useState } from 'react';
import { Home, TrendingUp, Users, LogIn, Menu, X, Briefcase } from 'lucide-react';

const Navbar = ({ onLoginClick, onPortfolioClick, onUsersClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);



    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const scrollToMarket = () => {
        const marketSection = document.getElementById('market-overview');
        if (marketSection) {
            marketSection.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false); // Close mobile menu if open
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎓</span>
                    <span className="brand-text">MRU Trading Platform</span>
                </div>
                <div className="brand-subtitle">
                    Malla Reddy University
                </div>
            </div>

            {/* Desktop Center Navigation Links */}
            <div className="nav-links-center">
                <div className="nav-btn">
                    <Home size={18} />
                    Dashboard
                </div>
                <div className="nav-btn" onClick={scrollToMarket} style={{ cursor: 'pointer' }}>
                    <TrendingUp size={18} />
                    Market
                </div>
                {user && (
                    <div className="nav-btn" onClick={onPortfolioClick} style={{ cursor: 'pointer' }}>
                        <Briefcase size={18} />
                        Portfolio
                    </div>
                )}
                <div className="nav-btn" onClick={onUsersClick} style={{ cursor: 'pointer' }}>
                    <Users size={18} />
                    Users
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="navbar-right">

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'white', fontWeight: 500 }}>Hello, {user.fullName || user.username}</span>
                        <button className="btn-login-white" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button className="btn-login-white" onClick={onLoginClick}>
                        Login / Register
                    </button>
                )}

                {/* Mobile Menu Toggle Button */}
                <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>


            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <div className="mobile-nav-item">
                        <Home size={20} />
                        Dashboard
                    </div>
                    <div className="mobile-nav-item" onClick={scrollToMarket}>
                        <TrendingUp size={20} />
                        Market
                    </div>
                    {user && (
                        <div className="mobile-nav-item" onClick={() => {
                            onPortfolioClick();
                            setIsMobileMenuOpen(false);
                        }}>
                            <Briefcase size={20} />
                            Portfolio
                        </div>
                    )}
                    <div className="mobile-nav-item" onClick={() => {
                        onUsersClick();
                        setIsMobileMenuOpen(false);
                    }}>
                        <Users size={20} />
                        Users
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
