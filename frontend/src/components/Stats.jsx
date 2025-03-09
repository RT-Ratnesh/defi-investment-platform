import React, { useState, useEffect } from 'react';

const Stats = ({ stats, portfolio, portfolioValue, totalInvestedValue, marketTrend }) => {
    const [totalReturns, setTotalReturns] = useState(totalInvestedValue || 0);
    
    // Update total returns when market trend or total invested value changes
    useEffect(() => {
        if (totalInvestedValue > 0) {
            // Get market percentage from props
            const marketPercentage = marketTrend?.ethPriceChange || 1.2;
            
            // Calculate base investment
            const baseInvestment = totalInvestedValue;
            
            // Calculate base returns (approximately 1% of investment)
            const baseReturns = baseInvestment * 0.01;
            
            // Apply market trend to returns
            const marketFactor = 1 + (marketPercentage / 100);
            const adjustedReturns = baseReturns * marketFactor;
            
            // Calculate total value based on market trend
            let totalWithReturns;
            if (marketPercentage >= 0) {
                totalWithReturns = baseInvestment + adjustedReturns;
            } else {
                totalWithReturns = baseInvestment - adjustedReturns;
            }
            
            setTotalReturns(totalWithReturns);
        }
    }, [totalInvestedValue, marketTrend]);
    
    // Format number with commas
    const formatNumber = (num) => {
        if (num === 0 || isNaN(num)) return "0.0000";
        return parseFloat(num).toFixed(4);
    };
    
    // Get market percentage for display
    const getMarketPercentage = () => {
        return marketTrend?.ethPriceChange || 1.2;
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Total Invested */}
            <div className="stat-card-minimal">
                <div className="stat-title">
                    <i className="fas fa-coins"></i>
                    Total Invested
                </div>
                <div className="stat-value">
                    {formatNumber(stats.totalInvested)} ETH
                </div>
                <div className="stat-desc">
                    Platform-wide investment volume
                </div>
            </div>
            
            {/* Total Returns */}
            <div className="stat-card-minimal">
                <div className="stat-title">
                    <i className="fas fa-chart-line"></i>
                    Total Returns
                </div>
                <div className="stat-value">
                    {formatNumber(totalReturns)} ETH 
                </div>
                <div className="stat-desc">
                    <span className={getMarketPercentage() >= 0 ? "trend-up" : "trend-down"}>
                        {getMarketPercentage() > 0 ? "+" : ""}{getMarketPercentage().toFixed(2)}%
                    </span> based on current market conditions
                </div>
            </div>
        </div>
    );
};

export default Stats;
