import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the shape of the order data (from the API)
interface OrderDetail {
  productName: string;
  productPrice: number;
  priceAfterDiscount: number;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  orderId: number;
  employeeName: string;
  orderExportDateTime: string;
  orderNotice: string;
  orderDetails: OrderDetail[];
  totalAmount: number;
  total: number;
}

const TransactionList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5254/api/Order");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, []);

  // Get the latest 4 transactions
  const latestTransactions = orders.slice(orders.length - 4, orders.length);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white mt-6 mb-6">
      <h4 className="text-2xl font-semibold mb-6 text-center">
        Latest Transactions
      </h4>

      {/* Header for the list with proper grid setup */}
      <div className="grid grid-cols-4 gap-8 text-md font-semibold mb-4 bg-gray-700 py-2 rounded-lg">
        <div className="text-left pl-4">Employee</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Date</div>
        <div className="text-center">Total Price</div>
      </div>

      {/* Data rows */}
      <div className="space-y-4">
        {latestTransactions.map((order) => (
          <div
            key={order.orderId}
            className="grid grid-cols-4 gap-8 text-lg py-4 px-6 bg-gray-900 rounded-lg shadow-md hover:bg-gray-700 transition-all"
          >
            <div className="text-left">{order.employeeName}</div>
            <div className="text-center">
              {order.orderDetails.reduce(
                (acc, detail) => acc + detail.quantity,
                0
              )}
            </div>
            <div className="text-center">
              {new Date(order.orderExportDateTime).toLocaleDateString("en-GB")}
            </div>
            <div className="text-center">{order.total.toFixed(2)}VNĐ</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
