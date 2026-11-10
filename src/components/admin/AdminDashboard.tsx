import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, Product, ProductCategory, OrderStatus } from '../../types';
import { PAKISTAN_CITIES } from '../../data/initialData';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Tag, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  X,
  Save,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    refreshOrders, 
    refreshProducts, 
    updateOrderStatus, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    formatPKR, 
    showToast,
    currentUser,
    setCurrentView 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'inventory' | 'coupons'>('overview');

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Status Update Modal State
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [courierName, setCourierName] = useState('TCS Express Pakistan');
  const [courierTracking, setCourierTracking] = useState('');

  // Add / Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Beauty & Cosmetics');
  const [prodSubcategory, setProdSubcategory] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(3000);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number>(2400);
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodImage, setProdImage] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  // Users State
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch registered users
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setRegisteredUsers(data.users);
      })
      .catch(() => {});
  }, [orders]);

  // Metrics Calculations
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const match =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdCategory(product.category);
      setProdSubcategory(product.subcategory);
      setProdBrand(product.brand);
      setProdDesc(product.description);
      setProdPrice(product.originalPrice);
      setProdDiscountPrice(product.discountedPrice);
      setProdStock(product.stock);
      setProdImage(product.image);
      setProdFeatured(!!product.isFeatured);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdCategory('Beauty & Cosmetics');
      setProdSubcategory('Skincare');
      setProdBrand('Shopsphere Signature');
      setProdDesc('');
      setProdPrice(4500);
      setProdDiscountPrice(3600);
      setProdStock(15);
      setProdImage('/src/assets/images/product_beauty_skincare_1794241400871.jpg');
      setProdFeatured(true);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        subcategory: prodSubcategory,
        brand: prodBrand,
        description: prodDesc,
        originalPrice: Number(prodPrice),
        discountedPrice: Number(prodDiscountPrice || prodPrice),
        stock: Number(prodStock),
        image: prodImage || editingProduct.image,
        isFeatured: prodFeatured
      });
    } else {
      await addProduct({
        name: prodName,
        category: prodCategory,
        subcategory: prodSubcategory,
        brand: prodBrand,
        description: prodDesc,
        originalPrice: Number(prodPrice),
        discountedPrice: Number(prodDiscountPrice || prodPrice),
        stock: Number(prodStock),
        image: prodImage || '/src/assets/images/product_beauty_skincare_1794241400871.jpg',
        isFeatured: prodFeatured
      });
    }
    setProductModalOpen(false);
  };

  const handleUpdateOrderStatusSubmit = async () => {
    if (!updatingOrderId) return;
    await updateOrderStatus(
      updatingOrderId, 
      newStatus, 
      `Status updated by store administrator. Courier: ${courierName}`,
    );
    setUpdatingOrderId(null);
  };

  const exportOrdersToCSV = () => {
    const headers = ['Order Number,Customer Name,Phone,City,Total PKR,Payment Method,Payment Status,Order Status,Date'];
    const rows = orders.map((o) =>
      `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.shippingAddress.city}",${o.totalAmount},"${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}","${new Date(o.createdAt).toLocaleDateString()}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopsphere_pakistan_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV file successfully', 'success');
  };

  const handleRestock = async (productId: string, currentStock: number) => {
    await updateProduct(productId, { stock: currentStock + 10 });
    showToast('Added +10 units to stock', 'success');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Console Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-400">
              Store Owner Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Shopsphere Pakistan Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time management for customer orders, inventory stock, catalogue, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportOrdersToCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Orders CSV</span>
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-xs font-bold text-white rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-4 mb-6 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
          {pendingOrders > 0 && (
            <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center">
              {pendingOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Inventory Alerts ({lowStockProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'customers'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Revenue</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-purple-950 mt-1">
                {formatPKR(totalSales)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% this festive season
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Orders</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {orders.length}
              </p>
              <span className="text-[11px] text-purple-700 font-medium mt-1 block">
                {deliveredOrders} delivered successfully
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Pending Fulfillment</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-pink-600 mt-1">
                {pendingOrders}
              </p>
              <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                Requires packing & courier dispatch
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Catalog & Stock</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {products.length} Products
              </p>
              <span className="text-[11px] text-rose-600 font-medium mt-1 block">
                {lowStockProducts.length} low-stock alerts
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-base font-bold text-slate-900">Recent Customer Purchases</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-pink-600 font-bold hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-purple-50/60 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-purple-900">{order.orderNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="p-3 text-slate-700">{order.shippingAddress.city}</td>
                      <td className="p-3 font-mono">{order.items.reduce((s, it) => s + it.quantity, 0)} pcs</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{formatPKR(order.totalAmount)}</td>
                      <td className="p-3 text-[11px]">
                        <div>{order.paymentMethod}</div>
                        <span className="text-[10px] text-slate-400">{order.paymentStatus}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 hover:bg-purple-100 text-purple-700 rounded-lg"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setUpdatingOrderId(order.id);
                            setNewStatus(order.orderStatus);
                          }}
                          className="px-2.5 py-1 bg-purple-900 text-white rounded-lg text-[11px] font-bold"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT (CRITICAL) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Order Management</h3>
              <p className="text-xs text-slate-500">
                Incoming purchases from all customers nationwide. Confirm, dispatch, or track parcels.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by ID, Name, Phone..."
                  className="text-xs pl-8 pr-3 py-2 rounded-xl border border-purple-200 bg-purple-50/20"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-purple-200 bg-white font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-purple-50/60 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer & Contact</th>
                  <th className="p-3">Shipping Address</th>
                  <th className="p-3">Products Ordered</th>
                  <th className="p-3">Total Payable</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-purple-900">{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-600">{order.customerPhone}</div>
                      <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                    </td>

                    <td className="p-3 max-w-xs">
                      <p className="text-[11px] text-slate-700 line-clamp-2">{order.shippingAddress.address}</p>
                      <span className="font-bold text-purple-900 text-[10px]">{order.shippingAddress.city}</span>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-mono font-bold text-purple-700">{it.quantity}x</span>
                            <span className="truncate max-w-[140px]">{it.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-mono font-bold text-pink-600 text-sm">
                        {formatPKR(order.totalAmount)}
                      </span>
                      {order.discountAmount > 0 && (
                        <div className="text-[10px] text-emerald-600">Saved: -{formatPKR(order.discountAmount)}</div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold">{order.paymentMethod}</div>
                      <span className="text-[10px] text-slate-400">{order.paymentStatus}</span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setUpdatingOrderId(order.id);
                          setNewStatus(order.orderStatus);
                          setCourierTracking(order.courierTrackingNumber || `TCS-${order.orderNumber}`);
                        }}
                        className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-bold"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Product Catalog Management</h3>
              <p className="text-xs text-slate-500">Add, edit pricing, update stock levels, or manage categories.</p>
            </div>

            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl border border-purple-100 bg-white hover:border-pink-200 shadow-2xs flex gap-3"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">{prod.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                    <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                      <span className="font-bold text-xs text-slate-900">{formatPKR(prod.discountedPrice)}</span>
                      {prod.originalPrice > prod.discountedPrice && (
                        <span className="text-[10px] text-slate-400 line-through">{formatPKR(prod.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className={`text-[10px] font-bold ${prod.stock <= 5 ? 'text-red-600' : 'text-slate-600'}`}>
                      Stock: {prod.stock}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenProductModal(prod)}
                        className="p-1 text-slate-500 hover:text-purple-700"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1 text-slate-500 hover:text-red-600"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY ALERTS */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Inventory Stock & Alerts</h3>
              <p className="text-xs text-slate-500">
                Products with 10 or fewer units in warehouse stock. Instant 1-click restock available.
              </p>
            </div>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              {lowStockProducts.length} Attention Needed
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                    <p className="text-[11px] text-slate-500">{p.brand} · {p.category}</p>
                    <span className="text-xs font-mono font-bold text-rose-600">
                      Current Units: {p.stock}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestock(p.id, p.stock)}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Restock (+10 units)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REGISTERED CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Registered Customers Directory</h3>
            <p className="text-xs text-slate-500">Contact information, locations, and total order volume.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-purple-50/60 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registeredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-50/20">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3 text-slate-600">{u.phone}</td>
                    <td className="p-3 font-semibold text-purple-900">{u.city || 'Karachi'}</td>
                    <td className="p-3 font-mono font-bold">{u.orderCount || 1} orders</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE ORDER STATUS */}
      {updatingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <h3 className="text-sm font-bold text-slate-900">Update Order Status</h3>
              <button onClick={() => setUpdatingOrderId(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled (Restores Inventory)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white"
              >
                <option value="TCS Express Pakistan">TCS Express Pakistan</option>
                <option value="Leopards Courier">Leopards Courier</option>
                <option value="Trax Logistics">Trax Logistics</option>
                <option value="Call Courier">Call Courier</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Tracking Number / Airway Bill</label>
              <input
                type="text"
                value={courierTracking}
                onChange={(e) => setCourierTracking(e.target.value)}
                placeholder="e.g. TCS-PK-98214"
                className="w-full text-xs p-2.5 rounded-xl border border-purple-200 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setUpdatingOrderId(null)}
                className="flex-1 py-2 text-xs border border-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrderStatusSubmit}
                className="flex-1 py-2 text-xs font-bold bg-pink-600 text-white rounded-xl shadow-md"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg my-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                  placeholder="e.g. Velvet Embroidered Kurti"
                  className="w-full text-xs p-2 rounded-xl border border-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-white"
                  >
                    <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                    <option value="Women's Clothing">Women's Clothing</option>
                    <option value="Men's Clothing">Men's Clothing</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={prodSubcategory}
                    onChange={(e) => setProdSubcategory(e.target.value)}
                    placeholder="e.g. Skincare, Heels"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="e.g. Khaadi, Sapphire"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    min={0}
                    className="w-full text-xs p-2 rounded-xl border border-purple-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Original Price (PKR) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    required
                    className="w-full text-xs p-2 rounded-xl border border-purple-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Discounted Price (PKR)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-purple-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="/src/assets/images/... or https://..."
                  className="w-full text-xs p-2 rounded-xl border border-purple-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Describe quality, fabric, or specifications..."
                  className="w-full text-xs p-2 rounded-xl border border-purple-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  className="rounded accent-pink-600"
                />
                <label htmlFor="featured" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Feature on Homepage Hero & Trending Grid
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-pink-600 text-white rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT INVOICE */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">Tax Invoice</h3>
                <p className="text-xs text-slate-500">Shopsphere Pakistan (Pvt.) Ltd. · NTN: 882194-7</p>
              </div>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">Billed To:</span>
                <p>{selectedOrderForInvoice.customerName}</p>
                <p>{selectedOrderForInvoice.customerPhone}</p>
                <p className="max-w-[200px]">{selectedOrderForInvoice.shippingAddress.address}, {selectedOrderForInvoice.shippingAddress.city}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800">Order ID:</span>
                <p className="font-mono font-bold text-purple-900">{selectedOrderForInvoice.orderNumber}</p>
                <p>{new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                <p className="font-bold text-emerald-600">{selectedOrderForInvoice.paymentStatus}</p>
              </div>
            </div>

            <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
              {selectedOrderForInvoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono font-semibold">{formatPKR(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPKR(selectedOrderForInvoice.subtotal)}</span>
              </div>
              {selectedOrderForInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatPKR(selectedOrderForInvoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-mono">{formatPKR(selectedOrderForInvoice.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono text-pink-600">{formatPKR(selectedOrderForInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
