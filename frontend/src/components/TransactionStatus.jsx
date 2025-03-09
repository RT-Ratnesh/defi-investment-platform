import React from 'react';

function TransactionStatus({ status }) {
    if (!status) return null;
    
    let className = "transaction-status ";
    
    if (status.includes("pending") || status.includes("Initiating") || status.includes("Waiting")) {
        className += "transaction-pending";
    } else if (status.includes("successful") || status.includes("Success")) {
        className += "transaction-success";
    } else if (status.includes("Error") || status.includes("Failed")) {
        className += "transaction-error";
    }
    
    return (
        <div className={className}>
            {status}
        </div>
    );
}

export default TransactionStatus; 