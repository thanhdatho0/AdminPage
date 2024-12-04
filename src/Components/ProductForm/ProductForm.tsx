import React, {useEffect, useState} from 'react';
import { FaTimes } from 'react-icons/fa';
import {getAllCategories, getAllColors, getAllSizes} from "../../api.tsx";
import {AllCategoriesDto, CategoryDto, Color, Size, SubCategoryDto} from "../../ShopModels";
import {FiEdit, FiTrash} from "react-icons/fi";

interface ProductFormProps {
    onSave: (product: any) => void;
}


const ProductForm: React.FC<ProductFormProps> = ({ onSave}) => {

    const [productName, setProductName] = useState<string>(''); // Đặt tên sản phẩm

    //Chọn category cho sản phẩm hoặc thêm vào 1 category mới
    const [targetCustomers, setTargetCustomer] = useState<AllCategoriesDto[]>([]);
    const [selectedTargetCustomer, setSelectedTargetCustomer] = useState<AllCategoriesDto>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();
    const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryDto>();
    const [newCategory, setNewCategory] = useState<string>('');
    const [newSubCategory, setNewSubCategory] = useState('');
    //end
    const [colors, setColor] = useState<Color[]>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [colorsChosen, setColorChosen] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');
    const [images, setImages] = useState<Record<string, string[]>>({});


    useEffect(() => {
        const fetchData = async () =>{
            const fetchColorsResult = await getAllColors().then(data => data?.data || []);
            setColor(fetchColorsResult);
            const fetchCategoriesResult = await getAllCategories().then(data => data?.data || []);
            setTargetCustomer(fetchCategoriesResult);
        }
        fetchData().then();
    }, []);

    const handleSave = () => {
        const product = {
            name: productName,
            targetCustomer: selectedTargetCustomer,
            category: selectedCategory,
            subCategory: selectedSubCategory,
            colors: colorsChosen,
            images,
            // Các thuộc tính khác...
        };
        onSave(product);
    };


    const addCategory = () => {
        if (newCategory) {
            const newCat: CategoryDto = {
                categoryId: Date.now(), // Tạo ID giả
                name: newCategory,
                targetCustomerId: selectedTargetCustomer?.targetCustomerId || 0,
                subcategories: [],
            };
            setCategories([...categories, newCat]);
            setNewCategory('');
        }
    };

    const addSubCategory = () => {
        if (newSubCategory && selectedCategory) {
            const newSubCat: SubCategoryDto = {
                subcategoryId: Date.now(), // Tạo ID giả
                subcategoryName: newSubCategory,
                description: '',
                categoryId: selectedCategory.categoryId,
            };
            setSubCategories([...subCategories, newSubCat]);
            setNewSubCategory('');
        }
    };


    const addColor = (selectedColor: string) => {
        if (selectedColor && !colorsChosen.includes(selectedColor)) {
            // setProduct({ ...product, color: [...product.color, selectedColor], images: { ...product.images, [selectedColor]: [] } });
            setColorChosen([...colorsChosen, selectedColor]);
        }
    };

    const removeColor = (colorToRemove: string) => {
        // Cập nhật danh sách màu
        setColorChosen((prevColors) => prevColors.filter((color) => color !== colorToRemove));

        // Cập nhật hình ảnh liên quan
        setImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[colorToRemove]; // Xóa khóa liên quan đến màu
            return updatedImages;
        });
    };


    const openImageModal = (color: string) => {
        setSelectedColor(color);
        setShowImageModal(true);
    };

    const addImageForColor = () => {
        if (imageInput && selectedColor) {
            setImages((prev) => ({
                ...prev,
                [selectedColor]: [...(prev[selectedColor] || []), imageInput],
            }));
            setImageInput('');
        }
    };

    const removeImage = (color: string, imgIndex: number) => {
        setImages((prev) => ({
            ...prev,
            [color]: prev[color]?.filter((_, index) => index !== imgIndex) || [],
        }));
    };


    return (
        <div className="space-y-4">
            {/* Existing fields */}
            <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value )}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Existing fields continued */}
            <select
                value= {selectedTargetCustomer?.targetCustomerName || ""}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedCustomer = targetCustomers.find(c => c.targetCustomerName === selectedValue);
                    setSelectedTargetCustomer(selectedCustomer);

                    if (selectedCustomer) {
                        setCategories(selectedCustomer.categories);
                    }
                    }
                }

                className="w-full p-2 rounded bg-gray-700 text-white"
            >
                <option value="">Chọn đối tượng</option>
                {targetCustomers.map((cat) => (
                    <option key={cat.targetCustomerId} value={cat.targetCustomerName}>{cat.targetCustomerName}</option>
                ))}
            </select>

            {/* Category with Add Category */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <div className="flex space-x-2">
                    <select
                        name="category"
                        value={selectedCategory?.name || ""}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedCategory = categories.find(c => c.name === selectedValue);
                            setSelectedCategory(selectedCategory);

                            if (selectedCategory) {
                                setSubCategories(selectedCategory.subcategories);
                            }
                            }
                        }
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
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

            {/* SubCategory with Add Category */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <div className="flex space-x-2">
                    <select
                        name="subcategory"
                        value={selectedSubCategory?.subcategoryName || ""}
                        onChange={(e) => setSelectedSubCategory(subCategories.find(s => s.subcategoryName === e.target.value))}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        <option value="">Select a category</option>
                        {subCategories.map((cat, index) => (
                            <option key={index} value={cat.subcategoryName}>{cat.subcategoryName}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter new subcategory"
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                    <button onClick={addSubCategory} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                </div>
            </div>


            {/* Color with Add Color and Image Modal Button */}
            <div className="space-y-2">
                <select
                    value=""
                    onChange={(e) => addColor(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                >
                    <option value="">Select a color</option>
                    {colors.map((color) => (
                        <option key={color.colorId} value={color.name}>{color.name}</option>
                    ))}
                </select>
                <div className="">
                    {colorsChosen.map((color, index: number) => (
                        <div key={index} className="w-full p-2 rounded bg-gray-700 text-white flex justify-between mt-2">
                            <span className="text-white mr-2">{color}</span>
                            <div>
                                <button onClick={() => removeColor(color)} className="text-blue-500 hover:text-blue-700"><FiEdit size={22}/></button>
                                <button onClick={() => removeColor(color)} className="ml-2 text-red-400"><FiTrash size={22}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <input
                type="number"
                placeholder="Price (VND)"
                // value={product.price}
                // onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />

            {/* Provider */}
            <select
                // value={product.provider}
                // onChange={(e) => setProduct({ ...product, provider: e.target.value })}
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
                            {(images![selectedColor] || []).map((img: string, index: number) => (
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