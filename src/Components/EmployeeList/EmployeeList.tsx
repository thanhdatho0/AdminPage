import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaPhone,
  FaHome,
  FaBirthdayCake,
  FaCalendarAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { BASE_URL } from "../../api";
import { UserContext } from "../UserContext/UserContext";

// Define the shape of the employee data (from the API)
interface Employee {
  employeeId: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    male: boolean;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
  };
  salary: number;
  startDate: string;
  contractUpTo: number;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { user, logoutContext } = useContext(UserContext);

  // Fetch employee data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Employee`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Thêm header Authorization
          },
          withCredentials: true, // Đảm bảo với Cookies nếu có
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        logoutContext();
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white mt-6 mb-6">
      <h4 className="text-2xl font-semibold mb-6 text-center">
        Employee Information
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.employeeId}
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all"
          >
            <div className="text-center mb-4">
              <h5 className="text-xl font-semibold">
                {employee.personalInfo.firstName}{" "}
                {employee.personalInfo.lastName}
              </h5>
              <p className="text-sm text-gray-400">
                {employee.personalInfo.male ? "Male" : "Female"}
              </p>
            </div>

            <div className="mb-4">
              <h6 className="text-md font-semibold text-gray-300">
                Personal Info
              </h6>
              <ul className="list-none text-sm space-y-2">
                <li className="flex items-center">
                  <FaPhone className="mr-2 text-blue-500" />
                  <strong>Phone:</strong> {employee.personalInfo.phoneNumber}
                </li>
                <li className="flex items-center">
                  <FaHome className="mr-2 text-green-500" />
                  <strong>Address:</strong>{" "}
                  {employee.personalInfo.address || "N/A"}
                </li>
                <li className="flex items-center">
                  <FaBirthdayCake className="mr-2 text-red-500" />
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(
                    employee.personalInfo.dateOfBirth
                  ).toLocaleDateString("en-GB")}
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h6 className="text-md font-semibold text-gray-300">Job Info</h6>
              <ul className="list-none text-sm space-y-2">
                <li className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-yellow-500" />
                  <strong>Start Date:</strong>{" "}
                  {new Date(employee.startDate).toLocaleDateString("en-GB")}
                </li>
                <li className="flex items-center">
                  <FaMoneyBillAlt className="mr-2 text-purple-500" />
                  <strong>Salary:</strong> ${employee.salary.toLocaleString()}
                </li>
                <li className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-teal-500" />
                  <strong>Contract Up To:</strong> {employee.contractUpTo}{" "}
                  year(s)
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
