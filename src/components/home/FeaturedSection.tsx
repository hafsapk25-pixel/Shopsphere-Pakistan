import React, { useState } from 'react';
import { ProductCard } from '../products/ProductCard';
import { useShop } from '../../context/ShopContext';
import { Sparkles, TrendingUp, Flame, Tag, Star, Quote, ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { products, setCurrentView } = useShop();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new' | 'offers'>('featured');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'bestsellers') return p.isBestSeller;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'offers') return p.discountPercentage >= 20;
    return true;
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header with Segmented Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handpicked Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trending Products
          </h2>
        </div>

        {/* Interactive Segmented Filter Controls (§1.A Allowed) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-purple-50/80 rounded-xl border border-purple-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'featured'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>

          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bestsellers'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Sellers</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Arrivals</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>Discounts 20%+</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Promotional Mid-Page Banner */}
      <div className="my-14 rounded-3xl bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-200">
            Limited Time Promo Code
          </span>
          <h3 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
            Get 20% Off on Orders Above Rs. 5,000
          </h3>
          <p className="text-xs sm:text-sm text-purple-100 mt-2 leading-relaxed">
            Use voucher code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">AZADI20</span> during checkout. Valid on Eastern Pret, Designer Abayas, Organics, and Audio Gear.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3 bg-white text-purple-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-purple-50 transition-all flex items-center gap-2"
            >
              <span>Shop All Offers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Testimonials Section */}
      <div className="mt-16 pt-10 border-t border-purple-100">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
            Verified Pakistani Customer Stories
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            Loved Across Pakistan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real shopping experiences with nationwide Cash on Delivery & 2-day express shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-pink-200 mb-2" />
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Ordered the Zariyah Embroidered 3-Piece lawn dress for an Eid dawwat. The stitching and organza dupatta exceeded my expectations. Arrived in DHA Lahore within 48 hours via TCS!"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Hafsa Khan</p>
                <p className="text-[11px] text-slate-500">Lahore · Verified Buyer</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified COD
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-purple-200 mb-2" />
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Botanica rose serum is pure bliss. It kept my skin glowing without feeling greasy. Paid through Easypaisa and the order tracking link updated in real time."
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Ayesha Malik</p>
                <p className="text-[11px] text-slate-500">Karachi · Verified Buyer</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-orange-200 mb-2" />
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The handcrafted Kaptaan Peshawari chappals in pure leather are genuinely comfortable with the tire sole. Great customer care on WhatsApp as well."
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Hamza Tariq</p>
                <p className="text-[11px] text-slate-500">Islamabad · Verified Buyer</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified COD
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
