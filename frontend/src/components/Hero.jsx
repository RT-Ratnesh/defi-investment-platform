import React from 'react';

const Hero = ({ onConnectWallet, walletConnected }) => {
  return (
    <section className="hero-modern">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title animate-fadeIn">Maximize Your ETH Returns</h1>
          <p className="hero-subtitle animate-fadeIn delay-100">
            A secure and transparent platform for ETH investments with competitive returns.
            Start investing today and watch your portfolio grow.
          </p>
          
          {!walletConnected && (
            <button 
              className="hero-cta animate-fadeIn delay-200"
              onClick={onConnectWallet}
            >
              <i className="fas fa-wallet"></i>
              Connect Wallet to Start
            </button>
          )}
          
          {walletConnected && (
            <div className="flex justify-center gap-4 animate-fadeIn delay-200">
              <a href="#invest" className="hero-cta">
                <i className="fas fa-chart-line"></i>
                View Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero; 