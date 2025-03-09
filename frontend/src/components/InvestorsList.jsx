import React, { useState, useEffect } from 'react';
import getEthereumContract from '../blockchain';

const InvestorsList = () => {
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch investors on component mount
    useEffect(() => {
        fetchInvestors();
    }, []);

    // Fetch investors from contract
    const fetchInvestors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get contract - no destructuring needed
            const contract = await getEthereumContract();
            
            if (!contract) {
                throw new Error('Failed to connect to the contract. Please check your wallet connection.');
            }
            
            // Get investors array
            const investorsArray = await contract.getInvestors();
            
            // Filter out zero addresses
            const validInvestors = investorsArray.filter(
                address => address !== '0x0000000000000000000000000000000000000000'
            );
            
            setInvestors(validInvestors);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching investors:', error);
            setError('Failed to fetch investors list');
            setLoading(false);
        }
    };

    // Truncate address for display
    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="card">
            <div className="card-header flex justify-between items-center">
                <h3>Investors</h3>
                <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={fetchInvestors}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loading loading-sm mr-1"></span>
                    ) : (
                        <i className="fas fa-sync-alt mr-1"></i>
                    )}
                    Refresh
                </button>
            </div>
            
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="loading"></div>
                        <p className="mt-2 text-gray">Loading investors...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-danger">
                        <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                        <p>{error}</p>
                    </div>
                ) : investors.length === 0 ? (
                    <div className="text-center py-4 text-gray">
                        <i className="fas fa-users text-2xl mb-2"></i>
                        <p>No investors found</p>
                    </div>
                ) : (
                    <ul className="investor-list">
                        {investors.map((investor, index) => (
                            <li key={index} className="investor-item">
                                <div className="investor-address">
                                    {truncateAddress(investor)}
                                </div>
                                <a 
                                    href={`https://etherscan.io/address/${investor}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="investor-link"
                                >
                                    View <i className="fas fa-external-link-alt"></i>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InvestorsList; 