export interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
    description?: string;
  };
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string;
  total_price: number;
  status: string;
  products: OrderItem[];
  created_at: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  totalProductsPurchased: number;
  lastPurchaseDate: string | null;
  latestOrder: {
    id: string;
    total_price: number;
    status: string;
    created_at: string;
  } | null;
  averageOrderValue: number;
  monthlySpending: number;
  cartTotalItems?: number;
}

export interface DashboardData {
  success: boolean;
  stats: DashboardStats;
  orders: Order[];
  recentlyPurchased: RecentlyPurchasedItem[];
}

export interface RecentlyPurchasedItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
  quantity: number;
  orderDate: string;
  orderId: string;
}

export type DashboardSection = 'overview' | 'orders' | 'settings';

export interface UserProfile {
  id?: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  createdAt?: string;
}

