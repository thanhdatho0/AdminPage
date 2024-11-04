import React from 'react';

interface TransactionItemProps {
    name: string;
    status: string;
    date: string;
    amount: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ name, status, date, amount }) => {
    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                <p>{name}</p>
            </div>
            <p>{status}</p>
            <p>{date}</p>
            <p>{amount}</p>
        </div>
    );
};

export default TransactionItem;
