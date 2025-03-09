import React, { useState, useEffect } from 'react';

function Stats({ stats, portfolioValue }) {
    const [totalReturns, setTotalReturns] = useState(portfolioValue);
    
    // Calculate total returns (investment + projected returns)
    useEffect(() => {
        const calculateTotalReturns = () => {
            // Base investment value
            const investmentValue = parseFloat(portfolioValue) || 0;
            
            // Calculate projected returns (using a simple 10% APY with market fluctuation)
            const marketFactor = 0.95 + (Math.random() * 0.3); // Random between 0.95 and 1.25
            const projectedReturn = investmentValue * 0.1 * marketFactor; // 10% APY adjusted by market
            
            // Total returns = investment + projected returns
            const total = (investmentValue + projectedReturn).toFixed(4);
            setTotalReturns(total);
        };
        
        calculateTotalReturns();
        
        // Update every 5 seconds to simulate market changes
        const intervalId = setInterval(calculateTotalReturns, 5000);
        
        return () => clearInterval(intervalId);
    }, [portfolioValue]);

    return (
        <div className="stats-container">
            <div className="stat-box">
                <h3>Total Invested</h3>
                <p>{stats.totalInvested} ETH</p>
            </div>
            <div className="stat-box">
                <h3>Total Returns</h3>
                <p>{totalReturns} ETH</p>
            </div>
        </div>
    );
}

export default Stats;
