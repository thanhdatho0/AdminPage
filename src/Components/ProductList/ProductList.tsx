import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ImageModal from "../ProductCard/ImageModal";
import {GetProduct} from "../../ShopModels";

interface ProductListProps {
    products: GetProduct[];
    onEdit: (product: GetProduct) => void;
    onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [currentColor, setCurrentColor] = useState<string>(''); // Track selected color for modal

    const handleImageButtonClick = (images: string[], color: string) => {
        setCurrentImages(images);
        setCurrentColor(color);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImages([]);
        setCurrentColor('');
    };

    return (
        <div className="space-y-6">
            {products.map((product) => (
                <ProductCard
                    key={product.productId}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    handleImageButtonClick={(images) => handleImageButtonClick(images, product.colors[0].name)} // Pass color-specific images
                />
            ))}

            {/* Image Modal */}
            {isModalOpen && (
                <ImageModal
                    images={currentImages}
                    color={currentColor}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default ProductList;
