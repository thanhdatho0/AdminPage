

export interface CategoryCreate{
    name: string;
    description: string;
}

export interface Color {
    colorId: number;
    hexaCode: string;
    name: string;
}

export interface Provider{
    providerId: number;
    providerEmail: string;
    providerPhone: string;
    providerCompanyName: string;
}

export interface Product {
    ProductId: number;
    name: string;
    Price: number;
    Description: string;
    Cost: number;
    Stock: number;
    isDeleted: boolean;
    CategoryId: number;
    ProviderId: number;
}

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
