import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedSection } from './components/home/FeaturedSection';
import { ProductGrid } from './components/products/ProductGrid';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/orders/OrderSuccessModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { AuthModal } from './components/auth/AuthModal';
import { PolicyModals } from './components/common/PolicyModals';
import { Order } from './types';
import { MessageCircle, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    trackOrderModalOpen, 
    setTrackOrderModalOpen,
    trackingId,
    setTrackingId,
    toasts
  } = useShop();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
  };

  const handleTrackFromSuccess = (orderNum: string) => {
    setCompletedOrder(null);
    setTrackingId(orderNum);
    setTrackOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbfe] text-slate-900 selection:bg-pink-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <CategoryGrid />
            <FeaturedSection />
          </>
        )}

        {(currentView === 'shop' || currentView === 'category') && (
          <ProductGrid />
        )}

        {currentView === 'dashboard' && (
          <div className="animate-in fade-in">
            {/* Dynamic import of customer dashboard */}
            <React.Suspense fallback={<div className="p-12 text-center text-xs">Loading Dashboard...</div>}>
              {React.createElement(
                React.lazy(() =>
                  import('./components/dashboard/CustomerDashboard').then((m) => ({
                    default: m.CustomerDashboard
                  }))
                )
              )}
            </React.Suspense>
          </div>
        )}

        {currentView === 'admin' && (
          <div className="animate-in fade-in">
            <React.Suspense fallback={<div className="p-12 text-center text-xs">Loading Admin Console...</div>}>
              {React.createElement(
                React.lazy(() =>
                  import('./components/admin/AdminDashboard').then((m) => ({
                    default: m.AdminDashboard
                  }))
                )
              )}
            </React.Suspense>
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />

      <CartDrawer onProceedToCheckout={() => setCheckoutModalOpen(true)} />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onTrackOrder={handleTrackFromSuccess}
      />

      {trackOrderModalOpen && (
        <OrderTrackingModal
          initialOrderNumber={trackingId}
          onClose={() => {
            setTrackOrderModalOpen(false);
            setTrackingId('');
          }}
        />
      )}

      <AuthModal />
      <PolicyModals />

      {/* WhatsApp Quick Assistance Button */}
      <a
        href="https://wa.me/923001234567?text=Hi%20Shopsphere%20Pakistan,%20I%20have%20an%20inquiry%20regarding%20an%20order."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Customer Care"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          WhatsApp Help
        </span>
      </a>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold pointer-events-auto animate-in slide-in-from-left duration-200 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-purple-950 text-purple-100 border-purple-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-purple-400 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
