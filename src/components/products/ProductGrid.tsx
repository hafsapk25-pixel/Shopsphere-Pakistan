import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../../types';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    formatPKR 
  } = useShop();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories: ProductCategory[] = [
    'Beauty & Cosmetics',
    "Women's Clothing",
    "Men's Clothing",
    'Shoes',
    'Bags',
    'Electronics',
    'Home & Living',
    'Jewelry & Accessories'
  ];

  // Derive available subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const subs = new Set<string>();
    products
      .filter((p) => p.category === selectedCategory)
      .forEach((p) => subs.add(p.subcategory));
    return Array.from(subs);
  }, [products, selectedCategory]);

  // Derive brands
  const availableBrands = useMemo(() => {
    const brs = new Set<string>();
    products
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .forEach((p) => brs.add(p.brand));
    return Array.from(brs);
  }, [products, selectedCategory]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory && p.category !== selectedCategory) return false;
        if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
        if (selectedBrand && p.brand !== selectedBrand) return false;
        if (p.discountedPrice > maxPrice) return false;
        if (inStockOnly && p.stock <= 0) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
        if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, selectedSubcategory, selectedBrand, maxPrice, inStockOnly, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedBrand(null);
    setMaxPrice(20000);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('newest');
  };

  const hasActiveFilters = 
    selectedCategory !== null || 
    selectedSubcategory !== null || 
    selectedBrand !== null || 
    maxPrice < 20000 || 
    inStockOnly || 
    searchQuery.trim() !== '';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-purple-700 font-semibold">
              {selectedCategory || (searchQuery ? `Search: "${searchQuery}"` : 'All Products')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedCategory || (searchQuery ? `Results for "${searchQuery}"` : 'Browse Catalog')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> authentic products
          </p>
        </div>

        {/* Top Controls: Search and Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-white border border-purple-200 text-xs font-semibold rounded-xl text-slate-700 flex items-center gap-1.5 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-pink-500" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-purple-200 rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="discount">Biggest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-purple-100/80 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-pink-600" />
              Filter Catalog
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === null
                    ? 'bg-purple-100 text-purple-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] text-slate-400">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory(null);
                    }}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[11px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if selected) */}
          {availableSubcategories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Subcategory</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${
                    selectedSubcategory === null
                      ? 'bg-pink-100 text-pink-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All in {selectedCategory}
                </button>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${
                      selectedSubcategory === sub
                        ? 'bg-pink-100 text-pink-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800">Max Price (PKR)</h4>
              <span className="text-xs font-mono font-bold text-purple-900">
                {formatPKR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-pink-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>Rs. 1,000</span>
              <span>Rs. 20,000+</span>
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Brand</h4>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${
                    selectedBrand === null
                      ? 'bg-orange-100 text-orange-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${
                      selectedBrand === b
                        ? 'bg-orange-100 text-orange-950 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-pink-600"
              />
              <span className="font-medium">In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Filters</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Category</h4>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`text-left text-xs p-2 rounded-lg ${
                        selectedCategory === null ? 'bg-purple-100 text-purple-900 font-bold' : ''
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left text-xs p-2 rounded-lg ${
                          selectedCategory === cat ? 'bg-purple-100 text-purple-900 font-bold' : ''
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold">Max Price</span>
                    <span className="font-mono text-purple-900">{formatPKR(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={20000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-pink-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 text-xs font-bold bg-pink-600 text-white rounded-xl shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid Area */}
        <div className="flex-1">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Active:</span>

              {selectedCategory && (
                <span className="bg-white border border-purple-200 px-2.5 py-1 rounded-md text-purple-900 font-medium flex items-center gap-1.5">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500">×</button>
                </span>
              )}

              {selectedSubcategory && (
                <span className="bg-white border border-pink-200 px-2.5 py-1 rounded-md text-pink-900 font-medium flex items-center gap-1.5">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory(null)} className="hover:text-red-500">×</button>
                </span>
              )}

              {selectedBrand && (
                <span className="bg-white border border-orange-200 px-2.5 py-1 rounded-md text-orange-950 font-medium flex items-center gap-1.5">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)} className="hover:text-red-500">×</button>
                </span>
              )}

              {maxPrice < 20000 && (
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-800 font-mono flex items-center gap-1.5">
                  ≤ {formatPKR(maxPrice)}
                  <button onClick={() => setMaxPrice(20000)} className="hover:text-red-500">×</button>
                </span>
              )}

              {searchQuery && (
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-800 flex items-center gap-1.5">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500">×</button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-[11px] text-pink-600 hover:underline font-semibold ml-auto"
              >
                Reset All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                We couldn't find any products matching your current filters. Try relaxing your search criteria or price limit.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
