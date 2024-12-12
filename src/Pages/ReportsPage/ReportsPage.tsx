import { useEffect, useState } from "react";
import Header from "../../Components/PageHeader/Header.tsx";
import ReportComponent from "../../Components/ReportComponent/ReportComponent.tsx";
import { BASE_URL } from "../../api.tsx";

const ReportsPage = () => {
  const [orders, setOrders] = useState<any[]>([]); // Initialize state for orders

  // Fetch orders data from the API when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Order`);
        const data = await response.json();

        // Handle any potential errors (e.g. empty or malformed data)
        if (response.ok && data.length) {
          setOrders(data); // Update the state with fetched orders
        } else {
          console.warn("No orders available or error fetching data.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this effect runs only once, when the component mounts

  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Reports"} />
      {/* Pass the fetched orders data to ReportComponent */}
      <ReportComponent orders={orders} />
    </div>
  );
};

export default ReportsPage;
