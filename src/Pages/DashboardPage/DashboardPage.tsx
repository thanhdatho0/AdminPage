import Header from "../../Components/PageHeader/Header.tsx";
import StatsCardList from "../../Components/StatsCardList/StatsCardList.tsx";
import TransactionList from "../../Components/TransactionList/TransactionList.tsx";


const DashboardPage = () => {
    return (
        <div className="mt-[0.5%] m-auto w-[80%]">
            <Header title={"Dashboard"} />
            <StatsCardList/>
            <TransactionList/>
        </div>
    );
};

export default DashboardPage;