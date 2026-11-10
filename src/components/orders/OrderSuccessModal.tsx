import React from 'react';
import { Order } from '../../types';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, Truck, ShoppingBag, ArrowRight, X, Printer } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onTrackOrder }) => {
  const { formatPKR, setCurrentView } = useShop();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Order Confirmed & Logged
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Shukriya, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your order has been received by our central fulfillment center in Lahore.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-purple-200/60">
            <span className="text-slate-500 font-medium">Order Number:</span>
            <span className="font-mono font-extrabold text-purple-900 text-sm">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Payable:</span>
            <span className="font-mono font-bold text-slate-900 text-sm text-pink-600">
              {formatPKR(order.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Option:</span>
            <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Shipping To:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-purple-200/60 text-[11px] text-purple-700">
            <span>Estimated Delivery:</span>
            <span>2-3 business days via {order.courierName || 'TCS Express'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setCurrentView('shop');
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};
