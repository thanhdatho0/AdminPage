import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BASE_URL } from "../../api";

// Define the shape of the order data
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

const DashboardLineChart = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewType, setViewType] = useState<"monthly" | "yearly">("monthly");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Order`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, []);

  // Process the data to group by Month or Year and sort by date
  const processData = () => {
    const groupedData: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.orderExportDateTime);
      let periodKey: string;

      if (viewType === "monthly") {
        // Format to "Month Year"
        periodKey = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      } else {
        // Format to "Year"
        periodKey = date.getFullYear().toString();
      }

      order.orderDetails.forEach((detail) => {
        if (!groupedData[periodKey]) {
          groupedData[periodKey] = 0;
        }

        groupedData[periodKey] += detail.productPrice * detail.quantity; // Add productPrice * quantity to the total
      });
    });

    // Convert the grouped data into an array for the chart
    const chartData = Object.keys(groupedData).map((periodKey) => ({
      name: periodKey,
      totalPrice: groupedData[periodKey], // Total value for that period
      date: new Date(periodKey).getTime(), // Convert periodKey to Date object for sorting
    }));

    // Sort the data by date in ascending order
    chartData.sort((a, b) => a.date - b.date);

    return chartData;
  };

  const chartData = processData();

  return (
    <div>
      <h1
        className="text-white"
        style={{ fontSize: "3rem", fontWeight: "bold", textAlign: "center" }}
      >
        Product Sales by {viewType === "monthly" ? "Month" : "Year"}
      </h1>

      {/* Buttons to toggle between Monthly and Yearly views */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setViewType("monthly")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#ff7300",
            border: "none",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Monthly Product Sales
        </button>
        <button
          onClick={() => setViewType("yearly")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff7300",
            border: "none",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Yearly Product Sales
        </button>
      </div>

      <ResponsiveContainer width="100%" height={800}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={false} /> {/* Hide X-axis text */}
          <YAxis tick={false} /> {/* Hide Y-axis text */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: 8,
            }}
          />
          <Legend
            wrapperStyle={{
              color: "#fff",
              fill: "#fff",
              fontSize: 14,
              padding: 10,
            }}
          />
          <Line
            type="monotone"
            dataKey="totalPrice"
            stroke="#ff7300"
            name="Total Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardLineChart;
