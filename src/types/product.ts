export interface Product {
  id: number;
  name: string;
  category: 'watches' | 'phones' | 'laptops' | 'pcs' | 'cpu' | 'gpu';
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  badge?: 'bestseller' | 'new' | 'sale';
  description: string;
  imageUrl: string;
  specifications: { label: string; value: string }[];
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
