import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Phone, Mail, MapPin, MessageCircle, HelpCircle, Shield, Truck, RotateCcw } from 'lucide-react';

export const PolicyModals: React.FC = () => {
  const { policyModal, setPolicyModal } = useShop();

  if (!policyModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2">
            {policyModal === 'faq' && <HelpCircle className="w-5 h-5 text-purple-600" />}
            {policyModal === 'shipping' && <Truck className="w-5 h-5 text-pink-600" />}
            {policyModal === 'returns' && <RotateCcw className="w-5 h-5 text-orange-500" />}
            {policyModal === 'contact' && <Phone className="w-5 h-5 text-emerald-600" />}
            {policyModal === 'privacy' && <Shield className="w-5 h-5 text-blue-600" />}
            {policyModal === 'terms' && <Shield className="w-5 h-5 text-purple-600" />}

            <h3 className="text-base font-bold text-slate-900 capitalize">
              {policyModal === 'faq' && 'Frequently Asked Questions (FAQ)'}
              {policyModal === 'shipping' && 'Shipping & Delivery Policy'}
              {policyModal === 'returns' && '7-Day Return & Exchange Policy'}
              {policyModal === 'contact' && 'Contact Us & Customer Support'}
              {policyModal === 'privacy' && 'Privacy & Data Protection Policy'}
              {policyModal === 'terms' && 'Terms and Conditions of Use'}
            </h3>
          </div>

          <button
            onClick={() => setPolicyModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto py-6 space-y-4 text-xs text-slate-600 leading-relaxed">
          
          {/* FAQ */}
          {policyModal === 'faq' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-1">1. Do you offer Cash on Delivery (COD)?</h4>
                <p>Yes, we offer Cash on Delivery across all 200+ cities and towns in Pakistan. You only pay when the TCS or Leopards courier rider delivers your package to your doorstep.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-1">2. How long does nationwide delivery take?</h4>
                <p>Orders in major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) are delivered within 24 to 48 hours. Other cities take approximately 2 to 4 business days.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-1">3. What is the Free Shipping threshold?</h4>
                <p>Orders totaling Rs. 3,000 or more automatically receive FREE delivery. For smaller orders, a standard delivery fee of Rs. 250 applies.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-1">4. How can I cancel or modify my order?</h4>
                <p>You can cancel any eligible order directly through the "Track Order" or "Customer Dashboard" tab as long as its status is still "Order Placed" or "Order Confirmed". Once dispatched with the courier, cancellation is not possible.</p>
              </div>
            </div>
          )}

          {/* SHIPPING POLICY */}
          {policyModal === 'shipping' && (
            <div className="space-y-3">
              <p>At <strong>Shopsphere Pakistan</strong>, we partner with premier courier networks including <strong>TCS Express</strong>, <strong>Leopards Courier</strong>, and <strong>Trax</strong> to guarantee safe, swift transit.</p>
              
              <h4 className="font-bold text-slate-900 pt-2">Standard Delivery Charges:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders under Rs. 3,000: Flat Rs. 250 nationwide.</li>
                <li>Orders of Rs. 3,000 and above: <strong>FREE Delivery</strong> across Pakistan.</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-2">Airway Bill & SMS Notifications:</h4>
              <p>Once your parcel is dispatched from our Lahore Central Logistics Hub, you will receive an automatic SMS containing your consignment number and live tracking link.</p>
            </div>
          )}

          {/* RETURNS POLICY */}
          {policyModal === 'returns' && (
            <div className="space-y-3">
              <p>We pride ourselves on 100% customer satisfaction. If you are not completely satisfied with your purchase, you can initiate a return or exchange within <strong>7 days</strong> of delivery.</p>

              <h4 className="font-bold text-slate-900 pt-2">Eligibility Criteria:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Item must be unused, unwashed, and in its original packaging with tags intact.</li>
                <li>Footwear and eastern wear must be in unworn condition.</li>
                <li>Cosmetics & perfumes cannot be returned once the protective seal is broken due to hygiene standards.</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-2">Refund Processing:</h4>
              <p>Refunds are transferred via Easypaisa, JazzCash, or direct bank transfer within 3 to 5 business days after inspecting returned goods.</p>
            </div>
          )}

          {/* CONTACT & SUPPORT */}
          {policyModal === 'contact' && (
            <div className="space-y-4">
              <p>Our dedicated customer support team is available Monday to Saturday, 9:00 AM – 8:00 PM (PKT).</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-emerald-950 text-xs">WhatsApp Support</h5>
                    <p className="text-[11px] text-emerald-700">0300-1234567 (Instant reply)</p>
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-purple-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-purple-950 text-xs">Phone UAN Helpline</h5>
                    <p className="text-[11px] text-purple-700">+92 (042) 111-746-774</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-pink-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-pink-950 text-xs">Email Desk</h5>
                    <p className="text-[11px] text-pink-700">support@shopsphere.pk</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-orange-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-orange-950 text-xs">Headquarters</h5>
                    <p className="text-[11px] text-orange-700">Gulberg III, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {policyModal === 'privacy' && (
            <div className="space-y-3">
              <p>Shopsphere Pakistan respects your digital privacy. We never sell or share your personal data with third-party advertising companies.</p>
              <h4 className="font-bold text-slate-900 pt-2">Data Protection:</h4>
              <p>Your address, phone number, and name are strictly used for delivery route fulfillment with vetted courier services. Payment data is processed over secure TLS 1.3 encrypted protocols.</p>
            </div>
          )}

          {/* TERMS */}
          {policyModal === 'terms' && (
            <div className="space-y-3">
              <p>By browsing or ordering from Shopsphere Pakistan, you agree to comply with our commercial terms and laws of the Islamic Republic of Pakistan.</p>
              <p>All prices are listed in Pakistani Rupees (PKR) and are inclusive of standard federal taxes.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-100 flex justify-end">
          <button
            onClick={() => setPolicyModal(null)}
            className="px-5 py-2 bg-purple-900 text-white font-bold rounded-xl text-xs hover:bg-purple-950"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
