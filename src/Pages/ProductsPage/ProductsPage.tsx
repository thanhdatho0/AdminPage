import Header from "../../Components/PageHeader/Header.tsx";
import { products as initialProducts } from './ProductsData.tsx';
import ProductList from "../../Components/ProductList/ProductList.tsx";
import ProductForm from "../../Components/ProductForm/ProductForm.tsx";
import { useState } from "react";

interface Product {
    id: string;
    name: string;
    category: string;
    gender: string;
    size: string;
    color: string[];
    price: number;
    images: string[];
    provider: string;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSave = (product: Product) => {
        if (product.id) {
            // Update an existing product
            setProducts(prevProducts =>
                prevProducts.map(p => (p.id === product.id ? product : p))
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

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleDelete = (id: string) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    };

    const openForm = () => {
        setEditingProduct(null);  // Clear any product being edited
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setEditingProduct(null);
    };

    return (
        <div className="mt-[0.5%] m-auto w-[80%]">
            <Header title={"Products"} />
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
                            initialData={editingProduct || undefined}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
