import React, { useState } from 'react';
import getEthereumContract, { parseEther } from '../blockchain';

function YieldFarmingTab({ account, refreshData, portfolio }) {
    const [yieldFarmingAmount, setYieldFarmingAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const depositYieldFarming = async () => {
        if (!yieldFarmingAmount || parseFloat(yieldFarmingAmount) <= 0) {
            setError("Please enter a valid yield farming amount");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            const tx = await contract.depositYieldFarming({
                value: parseEther(yieldFarmingAmount)
            });
            
            await tx.wait();
            console.log("Yield farming deposit successful");
            
            refreshData();
            setYieldFarmingAmount("");
        } catch (error) {
            console.error("Error depositing for yield farming:", error);
            setError("Error depositing for yield farming: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const withdrawYieldFarming = async () => {
        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            const tx = await contract.withdrawYieldFarming();
            await tx.wait();
            console.log("Yield farming withdrawal successful");
            
            refreshData();
        } catch (error) {
            console.error("Error withdrawing yield farming:", error);
            setError("Error withdrawing yield farming: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const claimYield = async () => {
        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            const tx = await contract.claimYield();
            await tx.wait();
            console.log("Yield claimed successfully");
            
            refreshData();
        } catch (error) {
            console.error("Error claiming yield:", error);
            setError("Error claiming yield: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content">
            <div className="yield-farming-form">
                <h2>Yield Farming</h2>
                <p className="feature-description">
                    Participate in yield farming to earn up to 18% APY. Your funds will be utilized in various DeFi protocols to maximize returns.
                </p>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Amount in ETH"
                        value={yieldFarmingAmount}
                        onChange={(e) => setYieldFarmingAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    <button onClick={depositYieldFarming} disabled={loading || !account}>
                        {loading ? "Processing..." : "Deposit"}
                    </button>
                </div>
                <div className="yield-farming-info">
                    <p>Your yield farming balance: <span className="highlight">{portfolio.yieldFarmingBalance} ETH</span></p>
                    <p>Pending yield: <span className="highlight">{portfolio.pendingYieldFarmingRewards} ETH</span></p>
                </div>
                <div className="yield-actions">
                    <button 
                        onClick={claimYield} 
                        disabled={loading || !account || parseFloat(portfolio.pendingYieldFarmingRewards) <= 0}
                        className="claim-button"
                    >
                        {loading ? "Processing..." : "Claim Yield"}
                    </button>
                    <button 
                        onClick={withdrawYieldFarming} 
                        disabled={loading || !account || parseFloat(portfolio.yieldFarmingBalance) <= 0}
                        className="withdraw-button"
                    >
                        {loading ? "Processing..." : "Withdraw All"}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default YieldFarmingTab; 