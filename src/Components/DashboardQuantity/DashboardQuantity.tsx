import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
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

const DashboardBarChart = () => {
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

        // Add quantity instead of total price
        groupedData[periodKey] += detail.quantity; // Sum up the quantity for each period
      });
    });

    // Convert the grouped data into an array for the chart
    const chartData = Object.keys(groupedData).map((periodKey) => ({
      name: periodKey,
      quantity: groupedData[periodKey], // Total quantity for that period
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
        Product Quantity by {viewType === "monthly" ? "Month" : "Year"}
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
          Yearly Product Quantity
        </button>
      </div>

      <ResponsiveContainer width="100%" height={800}>
        <BarChart data={chartData}>
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
          <Bar dataKey="quantity" fill="#ff7300" name="Quantity Sold" />{" "}
          {/* Show Quantity Sold */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardBarChart;
