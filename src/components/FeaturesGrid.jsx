import React from 'react'; // Assuming React is used for JSX

const FeaturesGrid = () => {
    const features = [
        {
            icon: '📊',
            title: 'Real-Time Market Data',
            description: 'Access live NSE India stock quotes and market trends'
        },
        {
            icon: '✅',
            title: 'Buy & Sell Stocks',
            description: 'Execute trades with real-time price validation'
        },
        {
            icon: '💼',
            title: 'Portfolio Management',
            description: 'Track your investments with P/L calculations'
        },
        {
            icon: '📈',
            title: 'Interactive Charts',
            description: 'Visualize stock prices and portfolio distribution'
        }
    ];

    return (
        <div className="features-grid">
            {features.map((feature, index) => (
                <div key={index} className="feature-card">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {feature.icon}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{feature.title}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>{feature.description}</div>
                </div>
            ))}
        </div>
    );
};

export default FeaturesGrid;
