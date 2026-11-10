import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory } from '../../types';
import { EASTERN_COUTURE_IMAGE, BEAUTY_SKINCARE_IMAGE, SMARTWATCH_AUDIO_IMAGE } from '../../data/initialData';

interface CategoryCardItem {
  name: ProductCategory;
  subcategories: string[];
  image: string;
  tagline: string;
}

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setCurrentView, products } = useShop();

  const categoryList: CategoryCardItem[] = [
    {
      name: 'Beauty & Cosmetics',
      subcategories: ['Skincare', 'Perfumes', 'Makeup', 'Haircare'],
      image: BEAUTY_SKINCARE_IMAGE,
      tagline: 'Pure botanicals & luxury oud fragrances'
    },
    {
      name: "Women's Clothing",
      subcategories: ['Eastern Wear', 'Abayas', 'Formal Wear', 'Casual Wear'],
      image: EASTERN_COUTURE_IMAGE,
      tagline: 'Embroidered lawn, silk & designer pret'
    },
    {
      name: "Men's Clothing",
      subcategories: ['Traditional Wear', 'Shirts', 'T-Shirts', 'Jeans'],
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      tagline: 'Egyptian cotton shalwar kameez & smart shirts'
    },
    {
      name: 'Shoes',
      subcategories: ['Sandals', 'Sneakers', 'Heels', 'Formal Shoes'],
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      tagline: 'Handmade Peshawari chappals & sneakers'
    },
    {
      name: 'Bags',
      subcategories: ['Handbags', 'Backpacks', 'Shoulder Bags', 'Travel Bags'],
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      tagline: 'Structured leather totes & travel backpacks'
    },
    {
      name: 'Electronics',
      subcategories: ['Smart Watches', 'Speakers', 'Headphones', 'Laptops'],
      image: SMARTWATCH_AUDIO_IMAGE,
      tagline: 'Smartwatches, wireless audio & smart gadgets'
    },
    {
      name: 'Home & Living',
      subcategories: ['Home Decor', 'Kitchen Items', 'Furniture', 'Accessories'],
      image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
      tagline: 'Himalayan salt lamps & clay pottery'
    },
    {
      name: 'Jewelry & Accessories',
      subcategories: ['Watches', 'Necklaces', 'Earrings', 'Bracelets'],
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      tagline: 'Bridal Kundan Polki & chronographs'
    }
  ];

  const handleSelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore 8 premium departments crafted for discerning Pakistani shoppers.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('shop');
          }}
          className="text-xs sm:text-sm font-bold text-purple-700 hover:text-pink-600 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categoryList.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.name}
              onClick={() => handleSelect(cat.name)}
              className="group relative bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-pink-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                
                {/* Count Badge in image */}
                <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-bold bg-white/90 text-purple-900 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {count} Products
                </span>
              </div>

              {/* Text Info */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-purple-700 font-semibold group-hover:text-pink-600">
                  <span>Explore Collection</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
