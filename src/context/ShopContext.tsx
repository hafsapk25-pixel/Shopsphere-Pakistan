import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, User, Coupon, NotificationItem, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_USERS, INITIAL_ORDERS } from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ShopContextType {
  // Navigation & Views
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategory: ProductCategory | null;
  setSelectedCategory: (cat: ProductCategory | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  policyModal: string | null;
  setPolicyModal: (policy: string | null) => void;
  trackOrderModalOpen: boolean;
  setTrackOrderModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Pricing & Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & User
  currentUser: User | null;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authDefaultTab: 'login' | 'register';
  setAuthDefaultTab: (tab: 'login' | 'register') => void;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  placeOrder: (orderPayload: any) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: string, note?: string) => Promise<boolean>;
  trackingId: string;
  setTrackingId: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotifRead: (id: string) => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Helpers
  formatPKR: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_FEE = 250;

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [policyModal, setPolicyModal] = useState<string | null>(null);
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string>('');

  // Cart Drawer & Auth Modal
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Products state (seeded initially from initialData, synced with backend)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch {
      // Fallback already in memory
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Hafsa Khan by default for instant delight
    } catch {
      return INITIAL_USERS[1];
    }
  });

  const login = async (emailOrPhone: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setAuthModalOpen(false);
        refreshOrders();
        return { success: true };
      } else {
        showToast(data.error || 'Login failed', 'error');
        return { success: false, message: data.error };
      }
    } catch (err: any) {
      showToast('Network error during login', 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
        showToast(`Account created successfully! Welcome to Shopsphere.`, 'success');
        setAuthModalOpen(false);
        return { success: true };
      } else {
        showToast(data.error || 'Registration failed', 'error');
        return { success: false, message: data.error };
      }
    } catch (err: any) {
      showToast('Network error during registration', 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('shopsphere_user');
    showToast('Logged out successfully', 'info');
    if (currentView === 'admin' || currentView === 'dashboard') {
      setCurrentView('home');
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.user) {
        setCurrentUser(resData.user);
        localStorage.setItem('shopsphere_user', JSON.stringify(resData.user));
        showToast('Profile updated successfully', 'success');
        return true;
      }
    } catch {
      // Offline fallback
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      localStorage.setItem('shopsphere_user', JSON.stringify(updated));
      showToast('Profile updated locally', 'success');
      return true;
    }
    return false;
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopsphere_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    if (product.stock <= 0) {
      showToast('Sorry, this item is out of stock', 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (it) =>
          it.product.id === product.id &&
          it.selectedSize === selectedSize &&
          it.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        if (newQty === currentQty) {
          showToast(`Maximum available stock (${product.stock}) reached for this item`, 'info');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        showToast(`Updated quantity in cart (${newQty})`, 'success');
        return updated;
      }

      const addQty = Math.min(product.stock, quantity);
      showToast(`Added "${product.name}" to your cart`, 'success');
      return [...prev, { product, quantity: addQty, selectedSize, selectedColor }];
    });

    setCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (it) =>
          !(
            it.product.id === productId &&
            it.selectedSize === selectedSize &&
            it.selectedColor === selectedColor
          )
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart((prev) =>
      prev.map((it) => {
        if (
          it.product.id === productId &&
          it.selectedSize === selectedSize &&
          it.selectedColor === selectedColor
        ) {
          const clamped = Math.min(it.product.stock, quantity);
          if (clamped < quantity) {
            showToast(`Only ${it.product.stock} items left in stock`, 'info');
          }
          return { ...it, quantity: clamped };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopsphere_wishlist');
      return saved ? JSON.parse(saved) : ['prod-wc-1', 'prod-bc-1'];
    } catch {
      return ['prod-wc-1', 'prod-bc-1'];
    }
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('shopsphere_wishlist', JSON.stringify(next));
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️', 'info');
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Pricing & Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const subtotal = cart.reduce((sum, it) => sum + it.product.discountedPrice * it.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Delivery charge rule: Standard Rs. 250, FREE if subtotal >= 3,000 OR coupon is FREESHIP
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.code === 'FREESHIP';
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
        return { success: false, message: data.message };
      }
    } catch {
      // Offline fallback lookup
      const found = INITIAL_COUPONS.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
      );
      if (found && subtotal >= found.minSpend) {
        setAppliedCoupon(found);
        showToast(`Coupon ${found.code} applied!`, 'success');
        return { success: true, message: 'Coupon applied successfully' };
      }
      showToast('Could not apply coupon', 'error');
      return { success: false, message: 'Invalid or ineligible coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const refreshOrders = async () => {
    try {
      const url = currentUser?.role === 'admin' ? '/api/orders' : `/api/orders?userId=${currentUser?.id || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch {
      // Use in-memory state
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [currentUser]);

  const placeOrder = async (orderPayload: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderPayload,
          subtotal,
          discountAmount,
          couponCode: appliedCoupon?.code,
          shippingFee,
          totalAmount
        })
      });
      const data = await res.json();
      if (res.ok && data.order) {
        clearCart();
        setAppliedCoupon(null);
        setOrders((prev) => [data.order, ...prev]);
        refreshProducts();
        showToast(`Order #${data.order.orderNumber} confirmed!`, 'success');
        return { success: true, order: data.order };
      } else {
        showToast(data.error || 'Failed to place order', 'error');
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      showToast('Error placing order', 'error');
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        refreshOrders();
        refreshProducts();
        showToast(`Order status updated to "${status}"`, 'success');
        return true;
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status as any } : o))
      );
      showToast(`Order status changed to "${status}"`, 'success');
      return true;
    }
    return false;
  };

  // Product CRUD (Admin)
  const addProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        await refreshProducts();
        showToast('Product added successfully', 'success');
        return true;
      }
    } catch {
      showToast('Error adding product', 'error');
    }
    return false;
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        await refreshProducts();
        showToast('Product updated successfully', 'success');
        return true;
      }
    } catch {
      showToast('Error updating product', 'error');
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshProducts();
        showToast('Product deleted', 'info');
        return true;
      }
    } catch {
      showToast('Error deleting product', 'error');
    }
    return false;
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'all',
      title: 'Grand Festive Sale is Live!',
      message: 'Enjoy up to 30% off across Beauty, Eastern Fashion, and Home Living. Use code WELCOME10 for an extra 10% discount.',
      type: 'promo',
      isRead: false,
      createdAt: '2026-11-08T08:00:00.000Z'
    },
    {
      id: 'notif-2',
      userId: 'user-customer-1',
      title: 'Order PK-918241 Shipped!',
      message: 'Your order has been dispatched with TCS Express tracking number TCS-PK-9821447. Delivery expected in 24-48 hours.',
      type: 'order',
      isRead: false,
      createdAt: '2026-11-08T10:15:00.000Z',
      link: 'track-order'
    }
  ]);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const markNotifRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // In-memory already updated
    }
  };

  // Format Pakistani Rupee helper
  const formatPKR = (amount: number) => {
    return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        policyModal,
        setPolicyModal,
        trackOrderModalOpen,
        setTrackOrderModalOpen,
        searchQuery,
        setSearchQuery,
        products,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartDrawerOpen,
        setCartDrawerOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        login,
        register,
        logout,
        updateUserProfile,
        authModalOpen,
        setAuthModalOpen,
        authDefaultTab,
        setAuthDefaultTab,
        orders,
        refreshOrders,
        placeOrder,
        updateOrderStatus,
        trackingId,
        setTrackingId,
        notifications,
        unreadNotifsCount,
        markNotifRead,
        toasts,
        showToast,
        formatPKR
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
