// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  stock: number;
  isQuoteOnly?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}