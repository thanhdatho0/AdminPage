import React from "react";

interface TransactionItemProps {
  name: string;
  quantity: number;
  date: string;
  totalAmount: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  quantity,
  date,
  totalAmount,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
        <p>{name}</p>
      </div>
      <p>{quantity} Items</p>
      <p>{date}</p>
      <p>${totalAmount}</p>
    </div>
  );
};

export default TransactionItem;
