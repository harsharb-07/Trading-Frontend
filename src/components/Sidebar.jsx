import React from 'react';
import { Home, TrendingUp, PieChart, Newspaper, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="nav-item active">
                <Home size={20} />
                <span>Dashboard</span>
            </div>
            <div className="nav-item">
                <TrendingUp size={20} />
                <span>Markets</span>
            </div>
            <div className="nav-item">
                <PieChart size={20} />
                <span>Portfolio</span>
            </div>
            <div className="nav-item">
                <Newspaper size={20} />
                <span>News</span>
            </div>
            <div className="nav-item" style={{ marginTop: 'auto' }}>
                <Settings size={20} />
                <span>Settings</span>
            </div>
            <div className="nav-item text-danger" style={{ color: 'var(--danger)' }}>
                <LogOut size={20} />
                <span>Logout</span>
            </div>
        </aside>
    );
};

export default Sidebar;
