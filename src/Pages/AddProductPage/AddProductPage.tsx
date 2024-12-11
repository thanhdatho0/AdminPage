import { useLocation } from "react-router-dom";
import ProductForm from "../../Components/ProductForm/ProductForm";
import { useEffect, useState } from "react";

const AddProductPage = () => {
  // false là sửa sp, true là thêm sp mới
  const [checkProduct, setCheckProduct] = useState<boolean>(true);
  const location = useLocation();
  const productToEdit = location.state?.product;

  useEffect(() => {
    if (productToEdit) {
      setCheckProduct(false);
    } else {
      setCheckProduct(true);
    }
  }, [productToEdit]);
  return (
    <div>
      <ProductForm product={productToEdit} checkProduct={checkProduct} />
    </div>
  );
};

export default AddProductPage;
