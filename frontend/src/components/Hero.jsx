import React from 'react';

const Hero = ({ onConnectWallet, walletConnected }) => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Maximize Your ETH Returns</h1>
        <p className="mb-6">
          EtherYield provides a secure and transparent platform for ETH investments with competitive returns.
        </p>
        
        {!walletConnected && (
          <button 
            className="btn btn-lg bg-white text-primary"
            onClick={onConnectWallet}
          >
            <i className="fas fa-wallet mr-2"></i>
            Connect Wallet to Start
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero; 