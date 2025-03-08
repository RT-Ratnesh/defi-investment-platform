import React, { useState } from 'react';
import getEthereumContract, { parseEther } from '../blockchain';

function InvestTab({ account, refreshData }) {
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const invest = async () => {
        if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
            setError("Please enter a valid investment amount");
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

            const tx = await contract.invest({
                value: parseEther(investmentAmount)
            });
            
            await tx.wait();
            console.log("Investment successful");
            
            refreshData();
            setInvestmentAmount("");
        } catch (error) {
            console.error("Error investing:", error);
            setError("Error making investment: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const withdraw = async () => {
        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            const tx = await contract.withdraw();
            await tx.wait();
            console.log("Withdrawal successful");

            refreshData();
        } catch (error) {
            console.error("Error withdrawing:", error);
            setError("Error withdrawing funds: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content">
            <div className="investment-form">
                <h2>Make an Investment</h2>
                <p className="feature-description">
                    Invest your ETH and earn a 10% APY. Your funds will be used in our diversified investment strategies.
                </p>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Amount in ETH"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    <button onClick={invest} disabled={loading || !account}>
                        {loading ? "Processing..." : "Invest"}
                    </button>
                </div>
                <div className="withdrawal-section">
                    <h3>Withdraw Investments</h3>
                    <button onClick={withdraw} disabled={loading || !account}>
                        {loading ? "Processing..." : "Withdraw All Funds"}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default InvestTab; 