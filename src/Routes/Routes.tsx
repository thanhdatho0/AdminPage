import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: "dashboard", element: <DashboardPage/>, children: []},
            {path: "users", element: <UsersPage/>, children: []},
            {path: "products", element: <ProductsPage/>, children: []},
            {path: "transactions", element: <TransactionsPage/>, children: []},
            {path: "revenue", element: <RevenuePage/>, children: []},
            {path: "reports", element: <ReportsPage/>, children: []},
            {path: "teams", element: <TeamPage/>, children: []},
            {path: "settings", element: <SettingsPage/>, children: []},
            {path: "help", element: <HelpPage/>, children: []},
        ]
    },
    {
        path: "/login",
        element: <LoginPage/>,
    }
]);