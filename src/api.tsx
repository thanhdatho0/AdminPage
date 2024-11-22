import axios from "axios";
import {GetProduct} from "./ShopModels";
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