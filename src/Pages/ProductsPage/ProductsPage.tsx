import ProductList from "../../Components/ProductList/ProductList.tsx";
import { useEffect, useState } from "react";
import { GetProduct } from "../../ShopModels";
import { getAllProducts } from "../../api.tsx";
import ProductPageHeader from "../../Components/ProductPageHeader/ProductPageHeader.tsx";
import { Link, useSearchParams } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState<GetProduct[]>([]);
  const [searchParams] = useSearchParams();
  // const [editingProduct, setEditingProduct] = useState<GetProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const targetCustomer = searchParams.get("TargetCustomerId");
        const category = searchParams.get("CategoryId");
        const subCategory = searchParams.get("SubcategoryId");
        const result = await getAllProducts(
          targetCustomer,
          category,
          subCategory
        );
        const products = result?.data ? result.data : [];
        setProducts(products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleEdit = () => {
    //setEditingProduct(product);
    // setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.productId !== id)
    );
  };

  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      {/*<Header title={"Products"} />*/}
      <ProductPageHeader title={"Products"} />
      <div className="bg-gray-800 p-4 rounded-lg">
        <Link to="/addProduct">
          <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            + Add
          </button>
        </Link>

        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
