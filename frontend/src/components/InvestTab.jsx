import React, { useState } from 'react';
import getEthereumContract, { parseEther, investWithGasEstimate } from '../blockchain';

const InvestTab = ({ walletConnected, onSuccess, showToast }) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  
  // Handle investment
  const invest = async () => {
    if (!walletConnected) {
      showToast({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to invest'
      });
      return;
    }
    
    // Validate investment amount
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setTxStatus('Preparing transaction...');
      
      // Get contract - no destructuring needed
      const contract = await getEthereumContract();
      
      if (!contract) {
        throw new Error('Failed to connect to the contract. Please check your wallet connection.');
      }
      
      // Parse ETH amount - ensure it's a string
      const amount = parseEther(investmentAmount.toString());
      
      // Invest with gas estimation
      setTxStatus('Confirming transaction...');
      const tx = await investWithGasEstimate(contract, investmentAmount.toString());
      
      // Wait for transaction confirmation
      setTxStatus('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      // Reset form and show success
      setInvestmentAmount('');
      setLoading(false);
      setTxStatus('Transaction confirmed!');
      
      // Call success callback
      onSuccess();
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Investment Successful',
        message: `Successfully invested ${investmentAmount} ETH`
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setTxStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Investment error:', error);
      setLoading(false);
      setError(error.message || 'Failed to invest. Please try again.');
      setTxStatus(null);
      
      // Show error toast
      showToast({
        type: 'error',
        title: 'Investment Failed',
        message: error.message || 'Failed to invest. Please try again.'
      });
    }
  };
  
  // Handle withdrawal
  const withdraw = async () => {
    if (!walletConnected) {
      showToast({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to withdraw'
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setTxStatus('Preparing withdrawal...');
      
      // Get contract - no destructuring needed
      const contract = await getEthereumContract();
      
      if (!contract) {
        throw new Error('Failed to connect to the contract. Please check your wallet connection.');
      }
      
      // Withdraw
      setTxStatus('Confirming withdrawal...');
      const tx = await contract.withdraw();
      
      // Wait for transaction confirmation
      setTxStatus('Withdrawal submitted. Waiting for confirmation...');
      await tx.wait();
      
      // Reset and show success
      setLoading(false);
      setTxStatus('Withdrawal confirmed!');
      
      // Call success callback
      onSuccess();
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Withdrawal Successful',
        message: 'Successfully withdrew your investment and rewards'
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setTxStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Withdrawal error:', error);
      setLoading(false);
      setError(error.message || 'Failed to withdraw. Please try again.');
      setTxStatus(null);
      
      // Show error toast
      showToast({
        type: 'error',
        title: 'Withdrawal Failed',
        message: error.message || 'Failed to withdraw. Please try again.'
      });
    }
  };
  
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-xl font-semibold mb-4">Invest ETH</h2>
        
        {!walletConnected ? (
          <div className="text-center py-6">
            <p className="mb-4 text-gray">Connect your wallet to start investing</p>
          </div>
        ) : (
          <>
            <div className="input-group">
              <label htmlFor="investmentAmount" className="input-label">
                Investment Amount (ETH)
              </label>
              <div className="flex">
                <input
                  id="investmentAmount"
                  type="number"
                  className={`input ${error ? 'input-error' : ''}`}
                  placeholder="0.1"
                  value={investmentAmount}
                  onChange={(e) => {
                    setInvestmentAmount(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  min="0.01"
                  step="0.01"
                />
                <button
                  className="btn btn-secondary ml-2"
                  onClick={() => setInvestmentAmount('0.1')}
                  disabled={loading}
                >
                  0.1
                </button>
                <button
                  className="btn btn-secondary ml-2"
                  onClick={() => setInvestmentAmount('0.5')}
                  disabled={loading}
                >
                  0.5
                </button>
                <button
                  className="btn btn-secondary ml-2"
                  onClick={() => setInvestmentAmount('1')}
                  disabled={loading}
                >
                  1.0
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                className="btn btn-primary w-full"
                onClick={invest}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-sm mr-2"></span>
                ) : (
                  <i className="fas fa-arrow-circle-up mr-2"></i>
                )}
                Invest Now
              </button>
              
              <button
                className="btn btn-outline-primary w-full"
                onClick={withdraw}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-sm mr-2"></span>
                ) : (
                  <i className="fas fa-arrow-circle-down mr-2"></i>
                )}
                Withdraw All
              </button>
            </div>
            
            {txStatus && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">
                <p className="text-sm">
                  <i className="fas fa-info-circle mr-2 text-primary"></i>
                  {txStatus}
                </p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Investment Benefits</h3>
              <ul className="text-sm text-gray">
                <li className="flex items-center mb-2">
                  <i className="fas fa-check-circle text-secondary mr-2"></i>
                  10% Annual Percentage Yield (APY)
                </li>
                <li className="flex items-center mb-2">
                  <i className="fas fa-check-circle text-secondary mr-2"></i>
                  Withdraw anytime with no penalties
                </li>
                <li className="flex items-center mb-2">
                  <i className="fas fa-check-circle text-secondary mr-2"></i>
                  Transparent and secure smart contract
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-secondary mr-2"></i>
                  No hidden fees or commissions
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvestTab; 