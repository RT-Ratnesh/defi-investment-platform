import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <div>
            <h3>EtherYield</h3>
            <p className="my-4">
              A decentralized ETH investment platform built on Ethereum blockchain.
              Secure, transparent, and efficient.
            </p>
          </div>
          
          <div>
            <h3>Resources</h3>
            <ul>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#whitepaper">Whitepaper</a></li>
              <li><a href="#github">GitHub</a></li>
              <li><a href="#audit">Audit Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h3>Company</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3>Legal</h3>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#discord" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="#telegram" aria-label="Telegram">
              <i className="fab fa-telegram-plane"></i>
            </a>
            <a href="#github" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="#medium" aria-label="Medium">
              <i className="fab fa-medium-m"></i>
            </a>
          </div>
          
          <p>© {new Date().getFullYear()} EtherYield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 