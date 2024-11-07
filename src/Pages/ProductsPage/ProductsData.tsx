// src/ProductsData.ts

export const products = [
  {
    id: '1',
    name: 'Casual T-Shirt',
    category: 'T-Shirts',
    gender: 'Nam',
    size: 'M',
    color: ['Blue', 'White'],
    price: 19999, // in VND
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/0000FF',
    ],
    provider: 'Provider A',
  },
  {
    id: '2',
    name: 'Classic Denim Jeans',
    category: 'Jeans',
    gender: 'Nữ',
    size: '32',
    color: ['Dark Blue', 'Light Blue'],
    price: 49999, // in VND
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/008000',
    ],
    provider: 'Provider B',
  },
  {
    id: '3',
    name: 'Leather Jacket',
    category: 'Jackets',
    gender: 'Nam',
    size: 'L',
    color: ['Black'],
    price: 129999, // in VND
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/FF0000',
    ],
    provider: 'Provider A',
  },
];
