import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="header">
            <div className="logo d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>TradeX</span>
            </div>

            <div className="search-bar" style={{
                position: 'relative',
                width: '400px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px'
            }}>
                <Search size={18} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Search stocks, crypto, markets..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.9rem',
                        marginLeft: '8px',
                        width: '100%'
                    }}
                />
            </div>

            <div className="header-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div className="notification" style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={20} color="var(--text-primary)" />
                    <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: 'var(--danger)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%'
                    }} />
                </div>
                <div className="user-profile" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={16} color="#fff" />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>John Doe</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
