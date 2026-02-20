import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Flame, X, Plus, Minus } from 'lucide-react';
import { api } from '../utils/api';

const MarketOverview = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('');
    const [quantity, setQuantity] = useState(1);

    const openTradeModal = (stock) => {
        setSelectedStock(stock);
        setQuantity(1);
        setTransactionStatus('');
    };

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const data = await api.getAllStocks();
            setStocks(data);
            setError(null);
        } catch (err) {
            setError('Failed to load market data. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleRefresh = () => {
        fetchStocks();
    };

    const handleTrade = async (type) => {
        if (!selectedStock) return;

        // Get user ID from local storage or prompt (simplified for demo)
        // In a real app, this would come from Auth Context
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : 1; // Default to ID 1 if not logged in (for demo convenience)

        if (!userId) {
            alert('Please login to trade.');
            return;
        }

        if (quantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        const tradeData = {
            userId: userId,
            symbol: selectedStock.symbol,
            quantity: parseInt(quantity)
        };

        try {
            setTransactionStatus(`Processing ${type}...`);
            let result;
            if (type === 'BUY') {
                result = await api.buy(tradeData);
            } else {
                result = await api.sell(tradeData);
            }
            alert(result);
            setTransactionStatus('');
            setSelectedStock(null); // Close modal
            fetchStocks(); // Refresh data
        } catch (err) {
            alert(`Trade failed: ${err.message}`);
            setTransactionStatus('');
        }
    };

    // Filter stocks for display categories (Logic can be improved based on real data attributes)
    // For now, sorting by changePercentage for Gainers/Losers
    const sortedByChange = [...stocks].sort((a, b) => b.changePercentage - a.changePercentage);
    const gainers = sortedByChange.slice(0, 5);
    const losers = [...stocks].sort((a, b) => a.changePercentage - b.changePercentage).slice(0, 5);
    // Just taking random 5 for active for now
    const active = stocks.slice(0, 5);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Market Data...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto 3rem' }}>
            {/* Main Card Container */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h2 style={{ color: '#1877f2', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Market Overview - NSE India</h2>
                    <button className="refresh-btn" onClick={handleRefresh} style={{
                        background: '#1877f2',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}>
                        <RefreshCw size={16} /> Refresh Live Data
                    </button>
                </div>

                <div className="market-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Top Gainers Column */}
                    <div>
                        <div style={{
                            background: '#d1fae5',
                            color: '#065f46',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>📈</span> Top Gainers
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {gainers.map((stock, i) => (
                                <div key={i} onClick={() => openTradeModal(stock)} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #f3f4f6',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                    <div>
                                        <div style={{ color: '#1877f2', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{stock.symbol}</div>
                                        <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>₹{stock.currentPrice.toFixed(2)}</div>
                                    </div>
                                    <div style={{
                                        background: stock.changePercentage >= 0 ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                                        color: stock.changePercentage >= 0 ? 'var(--success-green)' : 'var(--danger-red)',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {stock.changePercentage >= 0 ? '+' : ''}{stock.changePercentage.toFixed(2)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Losers Column */}
                    <div>
                        <div style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>📉</span> Top Losers
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {losers.map((stock, i) => (
                                <div key={i} onClick={() => openTradeModal(stock)} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #f3f4f6',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                    <div>
                                        <div style={{ color: '#1877f2', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{stock.symbol}</div>
                                        <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>₹{stock.currentPrice.toFixed(2)}</div>
                                    </div>
                                    <div style={{
                                        background: stock.changePercentage >= 0 ? '#d1fae5' : '#fee2e2',
                                        color: stock.changePercentage >= 0 ? '#059669' : '#dc2626',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {stock.changePercentage.toFixed(2)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Active Column */}
                    <div>
                        <div style={{
                            background: '#ffedd5',
                            color: '#9a3412',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>🔥</span> Most Active
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {active.map((stock, i) => (
                                <div key={i} onClick={() => openTradeModal(stock)} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #f3f4f6',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                    <div>
                                        <div style={{ color: '#1877f2', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{stock.symbol}</div>
                                        <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>₹{stock.currentPrice.toFixed(2)}</div>
                                    </div>
                                    {/* Percentage Badge - Same as Top Gainers/Losers */}
                                    <div style={{
                                        background: stock.changePercentage >= 0 ? '#d1fae5' : '#fee2e2',
                                        color: stock.changePercentage >= 0 ? '#059669' : '#dc2626',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {stock.changePercentage >= 0 ? '+' : ''}{stock.changePercentage.toFixed(2)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy/Sell Modal */}
            {selectedStock && (
                <div className="modal-overlay" onClick={() => setSelectedStock(null)} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                        background: 'white',
                        width: '90%',
                        maxWidth: '400px',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1877f2' }}>{selectedStock.symbol}</h2>
                            <button onClick={() => setSelectedStock(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={24} color="#666" />
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937' }}>
                                ₹{selectedStock.currentPrice.toFixed(2)}
                            </div>
                            {selectedStock.changePercentage && (
                                <div style={{
                                    color: selectedStock.changePercentage >= 0 ? '#059669' : '#dc2626',
                                    fontWeight: '600',
                                    fontSize: '1.25rem',
                                    marginTop: '4px'
                                }}>
                                    {selectedStock.changePercentage >= 0 ? '+' : ''}{selectedStock.changePercentage.toFixed(2)}%
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontWeight: '500' }}>Quantity</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        background: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Minus size={20} color="#4b5563" />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{
                                        width: '100px',
                                        padding: '10px',
                                        fontSize: '1.2rem',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        textAlign: 'center'
                                    }}
                                />
                                <button
                                    onClick={() => setQuantity(parseInt(quantity) + 1)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        background: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={20} color="#4b5563" />
                                </button>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
                                Total: ₹{(selectedStock.currentPrice * (parseInt(quantity) || 0)).toFixed(2)}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <button
                                onClick={() => handleTrade('BUY')}
                                style={{
                                    background: '#10b981', // Emerald green
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'transform 0.1s',
                                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                BUY
                            </button>
                            <button
                                onClick={() => handleTrade('SELL')}
                                style={{
                                    background: '#ef4444', // Red
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'transform 0.1s',
                                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                SELL
                            </button>
                        </div>

                        {transactionStatus && (
                            <div style={{ marginTop: '15px', textAlign: 'center', color: '#4b5563', fontStyle: 'italic' }}>
                                {transactionStatus}
                            </div>
                        )}

                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
                            Tap outside to close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketOverview;
