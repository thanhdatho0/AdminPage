import React, { useState } from 'react';
import { FiEdit, FiTrash } from "react-icons/fi";
import {GetProduct} from "../../ShopModels";

interface ProductCardProp {
    product: GetProduct;
    handleImageButtonClick: (images: string[]) => void;
    onEdit: (product: GetProduct) => void;
    onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProp> = ({ product, handleImageButtonClick, onEdit, onDelete }) => {
    const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].name || '');

    const handleShowImages = () => {
        const ColorWithImages =  product.colors.find(c => c.name === selectedColor);
        const imagesForColor =  ColorWithImages?.images.map(i => i.url) || [];
        handleImageButtonClick(imagesForColor);
    };

    return (
        <div key={product.productId} className="flex items-start space-x-6 p-6 bg-gray-800 rounded-lg shadow-lg">
            {/* Product Details */}
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{product.name || ""}</h2>
                <div className="text-sm text-gray-300 space-y-1 mt-2">
                    <p><span className="font-medium text-gray-400">Size:</span> {product.sizes.map(x => x.sizeValue).join(", ") || undefined}</p>
                    <p><span className="font-medium text-gray-400">Color:</span> {product.colors.map(c => c.name).join(", ") || ""}</p>
                    <p className="text-lg font-bold text-green-400 mt-2">
                        Price: {product.price.toLocaleString() || undefined}₫
                    </p>
                </div>
            </div>

            {/* Image Button with Color Selection */}
            <div className="flex flex-col items-center space-y-2">
                <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                >
                    {product?.colors.map((color) => (
                        <option key={color.colorId} value={color.name}>{color.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleShowImages}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Show Images
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded-full text-blue-400 hover:text-blue-600 transition-colors"
                    title="Edit Product"
                >
                    <FiEdit size={22} />
                </button>
                <button
                    onClick={() => onDelete(product.productId)}
                    className="p-2 rounded-full text-red-400 hover:text-red-600 transition-colors"
                    title="Delete Product"
                >
                    <FiTrash size={22} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
