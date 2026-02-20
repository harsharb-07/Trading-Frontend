import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FeaturesGrid from './components/FeaturesGrid';
import MarketOverview from './components/MarketOverview';
import AuthModal from './components/AuthModal';
import PortfolioModal from './components/PortfolioModal';
import UserManagementModal from './components/UserManagementModal';
import './index.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const togglePortfolioModal = () => {
    setIsPortfolioModalOpen(!isPortfolioModalOpen);
  };

  const toggleUsersModal = () => {
    setIsUsersModalOpen(!isUsersModalOpen);
  };

  return (
    <div className="app-container">
      <Navbar onLoginClick={toggleAuthModal} onPortfolioClick={togglePortfolioModal} onUsersClick={toggleUsersModal} />

      <main className="hero-section">
        {/* Welcome Section */}
        {/* Welcome Card */}
        <div className="welcome-card" style={{ marginBottom: '3rem' }}>
          <h1 className="welcome-title">Welcome to MRU Trading Platform 🎓</h1>

          <div style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500 }}>
            Full-Stack Trading Application Demo for Malla Reddy University Students
          </div>

          {!localStorage.getItem('user') && (
            <div style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px' }}>
              Please <span className="login-link" onClick={toggleAuthModal}>login or register</span> to start trading
            </div>
          )}
        </div>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Market Overview */}
        <div id="market-overview">
          <MarketOverview />
        </div>



      </main>

      <footer style={{
        marginTop: 'auto',
        background: '#f8f9fa',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid #e9ecef',
        color: '#6c757d'
      }}>
        &copy; {new Date().getFullYear()} MRU Trading Platform. All rights reserved.
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <PortfolioModal isOpen={isPortfolioModalOpen} onClose={() => setIsPortfolioModalOpen(false)} />
      <UserManagementModal isOpen={isUsersModalOpen} onClose={() => setIsUsersModalOpen(false)} />
    </div>
  );
}

export default App;
