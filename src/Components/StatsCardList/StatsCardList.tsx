import { useEffect, useState } from "react";
import StatsCard from "../StatsCard/StatsCard";
import stats from "./stats.json";
import axios from "axios";

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
  dateOfBirth: string; // Assuming dateOfBirth is always a string representation of a date
}
const StatsCardList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5254/api/Customer");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={customers.length.toString()}
          change={stat.change}
          changeDescription={stat.changeDescription}
        />
      ))}
    </div>
  );
};

export default StatsCardList;
