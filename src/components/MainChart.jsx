import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const MainChart = ({ data, symbol }) => {
    const chartData = useMemo(() => data, [data]);

    const lastPrice = useMemo(() => {
        if (data.length === 0) return 0;
        return data[data.length - 1].price;
    }, [data]);

    const color = lastPrice >= (data[0]?.price || 0) ? '#10b981' : '#ef4444';

    return (
        <div className="dashboard-card chart-container" style={{ height: '400px' }}>
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{symbol}</span>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: color
                    }}>
                        ${lastPrice.toFixed(2)}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-timeframe active" style={{
                        background: 'var(--bg-tertiary)',
                        border: 'none',
                        color: 'var(--accent-primary)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>1H</button>
                    <button className="btn-timeframe" style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}>1D</button>
                    <button className="btn-timeframe" style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}>1W</button>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                            dataKey="displayTime"
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            axisLine={{ stroke: 'var(--border-color)' }}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                            labelStyle={{ color: 'var(--text-secondary)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                        />
                        <ReferenceLine y={lastPrice} stroke={color} strokeDasharray="3 3" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MainChart;
