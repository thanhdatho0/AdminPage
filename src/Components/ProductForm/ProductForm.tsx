import { useEffect, useState } from "react";
// import { FaTimes } from "react-icons/fa";
import {
  getAllCategories,
  getAllColors,
  getAllProvider,
  getAllSizes,
  getTargetCustomerId,
} from "../../api.tsx";
import {
  AllCategoriesDto,
  CategoryDto,
  Color,
  Product,
  Provider,
  Size,
  SubCategoryDto,
} from "../../ShopModels";
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
// import { parse } from "dotenv";

interface Props {
  product?: Product;
  checkProduct: boolean;
}

const ProductForm: React.FC<Props> = ({ product, checkProduct }) => {
  console.log(product?.description);
  const [productName, setProductName] = useState<string>(""); // Đặt tên sản phẩm

  const [isFormVisible, setIsFormVisible] = useState(false);

  //Chọn category cho sản phẩm hoặc thêm vào 1 category mới
  const [targetCustomers, setTargetCustomer] = useState<AllCategoriesDto[]>([]);
  const [selectedTargetCustomer, setSelectedTargetCustomer] =
    useState<AllCategoriesDto>();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryDto>();
  const [newCategoryy, setNewCategory] = useState<string>("");
  const [newSubCategoryy, setNewSubCategory] = useState<string>("");
  //end
  const [colors, setColor] = useState<Color[]>([]);
  const [colorsChosen, setColorChosen] = useState<Color[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersChosen, setProvidersChosen] = useState<Provider>();

  const [tmpSelectedSize, setTmpSelectedSize] = useState<Size | null>(null);
  const [tmpInputQuantity, setTmpInputQuantity] = useState<number | "">("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [productDetails, setProductDetails] = useState<{
    [color: number]: {
      selectedImg: string[];
      adminSelectedSize: Size[];
      adminInputQuantity: number[];
    };
  }>({});
  const [currentColor, setCurrentColor] = useState<number>(0);
  const [cost, setCost] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0.1);
  const [description, setDescription] = useState<string>("");
  const [unit, setUnit] = useState<string>("Cái");
  const [inputNewCategory, setInputNewCategory] = useState<string>("");
  const [inputNewSubCategory, setInputNewSubCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchColorsResult = await getAllColors().then(
        (data) => data?.data || []
      );
      setColor(fetchColorsResult);

      const fetchSizesResult = await getAllSizes().then(
        (data) => data?.data || []
      );
      setSizes(fetchSizesResult);

      const fetchProvidersResult = await getAllProvider().then(
        (data) => data?.data || []
      );
      setProviders(fetchProvidersResult);

      const fetchCategoriesResult = await getAllCategories().then(
        (data) => data?.data || []
      );
      setTargetCustomer(fetchCategoriesResult);

      if (product?.subcategoryId) {
        const fetchTargetCustomer = await getTargetCustomerId(
          product.subcategoryId
        ).then((data) => data?.data);
        console.log(fetchTargetCustomer);
        console.log(product);
        fetchTargetCustomer?.map((cat) => {
          setSelectedTargetCustomer(cat);

          const updatedCategories = cat.categories;
          setCategories(updatedCategories);
          setSelectedCategory(updatedCategories[0]);

          const updatedSubCategories = updatedCategories[0].subcategories;
          setSubCategories(updatedSubCategories);

          const selectedSubCategory = updatedSubCategories.find(
            (s) => s.subcategoryId === product.subcategoryId
          );
          setSelectedSubCategory(selectedSubCategory);

          const selectedProvider = fetchProvidersResult.find(
            (p) => p.providerId === product.providerId
          );
          setProvidersChosen(selectedProvider);

          product.colors.forEach((color) => {
            addColor(color);
          });
        });
      }
    };
    fetchData().then();
  }, []);

  const openForm = (color: Color) => {
    setCurrentColor(color.colorId);
    setTmpInputQuantity("");
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setCurrentColor(0);
  };

  const handleInputCategory = (name: string) => {
    setNewCategory(name);
    setInputNewCategory(name);
  };

  const handleInputSubCategory = (name: string) => {
    setNewSubCategory(name);
    setInputNewSubCategory(name);
  };

  const handleInputUnit = (u: string) => {
    setUnit(u);
  };

  const handleAddProvider = (prov: Provider) => {
    setProvidersChosen(prov);
  };

  const addColor = (color: Color) => {
    if (color && !colorsChosen.includes(color)) {
      setColorChosen((prevChosen) => {
        if (color && !prevChosen.includes(color)) {
          return [...prevChosen, color];
        }
        return prevChosen;
      });
      setProductDetails((prev) => ({
        ...prev,
        [color.colorId]: {
          selectedImg: [],
          adminSelectedSize: [],
          adminInputQuantity: [],
        },
      }));
    }
  };

  const removeColor = (color: Color) => {
    setColorChosen(colorsChosen.filter((c) => c !== color));
    setProductDetails((prev) => {
      const updated = { ...prev };
      delete updated[color.colorId];
      return updated;
    });
  };

  const handleSelectImg = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);

      setProductDetails((prev) => {
        const currentImages = prev[currentColor]?.selectedImg || [];
        const nextImages = [...currentImages];

        const emptyIndex = nextImages.findIndex((img) => !img);
        if (emptyIndex !== -1) {
          nextImages[emptyIndex] = fileURL;
        } else {
          nextImages.push(fileURL);
        }

        return {
          ...prev,
          [currentColor]: {
            ...prev[currentColor],
            selectedImg: nextImages,
          },
        };
      });
    }
  };

  const handleClickSave = () => {
    const details = productDetails[currentColor];

    const hasSizes = details?.adminSelectedSize?.length > 0;
    const hasQuantities =
      details?.adminInputQuantity?.some((qty) => qty > 0) || false;
    const hasImages = details?.selectedImg?.some((img) => img) || false;

    if (!hasSizes || !hasQuantities || !hasImages) {
      alert("Vui lòng nhập đầy đủ size, số lượng và chọn ít nhất một ảnh!");
      return;
    }
    closeForm();
  };

  const handleConfirm = () => {
    if (tmpSelectedSize && Number(tmpInputQuantity) > 0) {
      setProductDetails((prev) => {
        const updatedSizes = [...(prev[currentColor]?.adminSelectedSize || [])];
        const updatedQuantities = [
          ...(prev[currentColor]?.adminInputQuantity || []),
        ];

        const sizeIndex = updatedSizes.indexOf(tmpSelectedSize);
        if (sizeIndex !== -1) {
          updatedQuantities[sizeIndex] = Number(tmpInputQuantity);
        } else {
          updatedSizes.push(tmpSelectedSize);
          updatedQuantities.push(Number(tmpInputQuantity));
        }

        return {
          ...prev,
          [currentColor]: {
            ...prev[currentColor],
            adminSelectedSize: updatedSizes,
            adminInputQuantity: updatedQuantities,
          },
        };
      });
      setTmpSelectedSize(null);
      setTmpInputQuantity("");
    } else {
      alert("Vui lòng chọn size và nhập số lượng!");
    }
  };

  const handleSave = async () => {
    console.log(selectedSubCategory?.subcategoryId);
    console.log(productName);
    const productt = {
      Name: productName,
      Price: cost,
      Description: description,
      Cost: price,
      Unit: unit,
      TargetCustomerId: selectedTargetCustomer?.targetCustomerId,
      DiscountPercentage: discountPercentage,

      // thêm category và subcategory mới
      ...(inputNewCategory.trim() === selectedCategory?.name && {
        newCategory: inputNewCategory,
      }),
      ...(inputNewSubCategory.trim() ===
        selectedSubCategory?.subcategoryName && {
        newSubcategory: inputNewSubCategory,
      }),

      ...(inputNewCategory.trim() !== selectedCategory?.name && {
        CategoryId: selectedCategory?.categoryId,
      }),
      ...(inputNewCategory.trim() === selectedCategory?.name && {
        CategoryId: 0,
      }),

      ...(inputNewSubCategory.trim() ===
        selectedSubCategory?.subcategoryName && {
        SubcategoryId: 0,
      }),
      ...(inputNewSubCategory.trim() !==
        selectedSubCategory?.subcategoryName && {
        SubcategoryId: selectedSubCategory?.subcategoryId,
      }),
      ProviderId: providersChosen?.providerId,
      Inventory: Object.entries(productDetails).map(([color, value]) => ({
        color: {
          colorId: parseInt(color),
          images: value.selectedImg.map((img) => ({
            url: img,
            alt: "Ảnh sản phẩm",
          })),
        },
        sizes: value.adminSelectedSize.map((size, index) => ({
          sizeId: size.sizeId,
          quantity: value.adminInputQuantity[index],
        })),
      })),
    };

    setNewCategory("");
    setNewSubCategory("");
    setInputNewCategory("");
    setInputNewSubCategory("");

    try {
      if (checkProduct) {
        await axios.post(
          "http://localhost:5254/api/products",
          JSON.stringify(productt),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.put(
          `http://localhost:5254/api/products/${product?.productId}`,
          JSON.stringify(productt),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      alert("Sản phẩm đã được lưu thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Error response: ", error.response.data);
          alert(
            `Lỗi khi lưu sản phẩm: ${
              error.response.data.message || error.response.status
            }`
          );
        } else if (error.request) {
          alert("Không nhận được phản hồi từ server.");
        } else {
          console.error("Lỗi khi gọi API:", error.message);
          alert("Đã xảy ra lỗi khi lưu sản phẩm.");
        }
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  const addCategory = () => {
    if (newCategoryy) {
      const newCat: CategoryDto = {
        categoryId: Date.now(), // Tạo ID giả
        name: newCategoryy,
        targetCustomerId: selectedTargetCustomer?.targetCustomerId || 0,
        subcategories: [],
      };
      setCategories([...categories, newCat]);
      setNewCategory("");
    }
  };

  const addSubCategory = () => {
    if (newSubCategoryy && selectedCategory) {
      const newSubCat: SubCategoryDto = {
        subcategoryId: Date.now(), // Tạo ID giả
        subcategoryName: newSubCategoryy,
        description: "",
        categoryId: selectedCategory.categoryId,
      };
      setSubCategories([...subCategories, newSubCat]);
      setNewSubCategory("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing fields */}
      <input
        type="text"
        placeholder="Product Name"
        value={!checkProduct ? product?.name : productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* Existing fields continued */}
      <select
        value={selectedTargetCustomer?.targetCustomerName || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedCustomer = targetCustomers.find(
            (c) => c.targetCustomerName === selectedValue
          );
          setSelectedTargetCustomer(selectedCustomer);

          if (selectedCustomer) {
            setCategories(selectedCustomer.categories);
          }
        }}
        className="w-full p-2 rounded bg-gray-700 text-white"
      >
        <option value="">Chọn đối tượng</option>
        {targetCustomers.map((cat) => (
          <option key={cat.targetCustomerId} value={cat.targetCustomerName}>
            {cat.targetCustomerName}
          </option>
        ))}
      </select>

      {/* Category with Add Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <div className="flex space-x-2">
          <select
            name="category"
            value={selectedCategory?.name || ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedCategory = categories.find(
                (c) => c.name === selectedValue
              );
              setSelectedCategory(selectedCategory);

              if (selectedCategory) {
                setSubCategories(selectedCategory.subcategories);
              }
            }}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter new category"
            value={newCategoryy}
            onChange={(e) => handleInputCategory(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* SubCategory with Add Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          SubCategory
        </label>
        <div className="flex space-x-2">
          <select
            name="subcategory"
            value={selectedSubCategory?.subcategoryName || ""}
            onChange={(e) =>
              setSelectedSubCategory(
                subCategories.find((s) => s.subcategoryName === e.target.value)
              )
            }
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select a subcategory</option>
            {subCategories.map((cat, index) => (
              <option key={index} value={cat.subcategoryName}>
                {cat.subcategoryName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter new subcategory"
            value={newSubCategoryy}
            onChange={(e) => handleInputSubCategory(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={addSubCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Color with Add Color and Image Modal Button */}
      <div className="space-y-2">
        <select
          value=""
          onChange={(e) => {
            const selectedColor = colors.find((s) => s.name === e.target.value);
            if (selectedColor) {
              addColor(selectedColor);
            } else {
              console.error("Selected color not found!");
            }
          }}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select a color</option>
          {colors.map((color) => (
            <option key={color.colorId} value={color.name}>
              {color.name}
            </option>
          ))}
        </select>
        <div className="">
          {colorsChosen.map((color, index: number) => (
            <div
              key={index}
              className="w-full p-2 rounded bg-gray-700 text-white flex justify-between mt-2"
            >
              <span className="text-white mr-2">{color.name}</span>
              <div>
                <button
                  onClick={() => openForm(color)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit size={22} />
                </button>
                <button
                  onClick={() => removeColor(color)}
                  className="ml-2 text-red-400"
                >
                  <FiTrash size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button className="mb-2 text-red-500" onClick={closeForm}>
                Close
              </button>
              <div>
                <select
                  value={tmpSelectedSize?.sizeValue}
                  onChange={(e) => {
                    const selectedSize = sizes.find(
                      (s) => s.sizeValue === e.target.value
                    );
                    if (selectedSize) setTmpSelectedSize(selectedSize);
                  }}
                  className="border border-gray-400"
                >
                  <option value="">Select a size</option>
                  {sizes.map((size) => (
                    <option key={size.sizeId} value={size.sizeValue}>
                      {size.sizeValue}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={tmpInputQuantity}
                  onChange={(e) =>
                    setTmpInputQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="border border-blue-400 ml-2"
                  placeholder="Input quantity"
                />
                <button
                  className="bg-blue-500 text-white ml-2 px-4 py-1 rounded"
                  onClick={handleConfirm}
                >
                  OK
                </button>
              </div>

              <div>
                <strong>Selected:</strong>
                <div>
                  {productDetails[currentColor]?.adminSelectedSize.map(
                    (size, index) => (
                      <div key={index}>
                        {size.sizeValue}{" "}
                        {productDetails[currentColor]?.adminInputQuantity[
                          index
                        ] || 0}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-4">
                {[...Array(5)].map((_, index) => (
                  <div className="relative" key={index}>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleSelectImg(e.target.files)}
                    />
                    <div className="w-16 h-16 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                      {productDetails[currentColor]?.selectedImg[index] ? (
                        <div className="image-gallery">
                          <img
                            src={
                              productDetails[currentColor]?.selectedImg[index]
                            }
                            alt={`Selected Image ${index}`}
                            className="w-16 h-16 object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500 text-2xl font-bold">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 my-2 rounded"
                  onClick={handleClickSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* cost */}
      <input
        type="number"
        placeholder="Cost (VND)"
        value={!checkProduct ? product?.cost : cost}
        onChange={(e) => setCost(parseFloat(e.target.value) || 1)}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price (VND)"
        value={!checkProduct ? product?.price : price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* DiscountPercentage */}
      <input
        type="number"
        placeholder="Discount Percentage (0.01 - 0.9)"
        value={!checkProduct ? product?.discountPercentage : discountPercentage}
        onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
        step="0.01"
        min="0.01"
        max="0.9"
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* Unit */}
      <input
        type="text"
        placeholder="Unit"
        value={unit}
        onChange={(e) => handleInputUnit(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* Provider */}
      <select
        value={providersChosen?.providerCompanyName || ""}
        onChange={(e) => {
          const selectedProvider = providers.find(
            (p) => p.providerCompanyName === e.target.value
          );
          if (selectedProvider) handleAddProvider(selectedProvider);
        }}
        className="w-full p-2 rounded bg-gray-700 text-white"
      >
        <option value="">Select Provider</option>
        {providers.map((provider) => (
          <option
            key={provider.providerId}
            value={provider.providerCompanyName}
          >
            {provider.providerCompanyName}
          </option>
        ))}
      </select>

      {/* description */}
      <textarea
        placeholder="Enter product description"
        className="w-full p-2 rounded bg-gray-700 text-white"
        // value={!checkProduct && product?.description ? product.description : ""}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Existing Save Button */}
      <button
        onClick={handleSave}
        className="w-full p-2 bg-blue-500 rounded text-white"
      >
        Save Product
      </button>
    </div>
  );
};

export default ProductForm;
