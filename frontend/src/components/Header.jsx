import React, { useContext } from 'react';
import { formatAddress } from '../blockchain';
import { ThemeContext } from '../contexts/ThemeContext';

const Header = ({ account, onConnectWallet }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <header className="header">
            <div className="container">
                <div className="flex justify-between items-center">
                    <a href="/" className="logo-animated">
                        <img src="/logo.svg" alt="EtherYield Logo" />
                        <span className="logo-text">EtherYield</span>
                    </a>
                    
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div 
                            className={`theme-toggle ${theme === 'light' ? 'light' : ''}`}
                            onClick={toggleTheme}
                        >
                            <span className="toggle-icon">
                                <i className="fas fa-moon"></i>
                            </span>
                            <span className="toggle-icon">
                                <i className="fas fa-sun"></i>
                            </span>
                            <span className="toggle-circle"></span>
                        </div>
                        
                        {account.connected ? (
                            <div className="flex items-center gap-2">
                                <span className="badge badge-primary">
                                    <i className="fas fa-circle text-xs mr-1"></i>
                                    {formatAddress(account.address)}
                                </span>
                                <a 
                                    href={`https://etherscan.io/address/${account.address}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary text-sm"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        ) : (
                            <button 
                                className="btn btn-primary"
                                onClick={onConnectWallet}
                            >
                                <i className="fas fa-wallet mr-2"></i>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
