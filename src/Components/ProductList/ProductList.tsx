import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ImageModal from "../ProductCard/ImageModal";
import { GetProduct } from "../../ShopModels";
import Search from "../Search/Search";

interface ProductListProps {
  products: GetProduct[];
  onEdit: (product: GetProduct) => void;
  onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Store the search query
  const [filteredProducts, setFilteredProducts] =
    useState<GetProduct[]>(products); // Filtered list of products

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string | undefined>(""); // Track selected color for modal

  // Filter products whenever the search query or the products change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products); // Show all products if search is empty
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by product name
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleImageButtonClick = (images: string[], color?: string) => {
    setCurrentImages(images);
    setCurrentColor(color);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImages([]);
    setCurrentColor("");
  };

  // Update the search query when the Search component triggers this function
  const handleSearchChange = (query: string) => {
    setSearchQuery(query); // Update the search query
  };

  return (
    <>
      {/* Search Bar */}
      <Search onSearchChange={handleSearchChange} />

      {/* Product List */}
      <div className="space-y-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            handleImageButtonClick={(images) =>
              handleImageButtonClick(images, product.colors[0].name)
            } // Pass color-specific images
          />
        ))}

        {/* Image Modal */}
        {isModalOpen && (
          <ImageModal
            images={currentImages}
            color={currentColor}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};

export default ProductList;
