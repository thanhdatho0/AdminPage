import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "../Pages/DashboardPage/DashboardPage.tsx";
import UsersPage from "../Pages/UsersPage/UsersPage.tsx";
import ProductsPage from "../Pages/ProductsPage/ProductsPage.tsx";
import TransactionsPage from "../Pages/TransactionsPage/TransactionsPage.tsx";
import LoginPage from "../Pages/LoginPage/LoginPage.tsx";
import RevenuePage from "../Pages/RevenuePage/RevenuePage.tsx";
import ReportsPage from "../Pages/ReportsPage/ReportsPage.tsx";
import TeamPage from "../Pages/TeamPage/TeamPage.tsx";
import SettingsPage from "../Pages/SettingsPage/SettingsPage.tsx";
import HelpPage from "../Pages/HelpPage/HelpPage.tsx";
import AddProductPage from "../Pages/AddProductPage/AddProductPage.tsx";
import OrderPage from "../Pages/OrderPage/OrderPage.tsx";
import ForgotPass from "../Pages/ForgotPassPage/ForgotPass.tsx";
import RegisterPage from "../Pages/RegisterPage/RegisterPage.tsx";

// Giả định lấy isAuthenticated từ một context (ví dụ: UserContext)
import { useContext } from "react";
import { UserContext } from "../Components/UserContext/UserContext.tsx";
import PrivateRoute from "../Components/PrivateRoute/PrivateRoute.tsx";

const Routes = () => {
  const { user } = useContext(UserContext); // Lấy trạng thái xác thực

  const router = createBrowserRouter([
    {
      path: "",
      element: <PrivateRoute isAuthenticated={user?.isAuthenticated} />,
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "users", element: <UsersPage /> },
        { path: "products", element: <ProductsPage /> },
        { path: "transactions", element: <TransactionsPage /> },
        { path: "revenue", element: <RevenuePage /> },
        { path: "reports", element: <ReportsPage /> },
        { path: "teams", element: <TeamPage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "help", element: <HelpPage /> },
        { path: "addProduct", element: <AddProductPage /> },
        { path: "orders", element: <OrderPage /> },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    { path: "/forgot", element: <ForgotPass /> },
    { path: "/register", element: <RegisterPage /> },
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
