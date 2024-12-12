import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Color, GetProduct, Size } from "../../ShopModels";
import { getAllColors, getAllSizes } from "../../api";

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
  const [colors, setColor] = useState<Color[]>([]);
  const [colorsChosen, setColorChosen] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [sizes, setSizes] = useState<Size[]>([]);
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
  const [clickAddColor, setClickAddColor] = useState(false);

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
    };
    fetchData().then();
  }, []);

  const addColor = (color: Color) => {
    if (colors && !colorsChosen.includes(color)) {
      setColorChosen((prevChosen) => {
        if (color && !prevChosen.includes(color)) {
          return [...prevChosen, color];
        }
        return prevChosen;
      });
    }
  };

  const handleClickOpenAddColor = () => {
    setClickAddColor(true);
  };

  const handleClickCloseAddColor = () => {
    setClickAddColor(false);
  };

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
      (c) => c.name === selectedColor?.name
    );
    const imagesForColor = ColorWithImages?.images?.map((i) => i.url) || [];
    handleImageButtonClick(imagesForColor);
  };

  const handleClickSave = async () => {
    try {
      handleClickCloseAddColor();

      console.log(product.productId);
      console.log(selectedColor);
      console.log(tmpSelectedSize?.sizeId);
      console.log(tmpInputQuantity);
      const response = await fetch(`http://localhost:5254/api/inventories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          colorId: selectedColor?.colorId,
          sizeId: tmpSelectedSize?.sizeId,
          quantity: tmpInputQuantity || 0,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Inventory updated successfully:", result);
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
          value={selectedColor?.name || ""}
          onChange={(e) => {
            const selectedColor = colors.find((s) => s.name === e.target.value);
            setSelectedColor(selectedColor);
          }}
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
        >
          Show Images
        </button>

        <button
          onClick={handleClickOpenAddColor}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
        >
          Add Color
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
      {clickAddColor ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add Color</h2>
              <button
                className="text-white px-4 py-2 rounded-full  hover:bg-gray-200 transition duration-300"
                onClick={handleClickCloseAddColor}
              >
                ❌
              </button>
            </div>

            {/* Color */}
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
                  const selectedColor = colors.find(
                    (s) => s.name === e.target.value
                  );
                  if (selectedColor) {
                    setSelectedColor(selectedColor);
                    addColor(selectedColor);
                  } else {
                    console.error("Selected color not found!");
                  }
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
                    const selectedSize = sizes.find(
                      (s) => s.sizeValue === e.target.value
                    );
                    if (selectedSize) setTmpSelectedSize(selectedSize);
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
                onClick={handleClickSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductCard;
