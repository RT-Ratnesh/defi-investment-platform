import React from 'react';

function PortfolioTab({ portfolio }) {
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
                <div className="portfolio-summary">
                    <div className="portfolio-total">
                        <h3>Total Portfolio Value</h3>
                        <p className="portfolio-value">{portfolio.totalValue} ETH</p>
                    </div>
                    <div className="portfolio-chart">
                        <div className="placeholder-chart">
                            <div className="chart-segment" style={{height: `${getPercentage(portfolio.basicInvestment)}%`}}>
                                <span>Basic</span>
                            </div>
                            <div className="chart-segment" style={{height: `${getPercentage(portfolio.yieldFarmingBalance)}%`}}>
                                <span>Yield</span>
                            </div>
                            <div className="chart-segment" style={{
                                height: `${getPercentage(
                                    parseFloat(portfolio.pendingRewards) + 
                                    parseFloat(portfolio.pendingYieldFarmingRewards)
                                )}%`
                            }}>
                                <span>Rewards</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portfolio-details">
                    <div className="portfolio-item">
                        <h4>Basic Investment</h4>
                        <p>{portfolio.basicInvestment} ETH</p>
                        <p className="apy-info">10% APY</p>
                    </div>
                    <div className="portfolio-item">
                        <h4>Yield Farming</h4>
                        <p>{portfolio.yieldFarmingBalance} ETH</p>
                        <p className="apy-info">18% APY</p>
                    </div>
                    <div className="portfolio-item">
                        <h4>Pending Rewards</h4>
                        <p>{(
                            parseFloat(portfolio.pendingRewards) + 
                            parseFloat(portfolio.pendingYieldFarmingRewards)
                        ).toFixed(6)} ETH</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PortfolioTab; 