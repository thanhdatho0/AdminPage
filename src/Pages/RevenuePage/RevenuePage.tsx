import DashboardBarChart from "../../Components/DashboardLineChart/DashboardLineChart.tsx";
import Header from "../../Components/PageHeader/Header.tsx";

const RevenuePage = () => {
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Revenue"} />
      <DashboardBarChart />
    </div>
  );
};

export default RevenuePage;
