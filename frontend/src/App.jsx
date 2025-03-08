import React, { useState } from "react";
import getEthereumContract from "./blockchain";


function App() {
    const [investors, setInvestors] = useState([]);

    const fetchInvestors = async () => {
        try {
            const contract = await getEthereumContract();
            if (!contract) {
                console.error("Ethereum object not found!");
                return;
            }

            const investorList = await contract.getInvestors(); // Read function
            setInvestors(investorList);
            console.log("Investors:", investorList);
        } catch (error) {
            console.error("Error fetching investors:", error);
        }
    };

    return (
        <div>
            <h1>DeFi Investment Platform</h1>
            <button onClick={fetchInvestors}>Get Investors</button>
            <ul>
                {investors.map((investor, index) => (
                    <li key={index}>{investor}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
