import { useContext, useEffect, useState } from "react";
import Header from "../../Components/PageHeader/Header";
import { BASE_URL } from "../../api";
import { UserContext } from "../../Components/UserContext/UserContext";

type OrderDetail = {
  productName: string;
  productPrice: number;
  priceAfterDiscount: number;
  size: string;
  color: string;
  quantity: number;
};

type Order = {
  orderId: number;
  employeeName: string;
  customerId: number;
  orderExportDateTime: string;
  orderNotice: string;
  orderDetails: OrderDetail[];
  totalAmount: number;
  total: number;
  confirmed: boolean;
};

const OrderPage = (props: any) => {
  const { user, logoutContext } = useContext(UserContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleDetails, setVisibleDetails] = useState<Set<number>>(new Set()); // Track visible order details

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Order`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmClick = async (orderId: number) => {
    try {
      // Send a PUT request to update the order's confirmed status
      const response = await fetch(`${BASE_URL}/Order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ confirmed: true }),
      });

      if (response.ok) {
        // If the update is successful, update the order state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, confirmed: true } : order
          )
        );
      } else {
        console.error("Failed to confirm the order");
      }
    } catch (error) {
      console.error("Error confirming the order:", error);
      logoutContext();
    }
  };

  const toggleDetails = (orderId: number) => {
    setVisibleDetails((prevVisibleDetails) => {
      const newVisibleDetails = new Set(prevVisibleDetails);
      if (newVisibleDetails.has(orderId)) {
        newVisibleDetails.delete(orderId); // Hide details if already visible
      } else {
        newVisibleDetails.add(orderId); // Show details
      }
      return newVisibleDetails;
    });
  };

  const confirmedOrders = orders.filter((order) => order.confirmed);
  const unconfirmedOrders = orders.filter((order) => !order.confirmed);

  return (
    <div className="mt-[0.5%] m-auto w-[80%] text-white">
      <Header title={"Order"} />

      <div className="flex justify-between mt-4">
        {/* Unconfirmed Orders */}
        <div className="w-[48%]">
          <h2 className="text-2xl mb-4">Unconfirmed Orders</h2>
          {unconfirmedOrders.map((order) => (
            <div
              key={order.orderId}
              className="relative mb-4 p-4 border border-gray-300 rounded-md"
            >
              {/* Buttons Container */}
              <div className="absolute top-2 right-2 flex space-x-4">
                {!order.confirmed && (
                  <button
                    onClick={() => handleConfirmClick(order.orderId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Confirm Order
                  </button>
                )}

                <button
                  onClick={() => toggleDetails(order.orderId)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {visibleDetails.has(order.orderId)
                    ? "Hide Details"
                    : "Show Details"}
                </button>
              </div>

              {/* Order Details */}
              <div>
                <h2>Order ID: {order.orderId}</h2>
                <p>Employee: {order.employeeName || "Not assigned"}</p>
                <p>Customer ID: {order.customerId}</p>
                <p>
                  Order Date:{" "}
                  {new Date(order.orderExportDateTime).toLocaleString()}
                </p>
                <p>Order Notice: {order.orderNotice}</p>

                {visibleDetails.has(order.orderId) && (
                  <div className="mt-4">
                    <h3>Order Items:</h3>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border">#</th>
                          <th className="px-4 py-2 border">Product</th>
                          <th className="px-4 py-2 border">Price</th>
                          <th className="px-4 py-2 border">
                            Price After Discount
                          </th>
                          <th className="px-4 py-2 border">Size</th>
                          <th className="px-4 py-2 border">Color</th>
                          <th className="px-2 py-1 border text-sm">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                              {detail.productName}
                            </td>
                            <td className="px-4 py-2 border">
                              {detail.productPrice}
                            </td>
                            <td className="px-4 py-2 border">
                              {detail.priceAfterDiscount}
                            </td>
                            <td className="px-4 py-2 border">{detail.size}</td>
                            <td className="px-4 py-2 border">{detail.color}</td>
                            <td className="px-4 py-2 border">
                              {detail.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p>Total Amount: {order.totalAmount}</p>
                <p>Total: {order.total}</p>
                {order.confirmed && (
                  <p className="mt-2 text-green-500">Order Confirmed</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Confirmed Orders */}
        <div className="w-[48%]">
          <h2 className="text-2xl mb-4">Confirmed Orders</h2>
          {confirmedOrders.map((order) => (
            <div
              key={order.orderId}
              className="relative mb-4 p-4 border border-gray-300 rounded-md"
            >
              <div className="absolute top-2 right-2 flex space-x-4">
                <button
                  onClick={() => toggleDetails(order.orderId)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {visibleDetails.has(order.orderId)
                    ? "Hide Details"
                    : "Show Details"}
                </button>
              </div>

              {/* Order Details */}
              <div>
                <h2>Order ID: {order.orderId}</h2>
                <p>Employee: {order.employeeName || "Not assigned"}</p>
                <p>Customer ID: {order.customerId}</p>
                <p>
                  Order Date:{" "}
                  {new Date(order.orderExportDateTime).toLocaleString()}
                </p>
                <p>Order Notice: {order.orderNotice}</p>

                {visibleDetails.has(order.orderId) && (
                  <div className="mt-4">
                    <h3>Order Items:</h3>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border">#</th>
                          <th className="px-4 py-2 border">Product</th>
                          <th className="px-4 py-2 border">Price</th>
                          <th className="px-4 py-2 border">
                            Price After Discount
                          </th>
                          <th className="px-4 py-2 border">Size</th>
                          <th className="px-4 py-2 border">Color</th>
                          <th className="px-2 py-1 border text-sm">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                              {detail.productName}
                            </td>
                            <td className="px-4 py-2 border">
                              {detail.productPrice}
                            </td>
                            <td className="px-4 py-2 border">
                              {detail.priceAfterDiscount}
                            </td>
                            <td className="px-4 py-2 border">{detail.size}</td>
                            <td className="px-4 py-2 border">{detail.color}</td>
                            <td className="px-4 py-2 border">
                              {detail.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p>Total Amount: {order.totalAmount}</p>
                <p>Total: {order.total}</p>
                {order.confirmed && (
                  <p className="mt-2 text-green-500">Order Confirmed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
