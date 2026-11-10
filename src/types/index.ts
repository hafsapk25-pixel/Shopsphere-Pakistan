export type ProductCategory = 
  | 'Beauty & Cosmetics'
  | "Women's Clothing"
  | "Men's Clothing"
  | 'Shoes'
  | 'Bags'
  | 'Electronics'
  | 'Home & Living'
  | 'Jewelry & Accessories';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  description: string;
  originalPrice: number; // in PKR
  discountedPrice: number; // in PKR
  discountPercentage: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sizes?: string[];
  colors?: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 
  | 'Cash on Delivery (COD)'
  | 'Bank Transfer'
  | 'Easypaisa'
  | 'JazzCash'
  | 'Online Card Payment';

export type PaymentStatus = 'Pending (COD)' | 'Paid' | 'Awaiting Verification' | 'Failed' | 'Refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "PK-849201"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderStatus: OrderStatus;
  courierName?: string;
  courierTrackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  history: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
  savedAddresses?: ShippingAddress[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userCity?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  approved: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 15) or PKR amount (e.g. 500)
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // "all", "admin", or specific user ID
  title: string;
  message: string;
  type: 'order' | 'promo' | 'inventory' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
