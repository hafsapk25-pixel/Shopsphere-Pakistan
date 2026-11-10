import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setPolicyModal, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for Rs. 500 off coupon.', 'success');
    setNewsletterEmail('');
  };

  const categories: ProductCategory[] = [
    'Beauty & Cosmetics',
    "Women's Clothing",
    "Men's Clothing",
    'Shoes',
    'Bags',
    'Electronics',
    'Home & Living',
    'Jewelry & Accessories'
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-purple-900/40">
      {/* Trust Highlights Strip */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide Express</h4>
              <p className="text-xs text-slate-400 mt-0.5">2-4 days delivery via TCS & Leopards</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay at your doorstep, Easypaisa, or Card</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Easy Return</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free exchange & refund guarantee</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Authentic</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct from vetted Pakistani artisans & brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Shopsphere <span className="text-pink-500 text-lg">Pakistan</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pakistan's premier digital shopping lifestyle destination. Delivering premium Eastern couture, pure skincare, artisanal home decor, electronics, and jewelry across 200+ cities from Karachi to Khyber.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <span>UAN: +92 (042) 111-746-774 | WhatsApp: 0300-1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@shopsphere.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Central Logistics Hub: Gulberg III, Lahore, Pakistan</span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="pt-3">
              <p className="text-xs font-semibold text-white mb-2">Subscribe for Secret Flash Sales & PKR 500 Voucher</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-slate-900 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-pink-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Thank you for subscribing!
                </p>
              )}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentView('category');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-pink-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-pink-400 hover:text-pink-300 font-semibold"
                >
                  View All Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setPolicyModal('faq')} className="hover:text-pink-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('shipping')} className="hover:text-pink-400 transition-colors">
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('returns')} className="hover:text-pink-400 transition-colors">
                  Returns, Refunds & Exchange
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('track')} className="hover:text-pink-400 transition-colors">
                  Track Your Parcel
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('contact')} className="hover:text-pink-400 transition-colors">
                  Customer Support & WhatsApp
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('privacy')} className="hover:text-pink-400 transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Logistics Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Payment Methods</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-slate-300 font-medium">
                💵 Cash on Delivery
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-emerald-400 font-medium">
                📱 Easypaisa
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-red-400 font-medium">
                ⚡ JazzCash
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-blue-400 font-medium">
                💳 Visa / Mastercard
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Courier Partners</h4>
            <p className="text-[11px] text-slate-400">
              TCS Express · Leopards Courier · Trax Logistics · Call Courier
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Shopsphere Pakistan (Pvt.) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setPolicyModal('terms')} className="hover:text-slate-300">Terms of Service</button>
            <span>·</span>
            <button onClick={() => setPolicyModal('privacy')} className="hover:text-slate-300">Privacy</button>
            <span>·</span>
            <button onClick={() => setPolicyModal('shipping')} className="hover:text-slate-300">Shipping Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
