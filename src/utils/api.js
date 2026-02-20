const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    // Stocks
    getAllStocks: async () => {
        const response = await fetch(`${API_BASE_URL}/stocks/all`);
        if (!response.ok) throw new Error('Failed to fetch stocks');
        return response.json();
    },

    getQuote: async (symbol) => {
        const response = await fetch(`${API_BASE_URL}/stocks/quote/${symbol}`);
        if (!response.ok) throw new Error('Failed to fetch quote');
        return response.json();
    },

    getStockHistory: async (symbol, timeframe) => {
        const response = await fetch(`${API_BASE_URL}/stocks/history/${symbol}/${timeframe}`);
        if (!response.ok) throw new Error('Failed to fetch stock history');
        return response.json();
    },

    // User
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    getUserByUsername: async (username) => {
        const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
        if (!response.ok) throw new Error('User not found');
        return response.json();
    },

    getAllUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    // Trading
    buy: async (tradeData) => {
        const response = await fetch(`${API_BASE_URL}/trading/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tradeData)
        });
        // Backend returns a generic string, not JSON, for buy/sell
        const text = await response.text();
        if (!response.ok) throw new Error(text || 'Buy failed');
        return text;
    },

    sell: async (tradeData) => {
        const response = await fetch(`${API_BASE_URL}/trading/sell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tradeData)
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || 'Sell failed');
        return text;
    },

    getPortfolio: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/trading/portfolio/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        return response.json();
    },

    getTradeFeed: async () => {
        const response = await fetch(`${API_BASE_URL}/trading/feed`);
        if (!response.ok) throw new Error('Failed to fetch trade feed');
        return response.json();
    }
};
