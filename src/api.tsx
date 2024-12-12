import axios from "axios";
import {
  AllCategoriesDto,
  Color,
  GetProduct,
  Inventory,
  Provider,
  Size,
} from "./ShopModels";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export const getAllProducts = async (
  TargetCustomerId?: string | null,
  CategoryId?: string | null,
  SubcategoryId?: string | null
) => {
  try {
    return await axios.get<GetProduct[] | []>(
      "http://localhost:5254/api/products",
      {
        params: {
          TargetCustomerId,
          CategoryId,
          SubcategoryId,
        },
      }
    );
  } catch {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getAllCategories = async () => {
  try {
    return await axios.get<AllCategoriesDto[]>(
      "http://localhost:5254/api/targetCustomers"
    );
  } catch {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getAllColors = async () => {
  try {
    return await axios.get<Color[]>("http://localhost:5254/api/colors");
  } catch {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getAllProvider = async () => {
  try {
    return await axios.get<Provider[]>("http://localhost:5254/api/providers");
  } catch {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getAllSizes = async () => {
  try {
    return await axios.get<Size[]>("http://localhost:5254/api/sizes");
  } catch {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getTargetCustomerId = async (id: number) => {
  try {
    return await axios.get<AllCategoriesDto[]>(
      `http://localhost:5254/api/targetCustomers?subcategoryId=${id}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const getInventoryAll = async (
  productId?: number,
  colorId?: number,
  sizeId?: number
) => {
  try {
    const params = new URLSearchParams();
    if (productId !== undefined)
      params.append("productId", productId.toString());
    if (colorId !== undefined) params.append("colorId", colorId.toString());
    if (sizeId !== undefined) params.append("sizeId", sizeId.toString());

    return await axios.get<Inventory[]>(
      `http://localhost:5254/api/inventories/All?${params.toString()}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};
