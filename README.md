# 📈 Trading Platform Frontend

A comprehensive trading dashboard built with React + Vite, featuring real-time market data visualization, portfolio management, and stock trading capabilities.

## 🚀 Quick Start

### Option 1: One-Click Run (Recommended)
You can run both the frontend and backend simultaneously using the provided batch script.

1. Navigate to the root folder: 
2. Double-click on **`run-trading-app.bat`**
3. This will launch:
   - **Backend API** on `http://localhost:8080`
   - **Frontend App** on `http://localhost:5173` (or similar)

### Option 2: Manual Setup

If you prefer to run components individually:

1. **Install Dependencies**
   ```bash
   cd "trading frontend"
   npm install
   ```

2. **Start Mock Backend** (Terminal 1)
   ```bash
   npm run server
   ```
   *Runs on port 8080*

3. **Start Frontend** (Terminal 2)
   ```bash
   npm run dev
   ```
   *Runs on port 5173*

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Lucide React (Icons), Recharts (Charts)
- **Backend:** Node.js Mock Server (simulating API endpoints)
- **Styling:** CSS Modules / Vanilla CSS

## 📂 Project Structure

- `src/components/`: Reusable UI components (Charts, Tables, etc.)
- `src/utils/api.js`: API integration layer
- `mock-server.js`: Node.js backend simulator
- `run-trading-app.bat`: Startup script for Windows

## 🔑 Demo Accounts

The mock server comes with a pre-configured demo account:
- **Username:** `demo`
- **Password:** `password`
- **Initial Balance:** ₹1,00,000

## 📝 Features

- **Market Overview:** View top gainers, losers, and active stocks.
- **Stock Charts:** Interactive price history charts.
- **Trading Interface:** Buy and sell stocks with portfolio updates.
- **Portfolio Tracking:** Real-time valuation of holdings.
