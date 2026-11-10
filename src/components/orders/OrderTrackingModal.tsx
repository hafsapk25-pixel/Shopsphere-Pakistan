import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  XCircle, 
  MapPin, 
  Phone, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface OrderTrackingModalProps {
  initialOrderNumber?: string;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ initialOrderNumber, onClose }) => {
  const { orders, updateOrderStatus, formatPKR, showToast } = useShop();
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'PK-918241');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState(false);

  const statuses: OrderStatus[] = [
    'Order Placed',
    'Order Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const handleSearch = (query?: string) => {
    const q = (query || searchInput).trim().toLowerCase();
    if (!q) return;

    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.id.toLowerCase() === q ||
        o.customerPhone.includes(q)
    );

    setFoundOrder(match || null);
    setSearched(true);
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    } else {
      // Default sample search for user convenience
      handleSearch('PK-918241');
    }
  }, [initialOrderNumber, orders]);

  const handleCancelOrder = async () => {
    if (!foundOrder) return;
    const ok = await updateOrderStatus(foundOrder.id, 'Cancelled', 'Cancelled by customer before dispatch');
    if (ok) {
      setCancelPrompt(false);
      showToast('Order has been cancelled and inventory restored.', 'info');
      // Refresh local found order
      setFoundOrder({ ...foundOrder, orderStatus: 'Cancelled' });
    }
  };

  const getStatusIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') return -1;
    return statuses.indexOf(currentStatus);
  };

  const currentIndex = foundOrder ? getStatusIndex(foundOrder.orderStatus) : 0;
  const isCancellable = foundOrder && (foundOrder.orderStatus === 'Order Placed' || foundOrder.orderStatus === 'Order Confirmed');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Track Your Shipment</h2>
              <p className="text-xs text-slate-500">Live order status and TCS / Leopards courier updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. PK-918241) or Phone Number"
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500 font-mono"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              Track
            </button>
          </form>

          {/* Quick Demo Order Chips */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span>Quick test:</span>
            {orders.slice(0, 2).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchInput(o.orderNumber);
                  handleSearch(o.orderNumber);
                }}
                className="underline hover:text-pink-600 font-mono font-medium"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Order Details and Visual Progression */}
        {foundOrder ? (
          <div className="space-y-6 overflow-y-auto pr-1">
            
            {/* Top Order Status Banner */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              foundOrder.orderStatus === 'Cancelled'
                ? 'bg-red-50 border-red-200 text-red-900'
                : foundOrder.orderStatus === 'Delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-purple-50/70 border-purple-200 text-purple-950'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm">{foundOrder.orderNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    foundOrder.orderStatus === 'Delivered'
                      ? 'bg-emerald-200 text-emerald-900'
                      : foundOrder.orderStatus === 'Cancelled'
                      ? 'bg-red-200 text-red-900'
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {foundOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Recipient: <strong>{foundOrder.customerName}</strong> ({foundOrder.shippingAddress.city})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-mono font-bold text-slate-900 block">
                  {formatPKR(foundOrder.totalAmount)}
                </span>
                <span className="text-[11px] text-slate-500">{foundOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Visual Tracking Timeline */}
            {foundOrder.orderStatus !== 'Cancelled' ? (
              <div className="py-4">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-purple-100 z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-pink-600 to-purple-600 z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentIndex) / (statuses.length - 1)) * 100}%`
                    }}
                  />

                  {statuses.map((st, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={st} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-pink-600 text-white ring-4 ring-pink-100 scale-110 shadow-md'
                              : isDone
                              ? 'bg-purple-900 text-white'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-1.5 text-center font-medium max-w-[60px] leading-tight ${
                          isCurrent ? 'text-pink-600 font-bold' : isDone ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-100/60 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>This order was cancelled. Any reserved inventory has been released back into stock.</span>
              </div>
            )}

            {/* Courier Dispatch Information */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Courier Partner:</span>
                <span className="font-semibold text-slate-900">{foundOrder.courierName || 'TCS Express Pakistan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Airway Bill / Tracking #:</span>
                <span className="font-mono font-bold text-purple-900">{foundOrder.courierTrackingNumber || 'TCS-PK-PENDING'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-semibold text-slate-800">{foundOrder.shippingAddress.address}, {foundOrder.shippingAddress.city}</span>
              </div>
            </div>

            {/* Itemized Order Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Ordered Items ({foundOrder.items.length})
              </h4>
              <div className="space-y-2">
                {foundOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100">
                    <img src={it.image} alt={it.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{it.name}</p>
                      <p className="text-[10px] text-slate-500">Qty: {it.quantity}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">{formatPKR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Cancellation Option (if order not yet shipped) */}
            {isCancellable && (
              <div className="pt-2">
                {cancelPrompt ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Are you sure you want to cancel this order?
                    </p>
                    <p className="text-amber-800">
                      Your order will be terminated immediately and stock will be restored for other shoppers.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleCancelOrder}
                        className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                      >
                        Yes, Cancel Order
                      </button>
                      <button
                        onClick={() => setCancelPrompt(false)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium"
                      >
                        Keep Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancelPrompt(true)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                  >
                    Cancel this order before shipment
                  </button>
                )}
              </div>
            )}

          </div>
        ) : searched ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <XCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">No order found with ID "{searchInput}"</h4>
            <p className="text-xs text-slate-500 mt-1">
              Please double check the Order Number sent in your confirmation SMS or email.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
