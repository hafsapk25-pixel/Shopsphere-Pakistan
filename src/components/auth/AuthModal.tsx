import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PAKISTAN_CITIES } from '../../data/initialData';
import { X, Lock, Mail, Phone, User as UserIcon, MapPin, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authDefaultTab, 
    login, 
    register, 
    showToast 
  } = useShop();

  const [tab, setTab] = useState<'login' | 'register'>(authDefaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('hafsa.pk.25@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Customer@1234');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Karachi');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await login(loginIdentifier, loginPassword);
    setSubmitting(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setSubmitting(true);
    await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      address: regAddress,
      city: regCity,
      postalCode: regPostalCode
    });
    setSubmitting(false);
  };

  const setDemoCredentials = (role: 'customer' | 'admin') => {
    setTab('login');
    if (role === 'customer') {
      setLoginIdentifier('hafsa.pk.25@gmail.com');
      setLoginPassword('Customer@1234');
    } else {
      setLoginIdentifier('admin@shopsphere.pk');
      setLoginPassword('Admin@1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Tabs */}
        <div className="flex border-b border-purple-100 bg-purple-50/50">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-4 text-xs font-bold transition-colors ${
              tab === 'login'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-4 text-xs font-bold transition-colors ${
              tab === 'register'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-4 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                    placeholder="e.g. hafsa.pk.25@gmail.com or 0321-7654321"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                  />
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to registered email', 'info')}
                    className="text-[10px] text-pink-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full text-xs pl-9 pr-9 py-2.5 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none focus:border-pink-500"
                  />
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-pink-600"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Authenticating...' : 'Sign In to Shopsphere'}
              </button>

              {/* Demo Account Quick Switch Island */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 text-center">
                  ⚡ Quick Demo Login Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoCredentials('customer')}
                    className="p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
                  >
                    <span className="text-xs font-bold text-purple-900 block">Customer</span>
                    <span className="text-[10px] text-purple-600">Hafsa Khan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoCredentials('admin')}
                    className="p-2 text-left bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 transition-colors"
                  >
                    <span className="text-xs font-bold text-pink-900 block">Store Owner</span>
                    <span className="text-[10px] text-pink-600">Admin Console</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="e.g. Fatima Ali"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="name@email.com"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    placeholder="0300-1234567"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Password *</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Complete Delivery Address</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House/Apartment #, Street, Colony"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-white"
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
                    value={regPostalCode}
                    onChange={(e) => setRegPostalCode(e.target.value)}
                    placeholder="e.g. 75500"
                    className="w-full text-xs p-2 rounded-xl border border-purple-200 bg-purple-50/20 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 mt-2"
              >
                {submitting ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
