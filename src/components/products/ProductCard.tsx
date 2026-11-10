import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, formatPKR } = useShop();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  // Fallback image gradient if asset fails to load
  const fallbackBg = 'from-purple-100 via-pink-50 to-orange-50';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-purple-100/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50 flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        )}

        {imageError ? (
          <div className={`w-full h-full bg-gradient-to-tr ${fallbackBg} flex flex-col items-center justify-center p-4 text-center`}>
            <ShoppingBag className="w-8 h-8 text-purple-400 mb-1" />
            <span className="text-xs font-semibold text-purple-950 line-clamp-1">{product.name}</span>
            <span className="text-[10px] text-purple-600 font-medium mt-0.5">{product.brand}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Subtle Discount Percentage Ribbon */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white/90 backdrop-blur-xs text-slate-600 hover:text-pink-600 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-purple-900/90 hover:bg-purple-950 backdrop-blur-xs text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-xl flex items-center justify-center shadow-lg"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Zero-Pill Clean Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-purple-700 uppercase tracking-wider">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400 font-mono">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Stock Indicator */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-950 font-mono tabular-nums">
                {formatPKR(product.discountedPrice)}
              </span>
              {product.originalPrice > product.discountedPrice && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {product.stock <= 5 ? `Only ${product.stock} left in stock!` : 'In Stock · Ready to dispatch'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
