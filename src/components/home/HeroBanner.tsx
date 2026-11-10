import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { HERO_BANNER_IMAGE } from '../../data/initialData';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setTrackOrderModalOpen } = useShop();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-pink-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl">
      {/* Background Hero Image with measured contrast gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BANNER_IMAGE}
          alt="Shopsphere Pakistan Festive Shopping"
          className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-transparent to-purple-950/40" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-24 max-w-4xl">
        {/* Editorial Subtitle Kicker (Clean unboxed text) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-pink-300 tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Pakistan's Premier E-Commerce Destination</span>
          <span aria-hidden="true">·</span>
          <span>Festive 2026 Collection</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white max-w-2xl text-balance">
          Elevate Your Style with Authentic Pakistani Luxury.
        </h1>

        {/* Body Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-purple-100 max-w-xl leading-relaxed">
          Shop handpicked Eastern pret, luxury rose skincare, pure leather Peshawari chappals, and smart electronics with rapid Cash on Delivery across Karachi, Lahore, Islamabad, and nationwide.
        </p>

        {/* CTA Button Island */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('shop');
            }}
            className="px-6 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 whitespace-nowrap shrink-0"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setSelectedCategory("Women's Clothing");
              setCurrentView('category');
            }}
            className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0"
          >
            Festive Lawn & Couture
          </button>

          <button
            onClick={() => setTrackOrderModalOpen(true)}
            className="px-4 py-3.5 text-xs text-purple-200 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Truck className="w-4 h-4 text-orange-400" />
            <span>Track Existing Order</span>
          </button>
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-12 pt-8 border-t border-purple-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-purple-200 font-medium">100% Genuine Pakistani Brands</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-purple-200 font-medium">Free Delivery Above Rs. 3,000</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-purple-200 font-medium">Verified COD Nationwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};
