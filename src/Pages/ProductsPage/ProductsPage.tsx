
import ProductList from "../../Components/ProductList/ProductList.tsx";
import ProductForm from "../../Components/ProductForm/ProductForm.tsx";
import {useEffect, useState} from "react";
import {GetProduct} from "../../ShopModels";
import {getAllProducts} from "../../api.tsx";
import ProductPageHeader from "../../Components/ProductPageHeader/ProductPageHeader.tsx";
import { useSearchParams } from "react-router-dom";

const ProductsPage = () => {
    const [products, setProducts] = useState<GetProduct[]>([]);
    const [searchParams] = useSearchParams();
    // const [editingProduct, setEditingProduct] = useState<GetProduct | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const targetCustomer = searchParams.get("TargetCustomerId");
                const category = searchParams.get("CategoryId");
                const subCategory = searchParams.get("SubcategoryId");
            const result = await getAllProducts(targetCustomer, category, subCategory);
            const products = result?.data ? result.data : [];
            setProducts(products);
            }
            catch (error){
                console.log(error)
            }
        };

        fetchProducts();
    }, [searchParams]);

    const handleSave = (product: GetProduct) => {
        if (product.productId) {
            // Update an existing product
            setProducts(prevProducts =>
                prevProducts.map(p => (p.productId === product.productId ? product : p))
            );
        } else {
            // Add a new product
            setProducts(prevProducts => [
                ...prevProducts,
                { ...product, id: Date.now().toString() }
            ]);
        }
        closeForm();
    };

    const handleEdit = () => {
        //setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setProducts(prevProducts => prevProducts.filter(p => p.productId !== id));
    };

    const openForm = () => {
        //setEditingProduct(null);  // Clear any product being edited
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
        //setEditingProduct(null);
    };

    return (
        <div className="mt-[0.5%] m-auto w-[80%]">
            {/*<Header title={"Products"} />*/}
            <ProductPageHeader title={"Products"}/>
            <div className="bg-gray-800 p-4 rounded-lg">
                <button
                    onClick={openForm}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    + Add
                </button>
                <ProductList
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Product Form Modal */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <button
                            className="mb-2 text-red-500"
                            onClick={closeForm}
                        >
                            Close
                        </button>
                        <ProductForm
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
