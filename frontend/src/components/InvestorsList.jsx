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

            const investorList = await contract.getInvestors();
            setInvestors(investorList);
        } catch (error) {
            console.error("Error fetching investors:", error);
            setError("Error fetching investors: " + error.message);
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
                <p>No investors yet or click to load</p>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default InvestorsList; 