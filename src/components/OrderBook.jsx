import React from 'react';

const OrderBook = ({ bids, asks, currentPrice }) => {
    const maxTotal = Math.max(
        ...bids.map(b => b.total),
        ...asks.map(a => a.total),
        1 // Prevent division by zero or -Infinity
    );

    const getWidth = (total) => {
        return ((total / maxTotal) * 100).toFixed(1) + '%';
    };

    return (
        <div className="dashboard-card order-book-container">
            <div className="card-header">
                <span className="card-title">Order Book</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Market Depth</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Bid</div>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Ask</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {bids.map((bid, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                        margin: '2px 0',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            width: getWidth(bid.total),
                            height: '100%',
                            background: 'rgba(16, 185, 129, 0.1)',
                            zIndex: 0
                        }} />
                        <span style={{ zIndex: 1, paddingLeft: '8px', color: 'var(--success)' }}>{bid.price.toFixed(2)}</span>
                        <span style={{ zIndex: 1, paddingRight: '8px', color: 'var(--text-secondary)' }}>{bid.size}</span>
                    </div>
                ))}
            </div>

            <div style={{
                textAlign: 'center',
                padding: '8px 0',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                margin: '8px 0'
            }}>
                ${currentPrice.toFixed(2)}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {asks.map((ask, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                        margin: '2px 0',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            width: getWidth(ask.total),
                            height: '100%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            zIndex: 0
                        }} />
                        <span style={{ zIndex: 1, paddingLeft: '8px', color: 'var(--text-secondary)' }}>{ask.size}</span>
                        <span style={{ zIndex: 1, paddingRight: '8px', color: 'var(--danger)' }}>{ask.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderBook;
