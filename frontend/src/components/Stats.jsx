import React from 'react';

function Stats({ stats, portfolioValue }) {
    return (
        <div className="stats-container">
            <div className="stat-box">
                <h3>Total Invested</h3>
                <p>{stats.totalInvested} ETH</p>
            </div>
            <div className="stat-box">
                <h3>Total in Yield Farming</h3>
                <p>{stats.totalYieldFarming} ETH</p>
            </div>
            <div className="stat-box">
                <h3>Your Portfolio</h3>
                <p>{portfolioValue} ETH</p>
            </div>
        </div>
    );
}

export default Stats;
