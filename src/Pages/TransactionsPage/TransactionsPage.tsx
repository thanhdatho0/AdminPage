import Header from "../../Components/PageHeader/Header.tsx";
import GetAllTransaction from "../../Components/TransactionList/GetAllTransaction.tsx";

const TransactionsPage = () => {
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Transactions"} />
      <GetAllTransaction />
    </div>
  );
};

export default TransactionsPage;
