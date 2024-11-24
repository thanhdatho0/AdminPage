export interface Category {
    categoryId: number;
    name: string;
    description: string;
}

export interface CategoryCreate{
    name: string;
    description: string;
}

export interface Color {
    colorId: number;
    hexaCode: string;
    name: string;
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

export interface Image {
    imageId: number;
    url: string;
    alt: string;
    productId: number;
    colorId: number;
}

export interface ProductColor {
    ProductId: number;
    ColorId: number;
}

export interface Size {
    sizeId: number;
    sizeValue: string;
}

export interface ProductSize {
    SizeId: number;
    ProductId: number;
}

export interface Material {
    materialId: number;
    materialType: string;
}

export interface ProductMaterial {
    ProductId: number;
    MaterialId: number;
}

export interface GetProductColor{
    colorId: number;
    hexaCode: string;
    name?: string;
    images: Image[];
}

export interface GetProduct {
    productId: number;
    name?: string;
    price: number;
    description: string;
    cost: number;
    stock: number;
    isDeleted: boolean;
    categoryId: number;
    providerId: number;
    sizes: Size[];
    materials: Material[];
    colors: GetProductColor[];
}
