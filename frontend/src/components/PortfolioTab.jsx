import React, { useState, useEffect } from 'react';

function PortfolioTab({ portfolio }) {
    const [marketTrend, setMarketTrend] = useState({
        ethPriceChange: 8.5, // Simulated ETH price change percentage (positive)
        marketSentiment: 'bullish', // Market sentiment: bullish, bearish, or neutral
        projectedReturn: 15.2, // Projected annual return percentage
        timeframe: '1 year' // Timeframe for the projection
    });
    
    // Calculate potential returns based on investment and market analysis
    const calculatePotentialReturns = () => {
        const investmentValue = parseFloat(portfolio.basicInvestment) || 0;
        const projectedReturnValue = (investmentValue * marketTrend.projectedReturn) / 100;
        return projectedReturnValue.toFixed(6);
    };
    
    // Get market trend indicator class
    const getTrendClass = () => {
        if (marketTrend.ethPriceChange > 0) return 'trend-up';
        if (marketTrend.ethPriceChange < 0) return 'trend-down';
        return 'trend-neutral';
    };
    
    // Simulate fetching market data
    useEffect(() => {
        // In a real app, you would fetch this data from an API
        const fetchMarketData = () => {
            // Simulated market data - in a real app, this would come from an API
            const randomChange = (Math.random() * 20 - 5).toFixed(1); // Random between -5% and +15%
            const change = parseFloat(randomChange);
            
            let sentiment = 'neutral';
            if (change > 5) sentiment = 'bullish';
            if (change < 0) sentiment = 'bearish';
            
            // Calculate projected return based on current investment APY and market trend
            const baseAPY = 10; // Base APY from the contract
            const marketFactor = 1 + (change / 100);
            const projectedReturn = (baseAPY * marketFactor).toFixed(1);
            
            setMarketTrend({
                ethPriceChange: change,
                marketSentiment: sentiment,
                projectedReturn: projectedReturn,
                timeframe: '1 year'
            });
        };
        
        fetchMarketData();
        
        // Refresh market data every 30 seconds
        const intervalId = setInterval(fetchMarketData, 30000);
        
        return () => clearInterval(intervalId);
    }, []);

    // Prevent division by zero
    const totalValue = parseFloat(portfolio.totalValue) || 1;
    
    // Calculate percentages safely
    const getPercentage = (value) => {
        const floatValue = parseFloat(value) || 0;
        return (floatValue / totalValue) * 100;
    };

    return (
        <div className="tab-content">
            <div className="portfolio-section">
                <h2>Your Portfolio</h2>
                
                <div className="market-analysis">
                    <h3>Market Analysis</h3>
                    <div className="market-stats">
                        <div className="market-stat">
                            <span>ETH Price Trend:</span>
                            <span className={getTrendClass()}>
                                {marketTrend.ethPriceChange > 0 ? '+' : ''}{marketTrend.ethPriceChange}%
                            </span>
                        </div>
                        <div className="market-stat">
                            <span>Market Sentiment:</span>
                            <span className={`sentiment-${marketTrend.marketSentiment}`}>
                                {marketTrend.marketSentiment.charAt(0).toUpperCase() + marketTrend.marketSentiment.slice(1)}
                            </span>
                        </div>
                        <div className="market-stat">
                            <span>Projected APY:</span>
                            <span className="projected-return">{marketTrend.projectedReturn}%</span>
                        </div>
                    </div>
                </div>
                
                <div className="portfolio-summary">
                    <div className="portfolio-total">
                        <h3>Total Portfolio Value</h3>
                        <p className="portfolio-value">{portfolio.totalValue} ETH</p>
                        <p className="potential-returns">
                            Potential Returns: <span className="highlight">{calculatePotentialReturns()} ETH</span>
                            <span className="timeframe">({marketTrend.timeframe})</span>
                        </p>
                    </div>
                    <div className="portfolio-chart">
                        <div className="placeholder-chart">
                            <div className="chart-segment" style={{height: `${getPercentage(portfolio.basicInvestment)}%`}}>
                                <span>Investment</span>
                            </div>
                            <div className="chart-segment returns-segment" style={{
                                height: `${getPercentage(calculatePotentialReturns())}%`
                            }}>
                                <span>Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="portfolio-details">
                    <div className="portfolio-item">
                        <h4>Basic Investment</h4>
                        <p>{portfolio.basicInvestment} ETH</p>
                        <p className="apy-info">10% Base APY</p>
                    </div>
                    <div className="portfolio-item">
                        <h4>Projected Returns</h4>
                        <p>{calculatePotentialReturns()} ETH</p>
                        <p className="apy-info">{marketTrend.projectedReturn}% Projected APY</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PortfolioTab; 