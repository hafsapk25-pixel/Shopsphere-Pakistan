import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PAKISTAN_CITIES } from '../../data/initialData';
import { PaymentMethod, Order } from '../../types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2, 
  Truck, 
  ArrowRight, 
  Lock,
  Tag,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPKR,
    currentUser,
    placeOrder,
    showToast
  } = useShop();

  if (!isOpen) return null;

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || 'Hafsa Khan');
  const [email, setEmail] = useState(currentUser?.email || 'hafsa.pk.25@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '0321-7654321');
  const [address, setAddress] = useState(
    currentUser?.address || 'House #42, Street 8, Block F, DHA Phase 5'
  );
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '54792');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [paymentRef, setPaymentRef] = useState('');

  // Card details (test sandbox)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  // Coupon
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    await applyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || !city) {
      showToast('Please fill in all required shipping fields', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      userId: currentUser?.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        fullName,
        phone,
        email,
        address,
        city,
        postalCode,
        notes
      },
      items: cart.map((it) => ({
        productId: it.product.id,
        name: it.product.name,
        image: it.product.image,
        price: it.product.discountedPrice,
        quantity: it.quantity,
        selectedSize: it.selectedSize,
        selectedColor: it.selectedColor,
        total: it.product.discountedPrice * it.quantity
      })),
      paymentMethod,
      paymentReference: paymentMethod !== 'Cash on Delivery (COD)' ? (paymentRef || `TEST-TXN-${Date.now()}`) : undefined
    };

    const result = await placeOrder(orderPayload);
    setIsSubmitting(false);

    if (result.success && result.order) {
      onOrderSuccess(result.order);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Secure Checkout</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">256-bit SSL Encrypted Order</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-pink-600" />
                  1. Delivery Details (Pakistan)
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number (For TCS/Courier SMS) *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="0300-1234567"
                        className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address (For receipt & tracking) *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Complete Street Address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="House #, Street #, Sector / Area"
                      className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">City *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white focus:outline-none focus:border-pink-500"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 54000"
                        className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please call before arriving or leave with security"
                      className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-4 border-t border-purple-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  2. Payment Method
                </h3>

                <div className="space-y-2.5">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-pink-600 bg-pink-50/40 shadow-xs ring-1 ring-pink-500/30'
                        : 'border-purple-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="mt-1 accent-pink-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay cash to the TCS or Leopards courier rider when your parcel arrives at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Easypaisa */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Easypaisa'
                        ? 'border-emerald-600 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-500/30'
                        : 'border-purple-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Easypaisa'}
                      onChange={() => setPaymentMethod('Easypaisa')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          Easypaisa Mobile Account / QR
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">0345-8765432</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Transfer to Shopsphere Retail (0345-8765432) via your Easypaisa App.
                      </p>
                      {paymentMethod === 'Easypaisa' && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder="Enter 8-digit Easypaisa TRX ID (e.g. EP-882194)"
                            className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'JazzCash'
                        ? 'border-rose-600 bg-rose-50/30 shadow-xs ring-1 ring-rose-500/30'
                        : 'border-purple-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      className="mt-1 accent-rose-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-rose-600" />
                          JazzCash Mobile Account / Till ID
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Till # 001928</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay via JazzCash App to Till ID 001928 or Account 0300-1234567.
                      </p>
                      {paymentMethod === 'JazzCash' && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder="Enter JazzCash Transaction TID (e.g. JC-74192)"
                            className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-blue-600 bg-blue-50/30 shadow-xs ring-1 ring-blue-500/30'
                        : 'border-purple-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Direct Bank Transfer (1Link / Raast)
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Meezan Bank Ltd · Account: 0102-0105829101 (IBAN: PK42MEZN0001020105829101)
                      </p>
                      {paymentMethod === 'Bank Transfer' && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder="Enter Bank Ref / Raast ID / Slip Number"
                            className="w-full text-xs p-2 rounded-lg border border-blue-300 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Online Card Payment (Test Sandbox) */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Online Card Payment'
                        ? 'border-purple-600 bg-purple-50/30 shadow-xs ring-1 ring-purple-500/30'
                        : 'border-purple-100 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Online Card Payment'}
                      onChange={() => setPaymentMethod('Online Card Payment')}
                      className="mt-1 accent-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-purple-600" />
                          Debit / Credit Card (Visa / Mastercard)
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.5 rounded">
                          Test Mode Ready
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supported gateway simulation (3D-Secure 2.0 compliant).
                      </p>
                      {paymentMethod === 'Online Card Payment' && (
                        <div className="mt-3 space-y-2 bg-purple-50/60 p-3 rounded-xl border border-purple-200">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242"
                              className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">CVC / CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-50 p-5 rounded-2xl border border-purple-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items Mini List */}
                <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{it.product.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {it.quantity} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                        {formatPKR(it.product.discountedPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-semibold flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Coupon: {appliedCoupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Coupon Code"
                        className="flex-1 text-xs uppercase p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-2 bg-purple-900 text-white rounded-lg text-xs font-bold hover:bg-purple-950"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold">{formatPKR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-{formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="font-mono">
                      {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPKR(shippingFee)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                    <span>Total (PKR)</span>
                    <span className="font-mono text-pink-600">{formatPKR(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Your order is protected by Shopsphere Buyer Guarantee
                </p>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
