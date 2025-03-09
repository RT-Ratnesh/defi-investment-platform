import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import getEthereumContract, { getWalletAddress, formatEther, parseEther } from "./blockchain";
import "./App.css";

// Import components
import Header from "./components/Header";
import Stats from "./components/Stats";
import InvestTab from "./components/InvestTab";
import PortfolioTab from "./components/PortfolioTab";
import InvestorsList from "./components/InvestorsList";

function App() {
    const [account, setAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("invest");
    
    // Portfolio state
    const [portfolio, setPortfolio] = useState({
        basicInvestment: 0,
        pendingRewards: 0,
        totalValue: 0
    });
    
    // Platform stats
    const [stats, setStats] = useState({
        totalInvested: 0
    });

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const address = await getWalletAddress();
                if (address) {
                    setAccount(address);
                    fetchPortfolio(address);
                }
            } catch (error) {
                console.error("Error connecting to wallet:", error);
                setError("Error connecting to wallet. Please try again.");
            }
        };

        connectWallet();
        fetchPlatformStats();
    }, []);

    const fetchPortfolio = async (address) => {
        if (!address) return;
        
        try {
            const contract = await getEthereumContract();
            if (!contract) return;

            // Fetch investments and rewards
            const investments = await contract.investments(address);
            const rewards = await contract.rewards(address);
            
            // Convert to strings first, then to numbers for addition
            const investmentsEth = formatEther(investments);
            const rewardsEth = formatEther(rewards);
            
            // Calculate total value by adding the numeric values
            const totalValue = (
                parseFloat(investmentsEth) + 
                parseFloat(rewardsEth)
            ).toString();
            
            setPortfolio({
                basicInvestment: investmentsEth,
                pendingRewards: rewardsEth,
                totalValue: totalValue
            });
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }
    };

    const fetchPlatformStats = async () => {
        try {
            const contract = await getEthereumContract();
            if (!contract) return;

            const totalInvested = await contract.totalInvested();
            
            setStats({
                totalInvested: formatEther(totalInvested)
            });
        } catch (error) {
            console.error("Error fetching platform stats:", error);
        }
    };

    // Handler for refreshing data after transactions
    const refreshData = () => {
        fetchPlatformStats();
        if (account) {
            fetchPortfolio(account);
        }
    };

    return (
        <div className="app-container">
            <Header 
                account={account} 
                setAccount={setAccount}
            />

            <main className="app-main">
                <Stats stats={stats} portfolioValue={portfolio.totalValue} />

                <div className="tabs-container">
                    <div className="tabs">
                        <button 
                            className={activeTab === 'invest' ? 'active' : ''} 
                            onClick={() => setActiveTab('invest')}
                        >
                            Invest
                        </button>
                        <button 
                            className={activeTab === 'portfolio' ? 'active' : ''} 
                            onClick={() => setActiveTab('portfolio')}
                        >
                            Portfolio
                        </button>
                    </div>
                    
                    {activeTab === 'invest' && (
                        <InvestTab 
                            account={account}
                            refreshData={refreshData}
                            portfolio={portfolio}
                        />
                    )}
                    
                    {activeTab === 'portfolio' && (
                        <PortfolioTab portfolio={portfolio} />
                    )}
                </div>

                <InvestorsList />

                {error && <div className="error-message">{error}</div>}
            </main>
        </div>
    );
}

export default App;
