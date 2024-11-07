import React from 'react';
import TransactionItem from '../TransactionItem/TransactionItem';
import transactions from './transactions.json';

const TransactionList: React.FC = () => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white mt-6 mb-6">
            <h4 className="text-lg font-medium mb-4">Latest Transactions</h4>
            <div className="space-y-2">
                {transactions.map((transaction, index) => (
                    <TransactionItem
                        key={index}
                        name={transaction.name}
                        status={transaction.status}
                        date={transaction.date}
                        amount={transaction.amount}
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
