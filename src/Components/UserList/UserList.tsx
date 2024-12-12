import React, { useState, useEffect } from "react";

interface Customer {
  customerId: number;
  personalInfo: PersonalInfo;
  email: string;
  avatar: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  male: boolean;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

const UserList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5254/api/Customer");
        const data = await response.json();
        // Sort customers by customerId in ascending order
        const sortedData = data.sort(
          (a: Customer, b: Customer) => a.customerId - b.customerId
        );
        setCustomers(sortedData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleEditClick = async (customerId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/Customer/${customerId}`
      );
      const data = await response.json();
      setSelectedCustomer(data);
      setEditedCustomer(data); // Set the editable copy
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof PersonalInfo
  ) => {
    if (editedCustomer) {
      setEditedCustomer({
        ...editedCustomer,
        personalInfo: {
          ...editedCustomer.personalInfo,
          [field]: event.target.value,
        },
      });
    }
  };

  const handleSaveClick = async () => {
    if (editedCustomer) {
      try {
        // Create a FormData object
        const formData = new FormData();

        // Add fields to the FormData object
        formData.append(
          "PersonalInfo.FirstName",
          editedCustomer.personalInfo.firstName
        );
        formData.append(
          "PersonalInfo.LastName",
          editedCustomer.personalInfo.lastName
        );
        formData.append(
          "PersonalInfo.Male",
          String(editedCustomer.personalInfo.male)
        ); // Convert boolean to string
        formData.append(
          "PersonalInfo.PhoneNumber",
          editedCustomer.personalInfo.phoneNumber
        );
        formData.append(
          "PersonalInfo.Address",
          editedCustomer.personalInfo.address
        );
        formData.append(
          "PersonalInfo.DateOfBirth",
          editedCustomer.personalInfo.dateOfBirth
        );
        formData.append("Email", editedCustomer.email);

        // Optionally add a file (if required)
        // Replace `fileInputRef` with your file input reference, if applicable
        // formData.append("file", fileInputRef.current.files[0]);

        const response = await fetch(
          `http://localhost:5254/api/Customer/${editedCustomer.customerId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          const updatedCustomer = await response.json();
          setCustomers((prev) =>
            prev.map((customer) =>
              customer.customerId === updatedCustomer.customerId
                ? updatedCustomer
                : customer
            )
          );
          setSelectedCustomer(null);
          setEditedCustomer(null);
        } else {
          console.error("Error saving customer:", await response.text());
        }
      } catch (error) {
        console.error("Error saving customer:", error);
      }
    }
  };

  const handleCloseClick = () => {
    setSelectedCustomer(null);
    setEditedCustomer(null);
  };

  return (
    <div className="mt-4 mx-auto w-4/5 bg-white p-6 rounded-lg shadow-md">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">
              Customer ID
            </th>
            <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-200 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-200 px-4 py-2 text-left">
              Phone Number
            </th>
            <th className="border border-gray-200 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.customerId}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="border border-gray-200 px-4 py-2">
                {customer.customerId}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {`${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {customer.email}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {customer.personalInfo.phoneNumber}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleEditClick(customer.customerId)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editedCustomer && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={editedCustomer.personalInfo.firstName}
              onChange={(e) => handleInputChange(e, "firstName")}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={editedCustomer.personalInfo.lastName}
              onChange={(e) => handleInputChange(e, "lastName")}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={editedCustomer.personalInfo.phoneNumber}
              onChange={(e) => handleInputChange(e, "phoneNumber")}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={editedCustomer.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={handleCloseClick}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
