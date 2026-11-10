import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PAKISTAN_CITIES } from '../../data/initialData';
import { ProductCard } from '../products/ProductCard';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Lock, 
  LogOut, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  CreditCard,
  Edit2,
  Save,
  Plus
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    products, 
    wishlist, 
    logout, 
    updateUserProfile, 
    formatPKR,
    setTrackOrderModalOpen,
    setTrackingId,
    showToast,
    setCurrentView
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses' | 'security'>('orders');

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">You need to sign in to access your dashboard.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 bg-pink-600 text-white rounded-xl text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Filter orders belonging to this user
  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  // Filter wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ name, phone, city, address, postalCode });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    const success = await updateUserProfile({ password: currentPassword, newPassword } as any);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Greeting Card */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black text-amber-300">
            {currentUser.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{currentUser.name}</h1>
              <span className="text-[10px] font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">{currentUser.email} · {currentUser.phone}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-rose-300" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Grid: Sidebar Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-purple-100 shadow-xs h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-purple-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </span>
            <span className="text-[11px] font-mono">{userOrders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-purple-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </span>
            <span className="text-[11px] font-mono">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-purple-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-purple-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-purple-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </aside>

        {/* Content Area (9 cols) */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <h3 className="text-base font-bold text-slate-900">Purchase History & Tracking</h3>
                <span className="text-xs text-slate-500">{userOrders.length} orders on record</span>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="mt-4 px-5 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-purple-100 hover:border-pink-200 transition-colors bg-purple-50/20 space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-100/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString('en-PK', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.orderStatus}
                          </span>
                          <button
                            onClick={() => {
                              setTrackingId(order.orderNumber);
                              setTrackOrderModalOpen(true);
                            }}
                            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-white border border-pink-200 px-3 py-1 rounded-lg shadow-2xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={it.image}
                              alt={it.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{it.name}</p>
                              <p className="text-[11px] text-slate-500">
                                Qty: {it.quantity} {it.selectedSize ? `· ${it.selectedSize}` : ''}
                              </p>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                              {formatPKR(it.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Summary */}
                      <div className="pt-3 border-t border-purple-100/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-slate-500">
                          Payment: <strong className="text-slate-700">{order.paymentMethod}</strong> ({order.paymentStatus})
                        </div>
                        <div className="flex items-baseline gap-1.5 font-bold">
                          <span className="text-slate-500">Total Paid:</span>
                          <span className="text-base text-pink-600 font-mono">{formatPKR(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <h3 className="text-base font-bold text-slate-900">Saved Wishlist Items</h3>
                <span className="text-xs text-slate-500">{wishlistedProducts.length} items</span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-5 max-w-lg">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-purple-100">
                Update Personal Information
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Default Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <h3 className="text-base font-bold text-slate-900">Saved Delivery Addresses</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-pink-900">Home Address (Primary)</span>
                    <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded">Default</span>
                  </div>
                  <p className="text-xs text-slate-700">{currentUser.address || 'House #42, Street 8, Block F, DHA Phase 5'}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.city || 'Lahore'}, {currentUser.postalCode || '54792'}</p>
                  <p className="text-[11px] text-slate-500">Recipient Phone: {currentUser.phone}</p>
                </div>

                <div className="p-4 rounded-2xl border border-dashed border-purple-200 flex flex-col items-center justify-center text-center p-6 text-purple-600 hover:bg-purple-50/50 cursor-pointer transition-colors">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Add Another Address</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Office, parents, or relatives</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-purple-100">
                Change Password
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-900 text-white rounded-xl text-xs font-bold hover:bg-purple-950 shadow-md"
              >
                Update Password
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
