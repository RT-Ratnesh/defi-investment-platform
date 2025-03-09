import React, { useState } from 'react';
import getEthereumContract from '../blockchain';

function InvestorsList() {
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchInvestors = async () => {
        setLoading(true);
        setError("");
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                setError("Failed to connect to the contract");
                return;
            }

            try {
                // Add explicit error handling for the getInvestors call
                const investorList = await contract.getInvestors();
                
                // Filter out any invalid addresses (like zero address)
                const validInvestors = investorList.filter(
                    address => address && address !== '0x0000000000000000000000000000000000000000'
                );
                
                setInvestors(validInvestors);
                
                if (validInvestors.length === 0) {
                    setError("No investors found yet.");
                }
            } catch (contractError) {
                console.error("Contract error:", contractError);
                setError("Error retrieving investors from the contract. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching investors:", error);
            setError("Error connecting to blockchain: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                <p>{error || "No investors yet or click to load"}</p>
            )}
        </div>
    );
}

export default InvestorsList; 