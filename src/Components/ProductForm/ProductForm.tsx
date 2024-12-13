import { useContext, useEffect, useState } from "react";
// import { FaTimes } from "react-icons/fa";
import {
  BASE_URL,
  getAllCategories,
  getAllColors,
  getAllProducts,
  getAllProvider,
  getAllSizes,
  // getInventoryAll,
  // getTargetCustomerId,
} from "../../api.tsx";
import {
  AllCategoriesDto,
  CategoryDto,
  Color,
  GetProduct,
  // Inventory,
  Product,
  Provider,
  Size,
  SubCategoryDto,
} from "../../ShopModels";
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext.tsx";
// import { parse } from "dotenv";

interface Props {
  product?: Product;
  checkProduct: boolean;
}

const ProductForm: React.FC<Props> = ({ product, checkProduct }) => {
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
  const [products, setProducts] = useState<GetProduct[]>([]);
  // const [inventory, setInventory] = useState<Inventory[]>([]);
  const { user } = useContext(UserContext);

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

      const fetchProviders = async () => {
        const providers = await getAllProvider(user.accessToken);
        console.log("Providers fetched:", providers);
        setProviders(providers);
      };
      await fetchProviders();

      const fetchCategoriesResult = await getAllCategories().then(
        (data) => data?.data || []
      );
      setTargetCustomer(fetchCategoriesResult);

      const fetchProducts = await getAllProducts().then(
        (data) => data?.data || []
      );
      setProducts(fetchProducts);
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
      const fileURL = URL.createObjectURL(file); // Generate the blob URL for the image

      setProductDetails((prev) => {
        const currentImages = prev[currentColor]?.selectedImg || [];
        const nextImages = [...currentImages];

        const emptyIndex = nextImages.findIndex((img) => !img); // Find an empty slot
        if (emptyIndex !== -1) {
          nextImages[emptyIndex] = fileURL; // Place the new URL in the empty slot
        } else {
          nextImages.push(fileURL); // If no empty slot, push the new URL
        }

        return {
          ...prev,
          [currentColor]: {
            ...prev[currentColor],
            selectedImg: nextImages, // Update the state with the new image URL
          },
        };
      });
    }
  };

  const handleClickSave = async () => {
    const details = productDetails[currentColor];

    const hasSizes = details?.adminSelectedSize?.length > 0;
    const hasQuantities =
      details?.adminInputQuantity?.some((qty) => qty > 0) || false;
    const hasImages = details?.selectedImg?.some((img) => img) || false;

    if (!hasSizes || !hasQuantities) {
      alert("Vui lòng nhập đầy đủ size, số lượng");
      return;
    }

    // Retrieve the image details from productDetails
    const selectedImages = details.selectedImg;

    for (let i = 0; i < selectedImages.length; i++) {
      const imageURL = selectedImages[i];
      if (!imageURL) continue; // Skip empty slots

      try {
        // Convert the image URL to a file (Blob) for upload
        const response = await fetch(imageURL); // Get the blob from the image URL
        const blob = await response.blob();
        const file = new File([blob], `image-${currentColor}-${i}.jpg`, {
          type: blob.type,
        });

        // Prepare the FormData object to send to the server
        const formData = new FormData();
        formData.append("file", file); // Add the file
        formData.append("productId", String(4)); // Replace with dynamic productId
        formData.append("colorId", String(currentColor)); // Replace with dynamic colorId

        // Send the request to upload the image
        const uploadResponse = await fetch("http://localhost:5254/api/images", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorMessage = await uploadResponse.text();
          console.error("Error uploading image:", errorMessage);
          alert("Lỗi khi tải ảnh lên: " + errorMessage);
          return;
        }

        const uploadedImage = await uploadResponse.json();
        console.log("Uploaded image:", uploadedImage);

        // Update the state with the uploaded image URL
        setProductDetails((prev) => {
          const currentImages = prev[currentColor]?.selectedImg || [];
          const nextImages = [...currentImages];
          nextImages[i] = uploadedImage.url; // Update the image URL with the uploaded URL

          return {
            ...prev,
            [currentColor]: {
              ...prev[currentColor],
              selectedImg: nextImages, // Update the state with the new image URLs
            },
          };
        });

        console.log(
          `Image ${i + 1} uploaded successfully with URL ${uploadedImage.url}`
        );
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(`Lỗi khi tải ảnh lên: ${error.message}`);
      }
    }

    // Close the form after all images are uploaded
    closeForm();
  };

  const handleConfirm = () => {
    console.log(currentColor);
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
    } else {
      if (checkProduct) alert("Vui lòng chọn size và nhập số lượng!");
    }
    setTmpSelectedSize(null);
    setTmpInputQuantity("");
  };

  const handleSave = async () => {
    if (!productName.trim()) {
      alert("Tên sản phẩm là bắt buộc");
      return;
    }

    if (!selectedTargetCustomer) {
      alert("Vui lòng chọn đối tượng khách hàng");
      return;
    }

    if (!selectedCategory) {
      alert("Vui lòng chọn hoặc thêm danh mục");
      return;
    }

    if (!selectedSubCategory) {
      alert("Vui lòng chọn hoặc thêm danh mục con");
      return;
    }

    // if (colorsChosen.length === 0) {
    //   alert("Vui lòng chọn ít nhất một màu sắc");
    //   return;
    // }

    if (!cost || cost <= 0) {
      alert("Giá gốc phải lớn hơn 0");
      return;
    }

    if (!price || price <= 0) {
      alert("Giá bán phải lớn hơn 0");
      return;
    }

    if (discountPercentage < 0 || discountPercentage > 0.9) {
      alert("Giảm giá phải nằm trong khoảng 0.01 - 0.9");
      return;
    }

    if (!unit.trim()) {
      alert("Vui lòng nhập đơn vị sản phẩm");
      return;
    }

    if (!providersChosen) {
      alert("Vui lòng chọn nhà cung cấp");
      return;
    }

    if (!description.trim()) {
      alert("Vui lòng nhập mô tả sản phẩm");
      return;
    }
    if (productName === products.find((p) => p.name === productName)?.name) {
      alert("Sản phẩm trùng tên");
    } else {
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
          await axios.post(`${BASE_URL}/products`, JSON.stringify(productt), {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          });
        } else {
          await axios.put(
            `${BASE_URL}/products/${product?.productId}`,
            JSON.stringify(productt),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
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
    <div className="mt-4 mx-auto w-4/5 p-6 rounded-lg shadow-md bg-gray-900">
      {/* <div className="p-6 bg-gray-800 rounded-lg shadow-md"> */}
      <div className="space-y-4">
        {/* Existing fields */}
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => {
            const inputValue = e.target.value;
            setProductName(inputValue);
          }}
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
                  subCategories.find(
                    (s) => s.subcategoryName === e.target.value
                  )
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
              const selectedColor = colors.find(
                (s) => s.name === e.target.value
              );
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
              <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl">
                {/* Close Button */}
                <button
                  className="mb-4 text-red-500 hover:text-red-700 font-semibold self-end"
                  onClick={closeForm}
                >
                  Close ❌
                </button>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Select Size */}
                  <div className="flex items-center gap-4">
                    <select
                      value={tmpSelectedSize?.sizeValue || ""}
                      onChange={(e) => {
                        const selectedSize = sizes.find(
                          (s) => s.sizeValue === e.target.value
                        );
                        if (selectedSize) setTmpSelectedSize(selectedSize);
                      }}
                      className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
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
                      className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                      placeholder="Input quantity"
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={handleConfirm}
                    >
                      OK
                    </button>
                  </div>

                  {/* Selected Sizes */}
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <strong className="block mb-2 text-gray-800 text-lg font-semibold">
                      Selected Sizes
                    </strong>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
                      {productDetails[currentColor]?.adminSelectedSize.map(
                        (size, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center px-4 py-2 bg-white rounded-md border border-gray-300 shadow-sm hover:shadow-md"
                          >
                            <span className="font-medium text-gray-700">
                              Size:{" "}
                              <span className="text-blue-500">
                                {size.sizeValue}
                              </span>
                            </span>
                            <span className="font-medium text-gray-700">
                              Quantity:{" "}
                              <span className="text-green-500">
                                {productDetails[currentColor]
                                  ?.adminInputQuantity[index] || 0}
                              </span>
                            </span>
                          </div>
                        )
                      )}
                      {productDetails[currentColor]?.adminSelectedSize
                        .length === 0 && (
                        <div className="text-gray-500 text-sm italic">
                          No sizes selected yet. Please add a size above.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}

                  {/* Save Button */}
                  <div className="mt-4">
                    <button
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={handleClickSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* cost */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Cost
          </label>
          <input
            type="number"
            placeholder="Cost (VND)"
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Price
          </label>
          <input
            type="number"
            placeholder="Price (VND)"
            value={!checkProduct ? product?.price : price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* DiscountPercentage */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Discount Percentage
          </label>
          <input
            type="number"
            placeholder="Discount Percentage (0.01 - 0.9)"
            value={
              !checkProduct ? product?.discountPercentage : discountPercentage
            }
            onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
            step="0.01"
            min="0.01"
            max="0.9"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Unit
          </label>
          <input
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={(e) => handleInputUnit(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

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
        <Link
          to="/products"
          onClick={handleSave}
          className="p-2 bg-blue-500 rounded text-white block w-full text-center"
        >
          Save Product
        </Link>
      </div>
    </div>
    // </div>
  );
};

export default ProductForm;
