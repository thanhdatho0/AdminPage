import { useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineTransaction,
  AiOutlineMenu,
  AiFillAppstore,
} from "react-icons/ai";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { BiDollarCircle, BiBarChartSquare, BiGroup } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "./Logo.jpg";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setIsActivated] = useState<string | undefined>();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: string) => {
    setIsActivated(item);
  };

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        type={"button"}
        title={"menu-mobile-toggle-btn"}
        className="text-white p-2 md:hidden"
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={24} color="white" />
      </button>

      {/* Sidebar */}
      <div
        className={`!sticky top-0 left-0 w-64 h-[100vh] bg-gray-900 text-white p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block transition-transform duration-300 ease-in-out custom-scrollbar overflow-y-auto`}
      >
        {/* Close Button for Mobile */}
        <button
          className="text-white p-2 mb-4 md:hidden"
          onClick={toggleSidebar}
        >
          ✕
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full mb-2">
            <img src={logo} alt="" className={"rounded-full"} />
          </div>
          <h2 className="text-lg font-semibold">Hồ Thành Đạt</h2>
          <p className="text-sm text-gray-400">Administrator</p>
        </div>

        {/* Sidebar Links */}
        <div className="space-y-4">
          {/* Pages */}
          <div>
            <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2">
              Pages
            </h3>
            <ul className="space-y-2">
              <Link to={"/dashboard"} className={"focus:bg-gray-700"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "dashboard"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("dashboard")}
                >
                  <AiOutlineDashboard className="mr-2" /> Dashboard
                </li>
              </Link>
              <Link to={"/users"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "users" ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("users")}
                >
                  <AiOutlineUser className="mr-2" /> Users
                </li>
              </Link>
              <Link to={"/products"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "products"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("products")}
                >
                  <AiOutlineShoppingCart className="mr-2" /> Products
                </li>
              </Link>
              <Link to={"/transactions"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "transactions"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("transactions")}
                >
                  <AiOutlineTransaction className="mr-2" /> Transactions
                </li>
              </Link>

              <Link to={"/orders"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "orders"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("orders")}
                >
                  <AiFillAppstore className="mr-2" /> Order
                </li>
              </Link>
            </ul>
          </div>

          {/* Analytics */}
          <div>
            <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2">
              Analytics
            </h3>
            <ul className="space-y-2">
              <Link to={"/revenue"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "revenue"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("revenue")}
                >
                  <BiDollarCircle className="mr-2" /> Revenue
                </li>
              </Link>
              <Link to={"/reports"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "reports"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("reports")}
                >
                  <BiBarChartSquare className="mr-2" /> Reports
                </li>
              </Link>
              <Link to={"/teams"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "teams" ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("teams")}
                >
                  <BiGroup className="mr-2" /> Teams
                </li>
              </Link>
            </ul>
          </div>

          {/* User */}
          <div>
            <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2">
              User
            </h3>
            <ul className="space-y-2">
              <Link to={"/settings"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "settings"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("settings")}
                >
                  <FiSettings className="mr-2" /> Settings
                </li>
              </Link>
              <Link to={"/help"}>
                <li
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    activeItem === "help" ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleItemClick("help")}
                >
                  <FiHelpCircle className="mr-2" /> Help
                </li>
              </Link>
            </ul>
          </div>

          {/* Logout */}
          <div>
            <ul className="mt-4">
              <Link to={"/login"}>
                <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                  <FiLogOut className="mr-2" /> Logout
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
