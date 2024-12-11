import EmployeeList from "../../Components/EmployeeList/EmployeeList.tsx";
import Header from "../../Components/PageHeader/Header.tsx";

const TeamPage = () => {
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Teams"} />
      <EmployeeList />
    </div>
  );
};

export default TeamPage;
