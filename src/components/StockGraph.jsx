import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../utils/api';

const StockGraph = ({ symbol }) => {
    const [data, setData] = useState([]);
    const [timeframe, setTimeframe] = useState('1D'); // Default 1 Day
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const history = await api.getStockHistory(symbol, timeframe);
                // Format data for Recharts
                const formattedData = history.map(point => ({
                    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(point.timestamp).toLocaleDateString(), // For tooltip
                    price: point.price
                }));
                setData(formattedData);
            } catch (err) {
                console.error("Failed to load graph data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [symbol, timeframe]);

    const handleTimeframeChange = (tf) => {
        setTimeframe(tf);
    };

    if (loading) return <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading Chart...</div>;

    return (
        <div style={{ marginTop: '16px', background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#374151' }}>{symbol} Performance</h4>
                <div style={{ display: 'flex', gap: '8px', background: '#e5e7eb', padding: '4px', borderRadius: '8px' }}>
                    {['1D', '1W', '1M', '1Y'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => handleTimeframeChange(tf)}
                            style={{
                                border: 'none',
                                background: timeframe === tf ? 'white' : 'transparent',
                                color: timeframe === tf ? '#1877f2' : '#6b7280',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                boxShadow: timeframe === tf ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1877f2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            itemStyle={{ color: '#1877f2', fontWeight: 'bold' }}
                            formatter={(value) => [`₹${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => label} // Just show time for now
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#1877f2"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockGraph;
