import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockTicker = ({ stocks }) => {
    return (
        <div className="ticker-container">
            {stocks.map(stock => {
                const isUp = stock.change >= 0;
                const Icon = isUp ? ArrowUp : ArrowDown;
                const colorClass = isUp ? 'price-up' : 'price-down';

                return (
                    <div key={stock.symbol} className="ticker-item">
                        <span style={{ fontWeight: 'bold' }}>{stock.symbol}</span>
                        <span style={{ fontSize: '0.9rem' }}>{stock.price.toFixed(2)}</span>
                        <span className={colorClass} style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 500
                        }}>
                            <Icon size={12} />
                            {Math.abs(stock.change).toFixed(2)}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StockTicker;
