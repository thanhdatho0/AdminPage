import React from "react";
import { FaUsers } from "react-icons/fa";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeDescription: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeDescription,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white flex items-center space-x-4">
      <FaUsers className="text-3xl text-gray-400" />
      <div>
        <h4 className="text-lg font-medium">{title}</h4>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-green-500">
          {change} <span className="text-gray-400">{changeDescription}</span>
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
