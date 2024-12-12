import React, { useContext, useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

import { BASE_URL } from "../../api";

import { Color, GetProduct, Size } from "../../ShopModels";
import { getAllColors, getAllSizes } from "../../api";
import { UserContext } from "../UserContext/UserContext";

interface ProductCardProp {
  product: GetProduct;
  handleImageButtonClick: (images: string[]) => void;
  onEdit: (product: GetProduct) => void;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProp> = ({
  product,
  handleImageButtonClick,
  onEdit,
  onDelete,
}) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [tmpSelectedSize, setTmpSelectedSize] = useState<Size | null>(null);
  const [tmpInputQuantity, setTmpInputQuantity] = useState<number | "">("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    discountPercentage: product.discountPercentage || 0,
    cost: product.cost || 0,
  });
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [productDetails, setProductDetails] = useState<GetProduct | null>(null); // State to hold product details
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colorsResponse, sizesResponse] = await Promise.all([
          getAllColors(),
          getAllSizes(),
        ]);
        setColors(colorsResponse?.data || []);
        setSizes(sizesResponse?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        // Call the onDelete prop to remove the product from the list in the parent component
        onDelete(productId);
        console.log("Product deleted successfully.");
        window.location.reload(); // Consider optimizing this reload
      } else {
        console.error("Failed to delete product:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/products/${product.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(editedProduct),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        onEdit(updatedProduct);
        setIsEditing(false);
        window.location.reload(); // Consider optimizing this reload
      } else {
        console.error("Failed to update product:", await response.text());
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleShowImages = () => {
    // If no color is selected, fallback to the first color in the list (this could be any color like Blue, Cyan, etc.)
    const colorToUse = selectedColor || product.colors[0];

    // If no color is found (meaning no colors are available), log an error
    if (!colorToUse) {
      console.error("No color selected and no available colors.");
      return;
    }

    // Find the color object in the product's color list
    const colorWithImages = product.colors.find(
      (c) => c.name === colorToUse.name
    );

    // Check if the color has images, otherwise show a fallback or empty images
    if (
      colorWithImages &&
      colorWithImages.images &&
      colorWithImages.images.length > 0
    ) {
      // If images are available for the color, pass them to the parent handler
      const imagesForColor = colorWithImages.images.map((image) => image.url);
      handleImageButtonClick(imagesForColor);
    } else {
      // If no images are available for the selected/default color, show a message or a default image
      console.warn(`No images available for the color ${colorToUse.name}`);
      handleImageButtonClick([]); // or you can pass a placeholder image URL here
    }
  };
  const handleShowDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products/${product.productId}`);
      const productData = await response.json();
      setProductDetails(productData); // Set the detailed product data
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleClickSaveInventory = async () => {
    if (!selectedColor || !tmpSelectedSize || tmpInputQuantity === "") return;
    try {
      const response = await fetch(`${BASE_URL}/inventories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          productId: product.productId,
          colorId: selectedColor.colorId,
          sizeId: tmpSelectedSize.sizeId,
          quantity: tmpInputQuantity || 0,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Inventory updated successfully:", result);
        window.location.reload();
      } else {
        console.error("Failed to update inventory:", await response.text());
      }
    } catch (error) {
      console.error("Error while saving inventory:", error);
    }
  };

  return (
    <div
      key={product.productId}
      className="flex items-start space-x-6 p-6 bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <input
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Product Name"
            />
            <input
              name="price"
              type="number"
              value={editedProduct.price}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Price"
            />
            <input
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Description"
            />
            <input
              name="discountPercentage"
              type="number"
              value={editedProduct.discountPercentage}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Discount Percentage"
            />
            <input
              name="cost"
              type="number"
              value={editedProduct.cost}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Cost"
            />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white">
              {product.name || ""}
            </h2>
            <div className="text-sm text-gray-300 space-y-1 mt-2">
              <p>
                <span className="font-medium text-gray-400">Size:</span>{" "}
                {product.sizes.map((x) => x.sizeValue).join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-400">Color:</span>{" "}
                {product.colors.map((c) => c.name).join(", ") || "N/A"}
              </p>
              <p className="text-lg font-bold text-green-400 mt-2">
                Price: {product.price.toLocaleString() || "0"}₫
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4 w-full">
          <select
            value={selectedColor?.name || ""}
            onChange={(e) => {
              const color = colors.find((s) => s.name === e.target.value);
              setSelectedColor(color || null);
            }}
            className="flex-grow p-2 rounded bg-gray-700 text-white h-12"
            disabled={product.colors.length === 0}
          >
            {product.colors.length > 0 ? (
              product.colors.map((color) => (
                <option key={color.colorId} value={color.name}>
                  {color.name}
                </option>
              ))
            ) : (
              <option value="">No colors available</option>
            )}
          </select>
          <button
            onClick={handleShowImages}
            className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors h-12 w-40"
          >
            Show Images
          </button>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsAddingColor(true)}
            className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors h-12 w-40"
          >
            Add Color
          </button>
          <button
            onClick={handleShowDetails}
            className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors h-12 w-40"
          >
            View Details
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-2 rounded text-green-400 hover:text-green-600 transition-colors"
              title="Save"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded text-gray-400 hover:text-gray-600 transition-colors"
              title="Cancel"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded text-blue-400 hover:text-blue-600 transition-colors"
              title="Edit Product"
            >
              <FiEdit size={22} />
            </button>
            <button
              onClick={() => onDelete(product.productId)}
              className="p-2 rounded text-red-400 hover:text-red-600 transition-colors"
              onClick={() => handleDelete(product.productId)}
              title="Delete Product"
            >
              <FiTrash size={22} />
            </button>
          </>
        )}
      </div>

      {isAddingColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add Color</h2>
              <button
                className="text-white px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
                onClick={() => setIsAddingColor(false)}
              >
                ❌
              </button>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <label
                htmlFor="color"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Color
              </label>
              <select
                id="color"
                value={selectedColor?.name || ""}
                onChange={(e) => {
                  const color = colors.find((s) => s.name === e.target.value);
                  setSelectedColor(color || null);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a color</option>
                {colors.map((color) => (
                  <option key={color.colorId} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size and Quantity */}
            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="size"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Select Size
                </label>
                <select
                  id="size"
                  value={tmpSelectedSize?.sizeValue || ""}
                  onChange={(e) => {
                    const size = sizes.find(
                      (s) => s.sizeValue === e.target.value
                    );
                    setTmpSelectedSize(size || null);
                  }}
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a size</option>
                  {sizes.map((size) => (
                    <option key={size.sizeId} value={size.sizeValue}>
                      {size.sizeValue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="quantity"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={0}
                  value={tmpInputQuantity}
                  onChange={(e) =>
                    setTmpInputQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Input quantity"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleClickSaveInventory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Product Details */}
      {isModalOpen && productDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Details
              </h2>
              <button
                className="text-white px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
                onClick={closeModal}
              >
                ❌
              </button>
            </div>

            <div className="space-y-4 h-96 overflow-y-scroll p-4 border rounded bg-gray-100">
              <h3 className="text-xl font-semibold">{productDetails.name}</h3>
              <p>
                <strong>Price:</strong> {productDetails.price.toLocaleString()}₫
              </p>
              <p>
                <strong>Description:</strong> {productDetails.description}
              </p>
              <p>
                <strong>Cost:</strong> {productDetails.cost.toLocaleString()}₫
              </p>
              <p>
                <strong>Discount Percentage:</strong>{" "}
                {productDetails.discountPercentage * 100}%
              </p>
              <p>
                <strong>Quantity in Stock:</strong> {productDetails.quantity}
              </p>
              <p>
                <strong>In Stock:</strong> {productDetails.inStock}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(productDetails.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(productDetails.updatedAt).toLocaleString()}
              </p>
              <div>
                <strong>Colors:</strong>
                <ul>
                  {productDetails.colors.map((color) => (
                    <li key={color.colorId}>
                      <span style={{ color: color.hexaCode }}>
                        {color.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Sizes:</strong>
                <ul>
                  {productDetails.sizes.map((size) => (
                    <li key={size.sizeId}>{size.sizeValue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
