import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  MessageSquare,
  Send
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    products, 
    formatPKR,
    setCartDrawerOpen,
    currentUser,
    showToast
  } = useShop();

  if (!selectedProduct) return null;

  const [activeImage, setActiveImage] = useState<string>(selectedProduct.image);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(selectedProduct.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(selectedProduct.colors?.[0]);
  const [quantity, setQuantity] = useState<number>(1);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(currentUser?.name || '');
  const [reviewerCity, setReviewerCity] = useState<string>(currentUser?.city || 'Lahore');
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  const isWishlisted = isInWishlist(selectedProduct.id);

  // Related products from same category (excluding current)
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
    setSelectedProduct(null);
    setCartDrawerOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review comments', 'error');
      return;
    }

    const payload = {
      productId: selectedProduct.id,
      userId: currentUser?.id || 'guest',
      userName: reviewerName || 'Verified Pakistani Shopper',
      userCity: reviewerCity || 'Pakistan',
      rating: userRating,
      comment: reviewComment
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setLocalReviews((prev) => [data.review, ...prev]);
        showToast('Thank you! Your verified review has been submitted.', 'success');
        setReviewComment('');
        setShowReviewForm(false);
      }
    } catch {
      setLocalReviews((prev) => [
        {
          id: `rev-${Date.now()}`,
          ...payload,
          date: new Date().toISOString().split('T')[0],
          verifiedPurchase: true
        },
        ...prev
      ]);
      showToast('Review submitted!', 'success');
      setShowReviewForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-purple-900">{selectedProduct.category}</span>
            <span>·</span>
            <span>{selectedProduct.subcategory}</span>
            <span>·</span>
            <span className="font-mono text-slate-400">SKU: {selectedProduct.sku}</span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          {/* Main 2-Column Split: Gallery Left, Purchase Module Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-purple-100 shadow-inner">
                <img
                  src={activeImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {selectedProduct.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                    {selectedProduct.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery Row */}
              {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {selectedProduct.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === img ? 'border-pink-600 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contiguous Purchase Module Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                    {selectedProduct.brand}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-slate-400">({selectedProduct.reviewCount + localReviews.length} reviews)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {selectedProduct.name}
                </h1>

                {/* Pricing Block */}
                <div className="mt-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                        {formatPKR(selectedProduct.discountedPrice)}
                      </span>
                      {selectedProduct.originalPrice > selectedProduct.discountedPrice && (
                        <span className="text-sm text-slate-400 line-through font-mono">
                          {formatPKR(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Inclusive of all Pakistani GST taxes · Cash on Delivery available
                    </p>
                  </div>

                  {/* Availability Badge */}
                  <div className="text-right">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                      selectedProduct.stock > 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Sizes Selection (if available) */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">Select Size</span>
                      <span className="text-[11px] text-purple-600 font-medium">Pakistani Standard Fitting</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            selectedSize === sz
                              ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                              : 'border-slate-200 text-slate-700 hover:border-purple-300 bg-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors Selection (if available) */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-900 block mb-2">Available Colors</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1 text-xs rounded-xl border transition-all ${
                            selectedColor === c
                              ? 'bg-pink-100 border-pink-500 text-pink-900 font-bold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-purple-200 rounded-xl bg-purple-50/30 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-purple-100 flex items-center justify-center shadow-xs"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-xs text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-purple-100 flex items-center justify-center shadow-xs"
                      disabled={quantity >= selectedProduct.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 py-3 px-5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={selectedProduct.stock <= 0}
                    className="py-3 px-5 bg-purple-950 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                      isWishlisted 
                        ? 'bg-pink-500 border-pink-500 text-white shadow-md' 
                        : 'border-purple-200 text-slate-600 hover:border-pink-300 hover:text-pink-600 bg-white'
                    }`}
                    title="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Delivery & Warranty Strip */}
              <div className="pt-4 border-t border-purple-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-purple-50/50">
                  <Truck className="w-4 h-4 text-pink-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block text-[11px]">Free Shipping</span>
                  <span className="text-[10px] text-slate-500">Orders &gt; Rs. 3,000</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/50">
                  <RotateCcw className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block text-[11px]">7-Day Return</span>
                  <span className="text-[10px] text-slate-500">Hassle-free guarantee</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/50">
                  <ShieldCheck className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block text-[11px]">100% Original</span>
                  <span className="text-[10px] text-slate-500">Verified authenticity</span>
                </div>
              </div>
            </div>

          </div>

          {/* Specifications Table */}
          {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="text-slate-900 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Customer Ratings & Verified Reviews
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real feedback from customers across Pakistan
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 text-xs font-bold text-pink-600 border border-pink-200 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      required
                      className="w-full text-xs p-2 rounded-lg border border-pink-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      placeholder="e.g. Lahore / Karachi"
                      required
                      className="w-full text-xs p-2 rounded-lg border border-pink-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Star Rating</label>
                    <div className="flex items-center gap-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= userRating ? 'fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Experience / Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe product quality, delivery speed, fabric, fragrance, or performance..."
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-pink-200 bg-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-pink-600 text-white rounded-lg text-xs font-bold hover:bg-pink-700 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {localReviews.concat([
                {
                  id: 'default-1',
                  userName: 'Hina Qureshi',
                  userCity: 'Islamabad',
                  rating: 5,
                  date: '2026-11-02',
                  comment: 'Exceptional craftsmanship! The product looks even better in person than the photos. Standard delivery arrived in 48 hours.',
                  verifiedPurchase: true
                }
              ]).map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      <span className="text-[10px] text-slate-400">({rev.userCity})</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Related Products in {selectedProduct.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
