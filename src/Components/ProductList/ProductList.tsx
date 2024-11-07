import React, {useState} from "react";
import ProductCard from "../ProductCard/ProductCard.tsx";
import ImageModal from "../ProductCard/ImageModal.tsx";

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

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({products, onEdit, onDelete}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    // const [isFormVisible, setIsFormVisible] = useState(false);

    const handleImageButtonClick = (images: string[]) => {
        setCurrentImages(images);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImages([]);
    };

    return (
        <div className="space-y-6">

            {products.map((product) => (
                <ProductCard product={product} onEdit={onEdit} onDelete={onDelete} handleImageButtonClick={handleImageButtonClick} />
            ))}

            {/* Image Modal */}
            {isModalOpen && <ImageModal images={currentImages} onClose={closeModal} />}
        </div>
    );
};

export default ProductList;