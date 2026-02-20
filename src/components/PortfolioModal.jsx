import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { RefreshCw, X, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import StockGraph from './StockGraph';

const PortfolioModal = ({ isOpen, onClose }) => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sellAmount, setSellAmount] = useState({});
    const [expandedStock, setExpandedStock] = useState(null);

    // Fetch portfolio when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPortfolio();
        }
    }, [isOpen]);

    const fetchPortfolio = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch both portfolio and latest stock prices
            const [portfolioData, stocksData] = await Promise.all([
                api.getPortfolio(user.id),
                api.getAllStocks()
            ]);

            // The mock server returns the portfolio object { holdings: [...] }
            // We need to map holdings to include current price from global stock data
            const holdings = portfolioData.holdings || [];

            const enrichedPortfolio = holdings.map(item => {
                const stock = stocksData.find(s => s.symbol === item.symbol);
                const currentPrice = stock ? stock.currentPrice : item.averagePrice;
                return {
                    ...item,
                    currentPrice: currentPrice,
                    totalValue: currentPrice * item.quantity,
                    change: stock ? stock.changePercentage : 0
                };
            });

            setPortfolio(enrichedPortfolio);
            setError(null);
        } catch (err) {
            setError('Failed to load portfolio.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSell = async (symbol, currentQuantity) => {
        const quantityToSell = parseInt(sellAmount[symbol] || 0);

        if (quantityToSell <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        if (quantityToSell > currentQuantity) {
            alert(`You only have ${currentQuantity} shares.`);
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const tradeData = {
            userId: user.id,
            symbol: symbol,
            quantity: quantityToSell
        };

        try {
            const result = await api.sell(tradeData);
            alert(result);
            fetchPortfolio(); // Refresh portfolio
            setSellAmount(prev => ({ ...prev, [symbol]: '' })); // Clear input
        } catch (err) {
            alert(`Sell failed: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    // Calculate total portfolio value
    const totalValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);

    return (
        <div className="modal-overlay" onClick={onClose} style={{
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
                maxWidth: '800px', // Wider implementation for table
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <button className="modal-close" onClick={onClose} style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    <X size={24} color="#666" />
                </button>

                <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40px' }}>
                    <div>
                        <h2 style={{ color: '#1877f2', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Your Portfolio</h2>
                        <div style={{ color: '#6b7280', marginTop: '4px' }}>Total Value:
                            <span style={{ color: '#10b981', fontWeight: 'bold', marginLeft: '8px' }}>₹{totalValue.toFixed(2)}</span>
                        </div>
                    </div>
                    <button className="refresh-btn" onClick={fetchPortfolio} style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                ) : portfolio.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <Wallet size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>You don't own any stocks yet. Go to Market to buy some!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', color: '#6b7280' }}>Symbol</th>
                                    <th style={{ padding: '12px', color: '#6b7280' }}>Quantity</th>
                                    <th style={{ padding: '12px', color: '#6b7280' }}>Current Price</th>
                                    <th style={{ padding: '12px', color: '#6b7280' }}>Total Value</th>
                                    <th style={{ padding: '12px', color: '#6b7280', textAlign: 'center' }}>Graph</th>
                                    <th style={{ padding: '12px', color: '#6b7280', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#1f2937' }}>{item.symbol}</td>
                                            <td style={{ padding: '16px 12px' }}>{item.quantity}</td>
                                            <td style={{ padding: '16px 12px' }}>₹{item.currentPrice.toFixed(2)}</td>
                                            <td style={{ padding: '16px 12px', fontWeight: '500' }}>₹{item.totalValue.toFixed(2)}</td>
                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setExpandedStock(expandedStock === item.symbol ? null : item.symbol)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1877f2', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}
                                                >
                                                    {expandedStock === item.symbol ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.quantity}
                                                        placeholder="Qty"
                                                        value={sellAmount[item.symbol] || ''}
                                                        onChange={(e) => setSellAmount({ ...sellAmount, [item.symbol]: e.target.value })}
                                                        style={{
                                                            width: '70px',
                                                            padding: '8px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d1d5db'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleSell(item.symbol, item.quantity)}
                                                        style={{
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        Sell
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedStock === item.symbol && (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '0 24px 24px 24px', background: '#fff' }}>
                                                    <StockGraph symbol={item.symbol} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioModal;
