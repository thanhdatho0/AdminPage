import { FiBell, FiChevronDown } from "react-icons/fi";
// import menuData from "../ProductPageHeader/ProductHeaderData.json"
// import { BiSearch } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AllCategoriesDto } from "../../ShopModels";
import { getAllCategories } from "../../api.tsx";
import "./ProductPageHeader.css";

interface HeaderProps {
  title: string;
}

const ProductPageHeader = ({ title }: HeaderProps) => {
  const [menuData, setMenuData] = useState<AllCategoriesDto[]>([]);
  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getAllCategories();
      const menu = result?.data ? result?.data : [];
      setMenuData(menu);
    };
    fetchMenu().then();
  }, []);
  return (
    <div className="w-[100%] flex justify-between items-center p-4 bg-gray-900 rounded-lg shadow-md mb-6 relative">
      <h1 className="text-white text-2xl font-semibold">{title}</h1>
      <ul className="flex gap-6">
        {menuData.map((menu) => (
          <li key={menu.targetCustomerId} className=" group text-white">
            {/* Target Customer Level */}
            <Link
              to={`/products?TargetCustomerId=${menu.targetCustomerId}`}
              className="block hover:text-yellow-400 transition"
            >
              <button className="flex items-center gap-1 hover:text-yellow-400">
                {menu.targetCustomerName} <FiChevronDown />
              </button>
            </Link>
            <div className="absolute left-0 top-[100%] hidden group-hover:block bg-gray-900 p-4 rounded shadow-lg z-10 w-full">
              {/* Categories Level */}
              <div className="grid grid-cols-4 gap-6 menu-dropdown relative">
                {menu.categories.map((category) => (
                  <div key={category.name}>
                    {/* Category Title */}
                    <Link
                      to={`/products?TargetCustomerId=${menu.targetCustomerId}&CategoryId=${category.categoryId}`}
                      className="block hover:text-yellow-400 transition"
                    >
                      <p className="font-bold hover:text-yellow-400 mb-2">
                        {category.name}
                      </p>
                    </Link>
                    {/* Subcategories Level */}
                    <ul className="space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.subcategoryId}>
                          <Link
                            to={`/products?TargetCustomerId=${menu.targetCustomerId}&CategoryId=${category.categoryId}&SubcategoryId=${subcategory.subcategoryId}`}
                            className="block hover:text-yellow-400 transition"
                          >
                            {subcategory.subcategoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <FiBell className="text-white text-xl" />
        <FaUserCircle className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default ProductPageHeader;
