import http from 'http';
import url from 'url';

const PORT = 8080;

// Mock Data
const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 2450.00, changePercentage: 1.5, type: 'EQUITY' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', currentPrice: 3500.00, changePercentage: -0.8, type: 'EQUITY' },
    { symbol: 'INFY', name: 'Infosys', currentPrice: 1600.00, changePercentage: 0.5, type: 'EQUITY' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', currentPrice: 1650.00, changePercentage: 1.2, type: 'EQUITY' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', currentPrice: 950.00, changePercentage: -0.3, type: 'EQUITY' }
];

const users = new Map();
// Add a demo user
users.set('demo', { id: 1, username: 'demo', password: 'password', balance: 100000 });

const portfolios = new Map();
// Demo portfolio
portfolios.set(1, {
    userId: 1,
    holdings: [
        { symbol: 'RELIANCE', quantity: 10, averagePrice: 2400.00 },
        { symbol: 'TCS', quantity: 5, averagePrice: 3450.00 }
    ],
    balance: 100000
});

const trades = [];

// Helper: Parse JSON body
function parseJSON(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            callback(body ? JSON.parse(body) : {});
        } catch (e) {
            callback({});
        }
    });
}

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS Preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    console.log(`${method} ${pathname}`);

    // --- STOCKS ENDPOINTS ---

    if (pathname === '/api/stocks/all' && method === 'GET') {
        return sendJSON(res, 200, stocks);
    }

    if (pathname.startsWith('/api/stocks/quote/') && method === 'GET') {
        const symbol = pathname.split('/').pop();
        const stock = stocks.find(s => s.symbol === symbol);
        if (stock) return sendJSON(res, 200, stock);
        return sendJSON(res, 404, { message: 'Stock not found' });
    }

    if (pathname.startsWith('/api/stocks/history/') && method === 'GET') {
        const parts = pathname.split('/');
        const symbol = parts[4];
        const timeframe = parts[5];
        // Generate mock history
        const history = [];
        let price = 1000;
        for (let i = 0; i < 30; i++) {
            price = price * (1 + (Math.random() * 0.1 - 0.05));
            history.push({ date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0], price });
        }
        return sendJSON(res, 200, history);
    }

    // --- USER ENDPOINTS ---

    if (pathname === '/api/users/register' && method === 'POST') {
        parseJSON(req, (body) => {
            if (!body.username || !body.password) return sendJSON(res, 400, { message: 'Missing fields' });
            if (users.has(body.username)) return sendJSON(res, 400, { message: 'User already exists' });

            const newUser = { id: Date.now(), ...body, balance: 100000 };
            users.set(body.username, newUser);
            portfolios.set(newUser.id, { userId: newUser.id, holdings: [], balance: 100000 }); // Initialize portfolio

            return sendJSON(res, 201, newUser);
        });
        return;
    }

    if (pathname.startsWith('/api/users/username/') && method === 'GET') {
        const username = pathname.split('/').pop();
        const user = users.get(username);
        if (user) return sendJSON(res, 200, user);
        return sendJSON(res, 404, { message: 'User not found' });
    }

    if (pathname === '/api/users' && method === 'GET') {
        return sendJSON(res, 200, Array.from(users.values()));
    }

    // --- TRADING ENDPOINTS ---

    if (pathname === '/api/trading/portfolio/' && method === 'GET') { // Incorrect path handling in original api.js?
        // Wait, api.js uses /api/trading/portfolio/${userId}
        // So path is likely /api/trading/portfolio/1
        // My check above with startsWith might be better
    }

    if (pathname.startsWith('/api/trading/portfolio/') && method === 'GET') {
        const userId = parseInt(pathname.split('/').pop());
        const portfolio = portfolios.get(userId);
        if (portfolio) return sendJSON(res, 200, portfolio);
        return sendJSON(res, 404, { message: 'Portfolio not found' });
    }

    if (pathname === '/api/trading/buy' && method === 'POST') {
        parseJSON(req, (body) => {
            const { userId, symbol, quantity } = body;
            const portfolio = portfolios.get(userId);
            const stock = stocks.find(s => s.symbol === symbol);

            if (!portfolio || !stock) return sendJSON(res, 400, { message: 'Invalid request' });

            const cost = stock.currentPrice * quantity;
            if (portfolio.balance < cost) return sendJSON(res, 400, { message: 'Insufficient funds' });

            portfolio.balance -= cost;
            const existingHolding = portfolio.holdings.find(h => h.symbol === symbol);
            if (existingHolding) {
                existingHolding.quantity += quantity;
            } else {
                portfolio.holdings.push({ symbol, quantity, averagePrice: stock.currentPrice });
            }

            trades.push({ type: 'BUY', symbol, quantity, price: stock.currentPrice, timestamp: new Date() });
            res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
            res.end('Buy successful');
        });
        return;
    }

    if (pathname === '/api/trading/sell' && method === 'POST') {
        parseJSON(req, (body) => {
            const { userId, symbol, quantity } = body;
            const portfolio = portfolios.get(userId);
            const stock = stocks.find(s => s.symbol === symbol);

            if (!portfolio || !stock) return sendJSON(res, 400, { message: 'Invalid request' });

            const existingHolding = portfolio.holdings.find(h => h.symbol === symbol);
            if (!existingHolding || existingHolding.quantity < quantity) {
                return sendJSON(res, 400, { message: 'Insufficient holdings' });
            }

            const revenue = stock.currentPrice * quantity;
            portfolio.balance += revenue;
            existingHolding.quantity -= quantity;
            if (existingHolding.quantity === 0) {
                portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
            }

            trades.push({ type: 'SELL', symbol, quantity, price: stock.currentPrice, timestamp: new Date() });
            res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
            res.end('Sell successful');
        });
        return;
    }

    if (pathname === '/api/trading/feed' && method === 'GET') {
        return sendJSON(res, 200, trades.slice(-20).reverse());
    }

    sendJSON(res, 404, { message: 'Not Found' });
});

server.listen(PORT, () => {
    console.log(`Mock Backend running at http://localhost:${PORT}/api`);
});
