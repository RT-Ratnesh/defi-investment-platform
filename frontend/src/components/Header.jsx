import React from 'react';
import { formatAddress } from '../blockchain';

const Header = ({ account, onConnectWallet }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="flex justify-between items-center">
                    <a href="/" className="logo">
                        <img src="/logo.svg" alt="EtherYield Logo" />
                        <span>EtherYield</span>
                    </a>
                    
                    <div>
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
