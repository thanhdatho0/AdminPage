import React from "react";
import Header from "../../Components/PageHeader/Header";
import DeletedProductComponent from "../../Components/DeletedProduct/DeletedProductComponent";

type Props = {};

const DeletedProductPage = (props: Props) => {
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Deleted Product"} />
      <DeletedProductComponent />
    </div>
  );
};

export default DeletedProductPage;
