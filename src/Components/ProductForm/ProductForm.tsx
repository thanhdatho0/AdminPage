import React, { useState } from 'react';

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
        images: [],
        provider: ''
    });
    const [categories, setCategories] = useState<string[]>(["T-Shirts", "Jeans", "Jackets"]); // Initial categories
    const [newCategory, setNewCategory] = useState('');
    const [newImage, setNewImage] = useState('');

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
            setProduct({ ...product, color: [...product.color, selectedColor] });
        }
    };

    const removeColor = (colorToRemove: string) => {
        setProduct({ ...product, color: product.color.filter((c: string) => c !== colorToRemove) });
    };

    const addImage = () => {
        if (newImage) {
            setProduct({ ...product, images: [...product.images, newImage] });
            setNewImage('');
        }
    };

    return (
        <div className="space-y-4">
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
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <button onClick={addCategory} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Add
                    </button>
                </div>
            </div>

            {/* Gender */}
            <select
                value={product.gender}
                onChange={(e) => setProduct({ ...product, gender: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Trẻ em">Trẻ em</option>
            </select>

            {/* Size */}
            <input
                type="text"
                placeholder="Size"
                value={product.size}
                onChange={(e) => setProduct({ ...product, size: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Color with Add Color */}
            <div className="space-y-2">
                {/*<label className="block text-sm font-medium text-gray-300">Colors</label>*/}
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
                            <button
                                onClick={() => removeColor(color)}
                                className="text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
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

            {/* Image URLs */}
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Enter image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-700 text-white"
                />
                <button onClick={addImage} className="px-4 py-2 bg-blue-500 text-white rounded">Add Image</button>
            </div>
            <div className="flex space-x-2">
                {product.images.map((img: string, index: number) => (
                    <img key={index} src={img} alt={`Product image ${index}`} className="w-16 h-16 rounded" />
                ))}
            </div>

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

            <button onClick={handleSave} className="w-full p-2 bg-blue-500 rounded text-white">
                Save Product
            </button>
        </div>
    );
};

export default ProductForm;
