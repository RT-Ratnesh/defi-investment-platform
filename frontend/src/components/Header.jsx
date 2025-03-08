import React from 'react';

function Header({ account, setAccount }) {
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    return (
        <header className="app-header">
            <h1>DeFi Investment Platform</h1>
            {account ? (
                <p className="account-info">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            ) : (
                <button className="connect-button" onClick={connectWallet}>
                    Connect Wallet
                </button>
            )}
        </header>
    );
}

export default Header;
