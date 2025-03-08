import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import getEthereumContract from "./blockchain";
import "./App.css";

function App() {
    const [investors, setInvestors] = useState([]);
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [account, setAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [totalInvested, setTotalInvested] = useState(0);

    useEffect(() => {
        const connectWallet = async () => {
            try {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                } else {
                    setError("Please install MetaMask to use this dApp");
                }
            } catch (error) {
                console.error("Error connecting to wallet:", error);
                setError("Error connecting to wallet. Please try again.");
            }
        };

        connectWallet();
        fetchTotalInvested();
    }, []);

    const fetchInvestors = async () => {
        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            const investorList = await contract.getInvestors();
            setInvestors(investorList);
            console.log("Investors:", investorList);
        } catch (error) {
            console.error("Error fetching investors:", error);
            setError("Error fetching investors: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalInvested = async () => {
        try {
            const contract = await getEthereumContract();
            if (!contract) return;

            const total = await contract.totalInvested();
            setTotalInvested(ethers.formatEther(total));
        } catch (error) {
            console.error("Error fetching total invested:", error);
        }
    };

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
                value: ethers.parseEther(investmentAmount)
            });
            
            await tx.wait();
            console.log("Investment successful:", tx.hash);
            
            fetchTotalInvested();
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
            console.log("Withdrawal successful:", tx.hash);

            fetchTotalInvested();
        } catch (error) {
            console.error("Error withdrawing:", error);
            setError("Error withdrawing funds: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>DeFi Investment Platform</h1>
                {account ? (
                    <p className="account-info">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
                ) : (
                    <button className="connect-button" onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
                        Connect Wallet
                    </button>
                )}
            </header>

            <main className="app-main">
                <div className="stats-container">
                    <div className="stat-box">
                        <h3>Total Invested</h3>
                        <p>{totalInvested} ETH</p>
                    </div>
                </div>

                <div className="action-container">
                    <div className="investment-form">
                        <h2>Make an Investment</h2>
                        <div className="input-group">
                            <input
                                type="number"
                                placeholder="Amount in ETH"
                                value={investmentAmount}
                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                            <button onClick={invest} disabled={loading}>
                                {loading ? "Processing..." : "Invest"}
                            </button>
                        </div>
                    </div>

                    <div className="withdrawal-section">
                        <h2>Withdraw Funds</h2>
                        <button onClick={withdraw} disabled={loading}>
                            {loading ? "Processing..." : "Withdraw All Funds"}
                        </button>
                    </div>
                </div>

                <div className="investors-section">
                    <h2>Investors List</h2>
                    <button onClick={fetchInvestors} disabled={loading}>
                        {loading ? "Loading..." : "Refresh Investors"}
                    </button>
                    
                    {investors.length > 0 ? (
                        <ul className="investors-list">
                            {investors.map((investor, index) => (
                                <li key={index} className="investor-item">
                                    {investor}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No investors yet or click to load</p>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}
            </main>
        </div>
    );
}

export default App;
