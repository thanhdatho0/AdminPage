import axios from "axios";
import {
  AllCategoriesDto,
  Color,
  EmailRequest,
  GetProduct,
  Inventory,
  Provider,
  Size,
} from "./ShopModels";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export const BASE_URL = "https://team7api-v1-0-0.onrender.com/api";

export const getAllProducts = async (
  TargetCustomerId?: string | null,
  CategoryId?: string | null,
  SubcategoryId?: string | null
) => {
  try {
    return await axios.get<GetProduct[] | []>(`${BASE_URL}/products`, {
      params: {
        TargetCustomerId,
        CategoryId,
        SubcategoryId,
      },
    });
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
    return await axios.get<AllCategoriesDto[]>(`${BASE_URL}/targetCustomers`);
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
    return await axios.get<Color[]>(`${BASE_URL}/colors`);
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
    return await axios.get<Provider[]>(`${BASE_URL}/providers`);
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
    return await axios.get<Size[]>(`${BASE_URL}/sizes`);
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
      `${BASE_URL}/targetCustomers?subcategoryId=${id}`
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
      `${BASE_URL}/inventories/All?${params.toString()}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
};

export const changePassword = async (
  userName: string,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  token: string
) => {
  const payload = {
    userName,
    oldPassword,
    newPassword,
    confirmNewPassword,
  };

  try {
    const response = await fetch(`${BASE_URL}/account/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Mật khẩu ít nhất 8, chứa ký tự đặc biệt, chữ hoa"
      );
    }

    return response;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.message || "Không thể kết nối đến máy chủ.");
  }
};

export const refreshToken = async (accessToken: string) => {
  const response = await axios.post(
    `${BASE_URL}/Token/refresh`,
    {}, // Body request (trống vì bạn chỉ cần gửi token trong header)
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Thêm header Authorization
      },
      withCredentials: true, // Đảm bảo với Cookies nếu có
    }
  );
  return response;
};

export const sendEmail = async (emailRequest: EmailRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/EmailSender/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailRequest),
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
