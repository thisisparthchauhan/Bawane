// Mock Data for "Live" Market Features
export const MARKET_INDICES = [
    { name: "S&P 500", value: 4927.50, change: 1.25, type: "global" },
    { name: "NASDAQ", value: 15982.35, change: 1.70, type: "global" },
    { name: "DOW JONES", value: 38654.42, change: 0.35, type: "global" },
    { name: "NIFTY 50", value: 21853.80, change: -0.45, type: "indian" },
    { name: "BANK NIFTY", value: 45970.25, change: -0.80, type: "indian" },
    { name: "SENSEX", value: 72085.63, change: -0.50, type: "indian" },
];

export const WATCHLIST_STOCKS = [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2987.50, change: 1.2 },
    { symbol: "TCS", name: "Tata Consultancy Svcs", price: 4125.80, change: -0.5 },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1450.25, change: 0.8 },
    { symbol: "INFY", name: "Infosys Ltd", price: 1680.40, change: 2.1 },
    { symbol: "TATAMOTORS", name: "Tata Motors", price: 925.60, change: 3.5 },
];

export const BREAKING_NEWS = [
    {
        id: "1",
        title: "Fed Signals Potential Rate Cuts Later This Year",
        category: "Global",
        summary: "Federal Reserve Chair Jerome Powell hinted at possible interest rate cuts if inflation data continues to show improvement.",
        timestamp: "2h ago",
    },
    {
        id: "2",
        title: "Tech Sector Rallies as AI Investment Booms",
        category: "Market",
        summary: "Major tech stocks including Nvidia and Microsoft saw significant gains today driven by renewed confidence in AI infrastructure spending.",
        timestamp: "4h ago",
    },
    {
        id: "3",
        title: "RBI Holds Repo Rate Steady at 6.5%",
        category: "India",
        summary: "The Reserve Bank of India kept the key lending rate unchanged for the sixth consecutive time, focusing on inflation control.",
        timestamp: "5h ago",
    },
];
