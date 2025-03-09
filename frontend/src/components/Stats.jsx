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
            
            console.log("Stats updated with market trend:", {
                baseInvestment,
                baseReturns,
                marketPercentage,
                adjustedReturns,
                totalWithReturns
            });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Invested */}
            <div className="card">
                <div className="card-body">
                    <h3 className="text-lg font-medium text-gray mb-2">
                        <i className="fas fa-coins mr-2"></i>
                        Total Invested
                    </h3>
                    <p className="text-3xl font-bold">
                        {formatNumber(stats.totalInvested)} ETH
                    </p>
                    <p className="text-sm text-gray mt-2">
                        Platform-wide investment volume
                    </p>
                </div>
            </div>
            
            {/* Total Returns */}
            <div className="card">
                <div className="card-body">
                    <h3 className="text-lg font-medium text-gray mb-2">
                        <i className="fas fa-chart-line mr-2"></i>
                        Total Returns
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600">
                        {formatNumber(totalReturns)} ETH 
                        <span className={getMarketPercentage() >= 0 ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                            {getMarketPercentage().toFixed(2)}%
                        </span>
                    </p>
                    <p className="text-sm text-gray mt-2">
                        Based on current market conditions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
