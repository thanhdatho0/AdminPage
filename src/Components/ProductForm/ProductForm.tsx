import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ProductFormProps {
    onSave: (product: any) => void;
    initialData?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSave, initialData }) => {
    const [product, setProduct] = useState(initialData || {
        name: '',
        category: '',
        gender: 'Nam',
        size: '',
        color: [],
        price: 0,
        images: {}, // Images grouped by color
        provider: ''
    });
    const [categories, setCategories] = useState<string[]>(["T-Shirts", "Jeans", "Jackets"]);
    const [newCategory, setNewCategory] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [imageInput, setImageInput] = useState('');

    const defaultColors = [
        "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange", "Black", "White", "Gray",
        "Brown", "Cyan", "Magenta", "Lime", "Olive", "Navy", "Teal", "Maroon", "Silver", "Gold",
        "Beige", "Turquoise", "Lavender", "Coral"
    ];

    const handleSave = () => {
        onSave(product);
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setProduct({ ...product, category: newCategory });
            setNewCategory('');
        }
    };

    const addColor = (selectedColor: string) => {
        if (selectedColor && !product.color.includes(selectedColor)) {
            setProduct({ ...product, color: [...product.color, selectedColor], images: { ...product.images, [selectedColor]: [] } });
        }
    };

    const removeColor = (colorToRemove: string) => {
        const { ...remainingImages } = product.images;
        setProduct({ ...product, color: product.color.filter((c: string) => c !== colorToRemove), images: remainingImages });
    };

    const openImageModal = (color: string) => {
        setSelectedColor(color);
        setShowImageModal(true);
    };

    const addImageForColor = () => {
        if (imageInput) {
            const updatedImages = { ...product.images };
            updatedImages[selectedColor] = [...(updatedImages[selectedColor] || []), imageInput];
            setProduct({ ...product, images: updatedImages });
            setImageInput('');
        }
    };

    const removeImage = (color: string, imgIndex: number) => {
        const updatedImages = { ...product.images };
        updatedImages[color] = updatedImages[color].filter((_: string, index: number) => index !== imgIndex);
        setProduct({ ...product, images: updatedImages });
    };

    return (
        <div className="space-y-4">
            {/* Existing fields */}
            <input
                type="text"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Category with Add Category */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <div className="flex space-x-2">
                    <select
                        name="category"
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <button onClick={addCategory} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                </div>
            </div>

            {/* Existing fields continued */}
            <select
                value={product.gender}
                onChange={(e) => setProduct({ ...product, gender: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Trẻ em">Trẻ em</option>
            </select>

            <input
                type="text"
                placeholder="Size"
                value={product.size}
                onChange={(e) => setProduct({ ...product, size: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Color with Add Color and Image Modal Button */}
            <div className="space-y-2">
                <select
                    value=""
                    onChange={(e) => addColor(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                >
                    <option value="">Select a color</option>
                    {defaultColors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
                <div className="flex flex-wrap space-x-2 mt-2">
                    {product.color.map((color: string, index: number) => (
                        <div key={index} className="flex items-center bg-gray-600 rounded p-2">
                            <span className="text-white mr-2">{color}</span>
                            <button onClick={() => removeColor(color)} className="text-red-500 hover:text-red-700">&times;</button>
                            <button onClick={() => openImageModal(color)} className="ml-2 text-blue-400">Add Image</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <input
                type="number"
                placeholder="Price (VND)"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Provider */}
            <select
                value={product.provider}
                onChange={(e) => setProduct({ ...product, provider: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            >
                <option value="">Select Provider</option>
                <option value="Provider A">Provider A</option>
                <option value="Provider B">Provider B</option>
            </select>

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Add Images for {selectedColor}</h2>
                            <FaTimes onClick={() => setShowImageModal(false)} className="cursor-pointer text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            className="w-full p-2 mb-4 rounded bg-gray-200"
                        />
                        <button onClick={addImageForColor} className="w-full p-2 bg-blue-500 text-white rounded">Add Image</button>
                        <div className="mt-4 flex flex-wrap space-x-2">
                            {(product.images[selectedColor] || []).map((img: string, index: number) => (
                                <div key={index} className="relative w-16 h-16">
                                    <img src={img} alt={`Product image ${index}`} className="w-full h-full rounded" />
                                    <button onClick={() => removeImage(selectedColor, index)} className="absolute top-0 right-0 text-red-500"><FaTimes /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Existing Save Button */}
            <button onClick={handleSave} className="w-full p-2 bg-blue-500 rounded text-white">Save Product</button>
        </div>
    );
};

export default ProductForm;