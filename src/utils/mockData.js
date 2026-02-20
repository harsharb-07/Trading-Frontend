export const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.00, change: 0.0, volume: 1000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.00, change: 0.0, volume: 500000 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 700.00, change: 0.0, volume: 2000000 },
  { symbol: 'AMZN', name: 'Amazon.com', price: 3300.00, change: 0.0, volume: 800000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 290.00, change: 0.0, volume: 1200000 },
];

export const generateInitialData = (symbol, basePrice, periods = 50) => {
  const data = [];
  let price = basePrice;
  const now = new Date();
  for (let i = 0; i < periods; i++) {
    const time = new Date(now.getTime() - (periods - i) * 60000); // 1 minute intervals
    const change = (Math.random() - 0.5) * (basePrice * 0.02); // 2% volatility
    price += change;
    data.push({
      time: time.toISOString(),
      displayTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000,
    });
  }
  return data;
};

export const simulateTick = (lastPrice) => {
  const change = (Math.random() - 0.5) * (lastPrice * 0.005); // 0.5% volatility per tick
  const newPrice = lastPrice + change;
  const now = new Date();
  return {
    time: now.toISOString(),
    displayTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    price: parseFloat(newPrice.toFixed(2)),
    volume: Math.floor(Math.random() * 1000) + 100,
  };
};

export const generateOrderBook = (currentPrice) => {
  const bids = [];
  const asks = [];
  for (let i = 0; i < 10; i++) {
    const bidPrice = currentPrice - (i + 1) * 0.05 - Math.random() * 0.1;
    const askPrice = currentPrice + (i + 1) * 0.05 + Math.random() * 0.1;
    bids.push({ price: parseFloat(bidPrice.toFixed(2)), size: Math.floor(Math.random() * 500) + 10, total: 0 });
    asks.push({ price: parseFloat(askPrice.toFixed(2)), size: Math.floor(Math.random() * 500) + 10, total: 0 });
  }
  // Calculate totals
  bids.reduce((acc, bid) => { bid.total = acc + bid.size; return bid.total; }, 0);
  asks.reduce((acc, ask) => { ask.total = acc + ask.size; return ask.total; }, 0);
  return { bids, asks };
};
