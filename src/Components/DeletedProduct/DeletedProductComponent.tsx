import { useState, useEffect, useContext } from "react";
import { BASE_URL } from "../../api";
import { UserContext } from "../UserContext/UserContext";

type Product = {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  inStock: number;
  isDeleted: boolean;
  colors: {
    colorId: number;
    name: string;
    images: {
      imageId: number;
      url: string;
      alt: string;
    }[];
  }[];
};

const DeletedProductComponent = () => {
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logoutContext } = useContext(UserContext);

  // Fetch deleted products from the API
  useEffect(() => {
    const fetchDeletedProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products?IsDelete=true`);
        if (!response.ok) {
          throw new Error("Failed to fetch deleted products");
        }
        const data = await response.json();
        setDeletedProducts(data); // Set the deleted products from the API
        setIsLoading(false); // Stop loading when the data is fetched
      } catch (err) {
        setError("Failed to fetch deleted products");
        setIsLoading(false);
      }
    };

    fetchDeletedProducts();
  }, []);

  const restoreProduct = async (productId: number) => {
    try {
      // Send a PATCH request to restore the product using fetch
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE", // Use PATCH to update the product
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          isDeleted: false, // Set isDeleted to false to restore the product
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to restore product");
      }

      // After restoring, reload the page to reflect the changes
      window.location.reload();
    } catch (err) {
      console.error("Failed to restore product", err);
      logoutContext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl text-white font-bold mb-8">Deleted Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {deletedProducts.map((product) => (
          <div
            key={product.productId}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-[400px]"
          >
            <h3 className="text-xl text-white font-semibold mb-2">
              {product.name}
            </h3>
            <div className="flex-grow overflow-y-auto mb-4">
              <p className="text-white mb-2">{product.description}</p>
              <p className="text-white mb-2">Price: {product.price} VND</p>
              <p className="text-white mb-2">Quantity: {product.quantity}</p>
              <p className="text-white mb-4">In Stock: {product.inStock}</p>

              {/* Product Images */}
              <div className="mb-4">
                {product.colors.map((color) => (
                  <div key={color.colorId} className="mb-2">
                    <h4 className="text-white font-medium">{color.name}</h4>
                    <div className="flex space-x-2">
                      {color.images.map((image) => (
                        <img
                          key={image.imageId}
                          src={image.url}
                          alt={image.alt}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restore Button */}
            <button
              onClick={() => restoreProduct(product.productId)}
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletedProductComponent;
