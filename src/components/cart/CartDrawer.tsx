import React, { useState } from 'react';
import { useShop, FREE_SHIPPING_THRESHOLD } from '../../context/ShopContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Truck, Check } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPKR,
    setCurrentView
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!cartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
            <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, it) => sum + it.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-5 py-2.5 border-b border-purple-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1 text-purple-950">
              <Truck className="w-3.5 h-3.5 text-pink-600" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">🎉 Congratulations! You have unlocked FREE Delivery!</span>
              ) : (
                <span>Add <strong className="text-pink-600">{formatPKR(amountNeededForFreeShipping)}</strong> more for FREE Shipping</span>
              )}
            </span>
          </div>
          <div className="w-full h-1.5 bg-purple-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Bag is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover authentic Pakistani pret, beauty essentials, footwear, and smart gadgets.
                </p>
              </div>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setCurrentView('shop');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                className="p-3 bg-white rounded-2xl border border-purple-100 shadow-2xs flex gap-3 relative group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{item.product.brand}</span>
                      {item.selectedSize && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-purple-700">Size: {item.selectedSize}</span>
                        </>
                      )}
                      {item.selectedColor && (
                        <>
                          <span>·</span>
                          <span>{item.selectedColor}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Item Total */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-purple-200 rounded-lg bg-purple-50/40 p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)
                        }
                        className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-purple-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)
                        }
                        className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-purple-100"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-slate-950">
                        {formatPKR(item.product.discountedPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom: Coupon + Calculations + Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-purple-100 bg-purple-50/40 space-y-3">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> applied (-{formatPKR(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      className="w-full text-xs uppercase pl-8 pr-3 py-2 rounded-xl border border-purple-200 bg-white focus:outline-none focus:border-pink-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3.5 py-2 bg-purple-900 text-white rounded-xl text-xs font-bold hover:bg-purple-950 disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-900">{formatPKR(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="border-t border-purple-200/80 pt-2 flex justify-between text-sm font-extrabold text-slate-950">
                <span>Total Amount (PKR)</span>
                <span className="font-mono text-base text-pink-600">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout & Continue Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCartDrawerOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-purple-900 hover:text-pink-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
