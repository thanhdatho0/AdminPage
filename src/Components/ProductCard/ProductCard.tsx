import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { GetProduct } from "../../ShopModels";

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
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name || "Default Color"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    discountPercentage: product.discountPercentage || 0,
    cost: product.cost || 0,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/products/${product.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedProduct),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        onEdit(updatedProduct); // Notify parent of changes
        setIsEditing(false);
        window.location.reload();
      } else {
        console.error("Failed to update product:", await response.text());
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleShowImages = () => {
    const ColorWithImages = product.colors.find(
      (c) => c.name === selectedColor
    );
    const imagesForColor = ColorWithImages?.images?.map((i) => i.url) || [];
    handleImageButtonClick(imagesForColor);
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
                {product.sizes.map((x) => x.sizeValue).join(", ") || undefined}
              </p>
              <p>
                <span className="font-medium text-gray-400">Color:</span>{" "}
                {product.colors.map((c) => c.name).join(", ") || ""}
              </p>
              <p className="text-lg font-bold text-green-400 mt-2">
                Price: {product.price.toLocaleString() || undefined}₫
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <select
          value={selectedColor || ""}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          disabled={!product.colors || product.colors.length === 0}
        >
          {product.colors?.length > 0 ? (
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Show Images
        </button>
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
              onClick={handleEditToggle}
              className="p-2 rounded text-gray-400 hover:text-gray-600 transition-colors"
              title="Cancel"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditToggle}
              className="p-2 rounded text-blue-400 hover:text-blue-600 transition-colors"
              title="Edit Product"
            >
              <FiEdit size={22} />
            </button>
            <button
              onClick={() => onDelete(product.productId)}
              className="p-2 rounded text-red-400 hover:text-red-600 transition-colors"
              title="Delete Product"
            >
              <FiTrash size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
