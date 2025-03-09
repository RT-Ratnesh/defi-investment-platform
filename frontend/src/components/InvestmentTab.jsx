import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../blockchain';

function InvestmentTab({ walletConnected, onSuccess, showToast }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvest = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const contract = await getContract();
      
      // Convert ETH to Wei
      const amountInWei = ethers.parseEther(amount);
      
      // Call the invest function with the specified amount
      const tx = await contract.invest({ value: amountInWei });
      
      showToast('Investment transaction submitted!', 'info');
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      showToast('Investment successful!', 'success');
      setAmount('');
      
      // Refresh data after successful investment
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error investing:", error);
      showToast('Investment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const contract = await getContract();
      
      // Convert ETH to Wei
      const amountInWei = ethers.parseEther(amount);
      
      // Call the withdraw function with the specified amount
      const tx = await contract.withdraw(amountInWei);
      
      showToast('Withdrawal transaction submitted!', 'info');
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      showToast('Withdrawal successful!', 'success');
      setAmount('');
      
      // Refresh data after successful withdrawal
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error withdrawing:", error);
      showToast('Withdrawal failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>Invest Your ETH</h2>
      
      <div className="investment-info">
        <p>Earn a base APY of 10% on your ETH investments. Market conditions may affect your actual returns.</p>
      </div>
      
      <form className="investment-form" onSubmit={handleInvest}>
        <div className="form-group">
          <label htmlFor="amount">Amount (ETH)</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              disabled={!walletConnected || loading}
            />
            <span className="input-suffix">ETH</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleWithdraw}
            disabled={!walletConnected || loading || !amount}
          >
            {loading ? <span className="loading"></span> : 'Withdraw'}
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!walletConnected || loading || !amount}
          >
            {loading ? <span className="loading"></span> : 'Invest'}
          </button>
        </div>
      </form>
      
      {!walletConnected && (
        <div className="wallet-notice">
          <p>Please connect your wallet to invest or withdraw funds.</p>
        </div>
      )}
    </div>
  );
}

export default InvestmentTab; 