import React from 'react';
import {FiEdit, FiTrash} from "react-icons/fi";

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

interface ProductCardProp{
    product: Product;
    handleImageButtonClick: (images: string[]) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProp> = ({product, handleImageButtonClick, onEdit, onDelete}) => {
    return (
        <div
            key={product.id}
            className="flex items-start space-x-6 p-6 bg-gray-800 rounded-lg shadow-lg"
        >
            {/* Product Details */}
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{product.name}</h2>
                <div className="text-sm text-gray-300 space-y-1 mt-2">
                    <p><span className="font-medium text-gray-400">Category:</span> {product.category}</p>
                    <p><span className="font-medium text-gray-400">Gender:</span> {product.gender}</p>
                    <p><span className="font-medium text-gray-400">Size:</span> {product.size}</p>
                    <p><span className="font-medium text-gray-400">Color:</span> {product.color.join(', ')}</p>
                    <p><span className="font-medium text-gray-400">Provider:</span> {product.provider}</p>
                    <p className="text-lg font-bold text-green-400 mt-2">
                        Price: {product.price.toLocaleString()}₫
                    </p>
                </div>
            </div>

            {/* Image Button */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => handleImageButtonClick(product.images)}
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
                    <FiEdit size={22}/>
                </button>
                <button
                    onClick={() =>  onDelete(product.id)}
                    className="p-2 rounded-full text-red-400 hover:text-red-600 transition-colors"
                    title="Delete Product"
                >
                    <FiTrash size={22}/>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;