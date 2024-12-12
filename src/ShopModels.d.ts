

export interface CategoryCreate{
    name: string;
    description: string;
}

export interface Color {
    colorId: number;
    hexaCode: string;
    name: string;
    images: Image[];
}

export interface Provider{
    providerId: number;
    providerEmail: string;
    providerPhone: string;
    providerCompanyName: string;
}

// export interface Product {
//     ProductId: number;
//     name: string;
//     Price: number;
//     Description: string;
//     Cost: number;
//     Stock: number;
//     isDeleted: boolean;
//     CategoryId: number;
//     ProviderId: number;
// }

export interface ProductCreateDto{
    name: string;
    price: number;
    description?: string;
    cost: number;
    discountPercentage: number;
    unit: string;
    subcategoryId: number;
    providerId: number;
    inventory: InventoryCreateDto[];
}

export interface InventoryCreateDto{
    color: ColorToProductDto;
    sizeId: number;
    quantity: number;
}

export interface ColorToProductDto{
    colorId: number;
    images: ImageCreateToProductDto;
}

export interface ImageCreateToProductDto{
    url: string;
    alt: string;
}


export interface Image {
    imageId: number;
    url: string;
    alt: string;
    productId: number;
    colorId: number;
}

export interface Size {
    sizeId: number;
    sizeValue: string;
}

export interface GetProductColor{
    colorId: number;
    hexaCode: string;
    name: string;
    images: Image[];
}

export interface GetProduct {
  productId: number;
  name: string;
  price: number;
  description?: string;
  cost: number;
  discountPercentage: number;
  inStock: number;
  isDeleted: boolean;
  subcategoryId: number;
  providerId: number;
  sizes: Size[];
  colors: GetProductColor[];
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubCategoryDto{
    subcategoryId: number;
    subcategoryName: string;
    description: string;
    categoryId: number;
}

export interface CategoryDto{
    categoryId: number;
    name: string;
    targetCustomerId: number;
    subcategories: SubCategoryDto[];
}

export interface AllCategoriesDto {
    targetCustomerId: number;
    targetCustomerName: string;
    url: string;
    alt: string;
    categories: CategoryDto[];
}

// export interface Product{
//     name: string;
//     price: number;
//     description: string;
//     cost: number;
//     unit: string;
//     targetCustomerId: number;
//     discountPercentage: number;
//     newCategory?: string;
//     newSubcategory?: string;
//     categoryId: number;
//     subcategoryId: number;
//     providerId: number;
//     inventory: ProductInventory[];
// }

export interface Product {
    productId: number;
    name: string;
    subcategoryName: string;
    price: number;
    description: string;
    cost: number;
    discountPercentage: number;
    inStock: number;
    isDeleted: boolean;
    createdAt: string; 
    updatedAt: string; 
    subcategoryId: number;
    providerId: number;
    sizes: Size[];
    colors: Color[];
  }

type ProductInventory = {
    color: {
      colorId: number; 
      images: {
        url: string; 
        alt: string; 
      }[];
    };
    sizes: {
      sizeId: number; 
      quantity: number; 
    }[];
  };

  export interface CategoryItem {
    categoryId: number;
    name: string;
    targetCustomerId: number;
  }
  
  export interface TargetCustomer {
    targetCustomerId: number;
    targetCustomerName: string;
    url: string;
    alt: string;
    categories: CategoryItem[];
  }
  
  export interface Inventory{
    quantity: number;
    inStock: number;
    inventoryId: number;
    productId: number;
    colorId: number;
    sizeId: number;
  }

export  interface EmailRequest {
    email: string;
    username: string;
  }

 export interface User {
    isAuthenticated: boolean;
    accessToken: string;
    username: string;
  }

  
export  interface UserContextType {
    user: User;
    loginContext: (userData: User) => void;
    logoutContext: () => void;
  }
