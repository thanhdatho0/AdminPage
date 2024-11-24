import axios from "axios";
import {Category, CategoryCreate, Color, GetProduct} from "./ShopModels";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


export const getAllProducts = async () => {
    try {
        return await axios.get<GetProduct[]>(
            "http://localhost:5254/api/products"
        );
    }
    catch {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
        }else {
            console.log(error);
        }
    }
}

export const getAllCategories = async () => {
    try {
        return await axios.get<Category[]>(
            "http://localhost:5254/api/categories"
        );
    }catch {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export const getAllColors = async () => {
    try {
        return await axios.get<Color[]>(
            "http://localhost:5254/api/colors"
        );
    }
    catch {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
        }else {
            console.log(error);
        }
    }
}

export const createCategory = async (category: CategoryCreate) => {
    try {
        return await axios.post<Color>(
            "http://localhost:5254/api/colors",
            category
        );
    }catch {
        if (axios.isAxiosError(error)) {
            console.log(error.message);
        }else {
            console.log(error);
        }
    }

}