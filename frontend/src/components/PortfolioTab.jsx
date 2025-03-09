import React, { useState, useEffect } from 'react';

const PortfolioTab = ({ 
  portfolio, 
  totalInvestedValue, 
  walletConnected, 
  onSuccess, 
  showToast,
  marketTrend: propMarketTrend,
  updateMarketTrend
}) => {
  // Use market trend from props if available, otherwise use local state
  const marketTrend = propMarketTrend || {
    ethPriceChange: 1.2,
    marketSentiment: 'neutral',
    projectedReturn: 8.6,
    timeframe: '180d'
  };
  
  // State to track portfolio values
  const [portfolioValues, setPortfolioValues] = useState({
    investment: '4.4300',
    returns: '0.0506',
    total: '4.4806',
    marketAdjustedReturns: '0.0506',
    potentialReturn: '0.1905'
  });
  
  // Update portfolio values when props change or market trend changes
  useEffect(() => {
    if (!portfolio) return;
    
    // Use the total invested value for the current investment
    const investment = totalInvestedValue || 4.43;
    
    // Base returns calculation (approximately 1% of investment)
    const baseReturns = investment * 0.01;
    
    // Apply market trend to returns
    const marketFactor = 1 + (marketTrend.ethPriceChange / 100);
    const adjustedReturns = baseReturns * marketFactor;
    
    // Calculate total value based on market trend
    // If market trend is positive, add returns to investment
    // If market trend is negative, subtract returns from investment
    let total;
    if (marketTrend.ethPriceChange >= 0) {
      total = investment + adjustedReturns;
    } else {
      total = investment - adjustedReturns;
    }
    
    // Calculate potential returns based on projected return and timeframe
    const potentialReturn = calculatePotentialReturns(investment);
    
    setPortfolioValues({
      investment: investment.toFixed(4),
      returns: baseReturns.toFixed(4),
      marketAdjustedReturns: adjustedReturns.toFixed(4),
      total: total.toFixed(4),
      potentialReturn
    });
    
    console.log("Portfolio updated in PortfolioTab:", {
      investment, 
      baseReturns,
      adjustedReturns,
      marketFactor,
      total,
      potentialReturn,
      marketTrend
    });
  }, [portfolio, marketTrend, totalInvestedValue, propMarketTrend]);
  
  // Calculate potential returns based on investment and market trends
  const calculatePotentialReturns = (investmentAmount) => {
    const baseInvestment = investmentAmount || 4.43;
    
    // Calculate based on projected return percentage
    const annualReturn = baseInvestment * (marketTrend.projectedReturn / 100);
    
    // Adjust based on timeframe (30d = 1/12 of annual, 90d = 1/4, 180d = 1/2)
    let timeframeMultiplier = 1;
    if (marketTrend.timeframe === '30d') timeframeMultiplier = 1/12;
    if (marketTrend.timeframe === '90d') timeframeMultiplier = 1/4;
    if (marketTrend.timeframe === '180d') timeframeMultiplier = 1/2;
    
    return (annualReturn * timeframeMultiplier).toFixed(4);
  };
  
  // Simulate market data update
  const simulateMarketUpdate = () => {
    // Generate random ETH price change between -3% and +5%
    const ethPriceChange = (Math.random() * 8 - 3).toFixed(1);
    const numericPriceChange = parseFloat(ethPriceChange);
    
    // Determine sentiment based on price change
    let sentiment = 'neutral';
    if (numericPriceChange > 2) sentiment = 'positive';
    if (numericPriceChange < -1) sentiment = 'negative';
    
    // Generate projected return based on sentiment and price change
    // Higher price change = higher projected return
    let projectedReturn;
    if (sentiment === 'positive') {
      projectedReturn = (8 + numericPriceChange).toFixed(1);
    } else if (sentiment === 'negative') {
      projectedReturn = (8 + numericPriceChange/2).toFixed(1); // Less impact when negative
    } else {
      projectedReturn = (8 + numericPriceChange/3).toFixed(1); // Even less impact when neutral
    }
    
    // Random timeframe
    const timeframes = ['30d', '90d', '180d'];
    const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
    
    const newMarketTrend = {
      ethPriceChange: numericPriceChange,
      marketSentiment: sentiment,
      projectedReturn: parseFloat(projectedReturn),
      timeframe
    };
    
    console.log("Market trend updated:", newMarketTrend);
    
    // Update market trend in parent component if function is provided
    if (updateMarketTrend) {
      updateMarketTrend(newMarketTrend);
    }
  };
  
  // Helper functions
  const getPercentage = (value) => {
    return value > 0 ? `+${value}%` : `${value}%`;
  };
  
  const getTrendIcon = () => {
    if (marketTrend.ethPriceChange > 0) {
      return <i className="fas fa-arrow-up mr-1 trend-up"></i>;
    } else if (marketTrend.ethPriceChange < 0) {
      return <i className="fas fa-arrow-down mr-1 trend-down"></i>;
    } else {
      return <i className="fas fa-minus mr-1"></i>;
    }
  };
  
  const getSentimentIcon = () => {
    if (marketTrend.marketSentiment === 'positive') {
      return <i className="fas fa-smile mr-1 sentiment-positive"></i>;
    } else if (marketTrend.marketSentiment === 'negative') {
      return <i className="fas fa-frown mr-1 sentiment-negative"></i>;
    } else {
      return <i className="fas fa-meh mr-1 sentiment-neutral"></i>;
    }
  };
  
  // Function to refresh portfolio data
  const refreshPortfolio = () => {
    showToast({
      type: "info",
      title: "Refreshing Portfolio",
      message: "Fetching latest portfolio data...",
      duration: 2000
    });
    onSuccess();
  };
  
  return (
    <div>
      {!walletConnected ? (
        <div className="card">
          <div className="card-body text-center py-6">
            <p className="mb-4 text-gray">Connect your wallet to view your portfolio</p>
          </div>
        </div>
      ) : (
        <>
          {/* Market Analysis */}
          <div className="market-analysis">
            <div className="market-analysis-header">
              <h3>Market Analysis</h3>
              <div className="flex gap-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={refreshPortfolio}
                >
                  <i className="fas fa-sync-alt mr-1"></i>
                  Refresh Portfolio
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={simulateMarketUpdate}
                >
                  <i className="fas fa-chart-line mr-1"></i>
                  Update Market
                </button>
              </div>
            </div>
            
            <div className="market-analysis-grid">
              <div className="market-metric">
                <h4>ETH Price Change</h4>
                <p className={marketTrend.ethPriceChange > 0 ? 'trend-up' : 'trend-down'}>
                  {getTrendIcon()}
                  {getPercentage(marketTrend.ethPriceChange)}
                </p>
              </div>
              
              <div className="market-metric">
                <h4>Market Sentiment</h4>
                <p className={`sentiment-${marketTrend.marketSentiment}`}>
                  {getSentimentIcon()}
                  {marketTrend.marketSentiment.charAt(0).toUpperCase() + marketTrend.marketSentiment.slice(1)}
                </p>
              </div>
              
              <div className="market-metric">
                <h4>Projected Return</h4>
                <p className="text-primary">
                  <i className="fas fa-chart-line mr-1"></i>
                  {marketTrend.projectedReturn}% APY
                </p>
              </div>
              
              <div className="market-metric">
                <h4>Potential {marketTrend.timeframe} Return</h4>
                <p className="text-secondary">
                  <i className="fas fa-coins mr-1"></i>
                  {portfolioValues.potentialReturn} ETH
                </p>
              </div>
            </div>
          </div>
          
          {/* Portfolio Summary */}
          <div className="card mb-6">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Portfolio Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm text-gray mb-1">Current Investment</h4>
                  <p className="text-2xl font-bold">
                    {portfolioValues.investment} ETH
                  </p>
                </div>
                
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm text-gray mb-1">Accrued Returns</h4>
                  <p className="text-2xl font-bold text-secondary">
                    {portfolioValues.marketAdjustedReturns} ETH
                    <span className="text-sm ml-2">
                      {marketTrend.ethPriceChange > 0 ? (
                        <span className="trend-up">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {marketTrend.ethPriceChange}%
                        </span>
                      ) : (
                        <span className="trend-down">
                          <i className="fas fa-arrow-down mr-1"></i>
                          {Math.abs(marketTrend.ethPriceChange)}%
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Total Portfolio Value</h4>
                <div className="p-4 bg-primary bg-opacity-10 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {portfolioValues.total} ETH
                  </p>
                  <p className="text-sm text-gray mt-2">
                    {marketTrend.ethPriceChange >= 0 ? (
                      <span>
                        Investment + Returns: {portfolioValues.investment} + {portfolioValues.marketAdjustedReturns} ETH
                      </span>
                    ) : (
                      <span>
                        Investment - Returns: {portfolioValues.investment} - {portfolioValues.marketAdjustedReturns} ETH
                      </span>
                    )}
                    <span className="ml-2">
                      {marketTrend.ethPriceChange > 0 ? (
                        <span className="trend-up">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {marketTrend.ethPriceChange}%
                        </span>
                      ) : (
                        <span className="trend-down">
                          <i className="fas fa-arrow-down mr-1"></i>
                          {Math.abs(marketTrend.ethPriceChange)}%
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Details */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
              
              <div className="overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray">Investment Date</td>
                      <td className="py-3 text-right">
                        <span className="badge badge-primary">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray">APY Rate</td>
                      <td className="py-3 text-right font-medium">10.00%</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray">Rewards Distribution</td>
                      <td className="py-3 text-right font-medium">Continuous</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray">Market Adjustment</td>
                      <td className="py-3 text-right font-medium">
                        {marketTrend.ethPriceChange > 0 ? (
                          <span className="trend-up">+{marketTrend.ethPriceChange}%</span>
                        ) : (
                          <span className="trend-down">{marketTrend.ethPriceChange}%</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray">Withdrawal Fee</td>
                      <td className="py-3 text-right font-medium">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioTab; 