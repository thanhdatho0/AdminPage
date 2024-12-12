import Header from "../../Components/PageHeader/Header.tsx";
import UserList from "../../Components/UserList/UserList.tsx";

const UsersPage = () => {
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Users"} />
      <UserList />
    </div>
  );
};

export default UsersPage;
