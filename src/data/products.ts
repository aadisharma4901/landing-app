export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'bestseller' | 'new' | 'sale';
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'phones',
    price: 1199,
    rating: 4.8,
    reviews: 2341,
    badge: 'bestseller'
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    category: 'laptops',
    price: 2499,
    originalPrice: 2799,
    rating: 4.9,
    reviews: 1567,
    badge: 'sale'
  },
  {
    id: '3',
    name: 'Apple Watch Ultra 2',
    category: 'watches',
    price: 799,
    rating: 4.7,
    reviews: 892,
    badge: 'new'
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phones',
    price: 1299,
    rating: 4.6,
    reviews: 1876
  },
  {
    id: '5',
    name: 'Dell XPS 13',
    category: 'laptops',
    price: 1299,
    rating: 4.5,
    reviews: 1234
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    category: 'watches',
    price: 399,
    rating: 4.4,
    reviews: 756
  },
  {
    id: '7',
    name: 'Gaming PC RTX 4080',
    category: 'pcs',
    price: 2999,
    originalPrice: 3299,
    rating: 4.8,
    reviews: 543,
    badge: 'bestseller'
  },
  {
    id: '8',
    name: 'Intel Core i9-13900K',
    category: 'cpu',
    price: 589,
    rating: 4.7,
    reviews: 321
  },
  {
    id: '9',
    name: 'NVIDIA RTX 4090',
    category: 'gpu',
    price: 1599,
    rating: 4.9,
    reviews: 234,
    badge: 'new'
  },
  {
    id: '10',
    name: 'iPad Pro 12.9"',
    category: 'tablets',
    price: 1099,
    rating: 4.6,
    reviews: 987
  },
  {
    id: '11',
    name: 'Sony WH-1000XM5',
    category: 'headphones',
    price: 399,
    originalPrice: 449,
    rating: 4.8,
    reviews: 1456,
    badge: 'sale'
  },
  {
    id: '12',
    name: 'AirPods Pro (2nd gen)',
    category: 'earbuds',
    price: 249,
    rating: 4.5,
    reviews: 2134
  }
];

export const categories: Category[] = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'phones', name: 'Phones', count: products.filter(p => p.category === 'phones').length },
  { id: 'laptops', name: 'Laptops', count: products.filter(p => p.category === 'laptops').length },
  { id: 'watches', name: 'Watches', count: products.filter(p => p.category === 'watches').length },
  { id: 'pcs', name: 'Gaming PCs', count: products.filter(p => p.category === 'pcs').length },
  { id: 'cpu', name: 'Processors', count: products.filter(p => p.category === 'cpu').length },
  { id: 'gpu', name: 'Graphics Cards', count: products.filter(p => p.category === 'gpu').length },
  { id: 'tablets', name: 'Tablets', count: products.filter(p => p.category === 'tablets').length },
  { id: 'headphones', name: 'Headphones', count: products.filter(p => p.category === 'headphones').length },
  { id: 'earbuds', name: 'Earbuds', count: products.filter(p => p.category === 'earbuds').length }
];