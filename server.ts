import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Database Persistence Setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'shopsphere_db.json');

// Helper to seed initial data safely without importing .jpg
function getInitialDbState() {
  return {
    products: [
      {
        id: 'prod-bc-1',
        sku: 'BC-AUR-01',
        name: 'Aurora Rose Botanical Clarifying Toner & Serum Duo',
        category: 'Beauty & Cosmetics',
        subcategory: 'Skincare',
        brand: 'Botanica Organics',
        description: 'Enriched with organic Kashmiri rose water, niacinamide, and bakuchiol oil. Gently hydrates, minimizes pores, and promotes a luminous Pakistani bridal glow.',
        originalPrice: 4200,
        discountedPrice: 3350,
        discountPercentage: 20,
        stock: 28,
        rating: 4.9,
        reviewCount: 42,
        image: '/src/assets/images/product_beauty_skincare_1794241400871.jpg',
        gallery: [
          '/src/assets/images/product_beauty_skincare_1794241400871.jpg',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608248597359-543594e9f7eb?auto=format&fit=crop&w=800&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        specifications: {
          'Volume': '150ml Toner + 30ml Serum',
          'Skin Type': 'All Skin Types (Tested on South Asian Skin)',
          'Key Ingredients': 'Organic Rosewater, Bakuchiol, Hyaluronic Acid',
          'Origin': 'Lahore, Pakistan'
        },
        createdAt: '2026-10-15T10:00:00.000Z'
      },
      {
        id: 'prod-bc-2',
        sku: 'BC-OUD-02',
        name: 'Royal Amber Oud & Velvet Rose Artisan Extrait De Parfum',
        category: 'Beauty & Cosmetics',
        subcategory: 'Perfumes',
        brand: 'Junaid Jamshed Fragrances',
        description: 'A decadent Eastern blend of Taif roses, smokey Cambodian oud, spiced saffron, and golden amber with 24-hour long-lasting sillage.',
        originalPrice: 7500,
        discountedPrice: 5999,
        discountPercentage: 20,
        stock: 14,
        rating: 4.8,
        reviewCount: 88,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
        ],
        isFeatured: true,
        specifications: {
          'Fragrance Family': 'Oriental Floral Woody',
          'Concentration': 'Extrait de Parfum (30% Oil)',
          'Volume': '100ml / 3.4 fl oz',
          'Duration': 'Up to 24 Hours'
        },
        createdAt: '2026-10-16T11:00:00.000Z'
      },
      {
        id: 'prod-bc-3',
        sku: 'BC-MAK-03',
        name: 'Festive Velvet Matte Lip & Cheek Stain Palette',
        category: 'Beauty & Cosmetics',
        subcategory: 'Makeup',
        brand: 'Medora London',
        description: 'Weightless, non-drying multi-use cream formula in rich berry, terracotta, and soft dusty rose shades tailored for Asian undertones.',
        originalPrice: 2200,
        discountedPrice: 1750,
        discountPercentage: 20,
        stock: 45,
        rating: 4.7,
        reviewCount: 31,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'],
        isNewArrival: true,
        specifications: {
          'Finish': 'Velvet Matte',
          'Shades Included': 'Gulabi Rose, Khoya Berry, Terracotta Jam',
          'Cruelty Free': 'Yes, 100% Halal Certified'
        },
        createdAt: '2026-10-20T09:30:00.000Z'
      },
      {
        id: 'prod-wc-1',
        sku: 'WC-ZAR-01',
        name: 'Zariyah Embroidered Plum & Blush Lawn Luxury 3-Piece',
        category: "Women's Clothing",
        subcategory: 'Eastern Wear',
        brand: 'Sapphire Pret',
        description: 'Pure pima lawn kameez with intricate tilla thread embroidery on neckline and border, accompanied by pure organza embroidered dupatta and dyed cambric trousers.',
        originalPrice: 14500,
        discountedPrice: 11990,
        discountPercentage: 17,
        stock: 9,
        rating: 5.0,
        reviewCount: 64,
        image: '/src/assets/images/product_eastern_couture_1794241400091.jpg',
        gallery: [
          '/src/assets/images/product_eastern_couture_1794241400091.jpg',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Unstitched'],
        colors: ['Plum & Rose Gold', 'Emerald Green', 'Deep Teal'],
        specifications: {
          'Shirt Fabric': '100% Pima Lawn with Tilla Work',
          'Dupatta Fabric': 'Digital Embroidered Sheer Organza',
          'Trouser Fabric': 'Solid Cambric Cotton',
          'Care': 'Dry Clean Recommended'
        },
        createdAt: '2026-10-18T14:00:00.000Z'
      },
      {
        id: 'prod-wc-2',
        sku: 'WC-ABA-02',
        name: 'Midnight Black Nida Dubai Cut Designer Abaya',
        category: "Women's Clothing",
        subcategory: 'Abayas',
        brand: 'Hijab Al-Noor',
        description: 'Flowing premium Korean Nida fabric abaya with subtle pleating, concealed magnetic snap buttons, and matching chiffon Sheila hijab.',
        originalPrice: 8500,
        discountedPrice: 6800,
        discountPercentage: 20,
        stock: 19,
        rating: 4.9,
        reviewCount: 52,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
        sizes: ['52 (Small)', '54 (Medium)', '56 (Large)', '58 (XL)'],
        specifications: {
          'Fabric': 'Premium Korean Nida (Wrinkle Resistant)',
          'Style': 'Front Open with Inner Snaps',
          'Includes': 'Abaya + Matching Chiffon Sheila'
        },
        createdAt: '2026-10-19T12:00:00.000Z'
      },
      {
        id: 'prod-wc-3',
        sku: 'WC-CAS-03',
        name: 'Block-Print Bohemian Indigo Cotton Tunic Kurti',
        category: "Women's Clothing",
        subcategory: 'Casual Wear',
        brand: 'Generation Crafts',
        description: 'Handcrafted Ajrak inspired hand block printed flared kurti with wooden button detailing and mandarin collar.',
        originalPrice: 3800,
        discountedPrice: 2950,
        discountPercentage: 22,
        stock: 35,
        rating: 4.6,
        reviewCount: 29,
        image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        specifications: {
          'Fabric': '100% Breathable Lawn Cotton',
          'Technique': 'Hand Block Print',
          'Sleeves': 'Full Sleeves with Cuffed Hem'
        },
        createdAt: '2026-10-21T08:00:00.000Z'
      },
      {
        id: 'prod-mc-1',
        sku: 'MC-KHA-01',
        name: 'Heritage Egyptian Giza Cotton Shalwar Kameez Suit',
        category: "Men's Clothing",
        subcategory: 'Traditional Wear',
        brand: 'J. Junaid Jamshed',
        description: 'Woven with extra-long staple Egyptian Giza cotton for a crisp, wrinkle-free fall. Features a classic band collar and engraved bone buttons.',
        originalPrice: 9200,
        discountedPrice: 7490,
        discountPercentage: 18,
        stock: 22,
        rating: 4.9,
        reviewCount: 73,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Off-White', 'Charcoal Slate', 'Navy Blue', 'Olive Khaki'],
        specifications: {
          'Fabric': '100% Giza Egyptian Cotton',
          'Collar': 'Stiffened Band Collar',
          'Cuff': 'Single Button Convertible'
        },
        createdAt: '2026-10-14T09:00:00.000Z'
      },
      {
        id: 'prod-mc-2',
        sku: 'MC-SHI-02',
        name: 'Smart-Fit Oxford Cotton Formal Button-Down Shirt',
        category: "Men's Clothing",
        subcategory: 'Shirts',
        brand: 'Uniworth Dress Co.',
        description: 'Crisp pinpoint Oxford cotton shirt tailored for business and formal evening wear.',
        originalPrice: 4500,
        discountedPrice: 3600,
        discountPercentage: 20,
        stock: 30,
        rating: 4.7,
        reviewCount: 41,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
        sizes: ['38 (15")', '40 (15.5")', '42 (16")', '44 (16.5")'],
        colors: ['Sky Blue', 'Crisp White', 'Soft Pink'],
        specifications: {
          'Weave': 'Pinpoint Oxford',
          'Fit': 'Contemporary Slim Fit'
        },
        createdAt: '2026-10-17T11:00:00.000Z'
      },
      {
        id: 'prod-sh-1',
        sku: 'SH-KHP-01',
        name: 'Handcrafted Peshawari Chappal in Pure Cowhide Leather',
        category: 'Shoes',
        subcategory: 'Sandals',
        brand: 'Charsadda Heritage',
        description: 'Authentic Kaptaan-style Peshawari sandal handcrafted in KP with recycled tire rubber grip.',
        originalPrice: 5500,
        discountedPrice: 4400,
        discountPercentage: 20,
        stock: 18,
        rating: 4.9,
        reviewCount: 95,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'],
        isBestSeller: true,
        sizes: ['40 (7)', '41 (8)', '42 (9)', '43 (10)', '44 (11)'],
        colors: ['Mustard Mustard', 'Oxblood Cherry', 'Jet Black'],
        specifications: {
          'Upper': '100% Genuine Cow Leather',
          'Sole': 'Recycled Aeroplane Tire Rubber'
        },
        createdAt: '2026-10-11T13:00:00.000Z'
      },
      {
        id: 'prod-sh-2',
        sku: 'SH-SNK-02',
        name: 'AeroCloud Ultra-Responsive Performance Sneakers',
        category: 'Shoes',
        subcategory: 'Sneakers',
        brand: 'Servis Cheetah',
        description: 'Engineered mesh running shoes with responsive foam cushioning and anti-slip rubber pods.',
        originalPrice: 6800,
        discountedPrice: 5290,
        discountPercentage: 22,
        stock: 25,
        rating: 4.8,
        reviewCount: 38,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
        sizes: ['39', '40', '41', '42', '43', '44'],
        colors: ['Solar Red & Black', 'Triple White'],
        specifications: {
          'Weight': '240g per shoe',
          'Midsole': 'Nitro-Foam High Rebound'
        },
        createdAt: '2026-10-13T16:00:00.000Z'
      },
      {
        id: 'prod-bg-1',
        sku: 'BG-TOT-01',
        name: 'Signature Monogram Structured Leather Tote Bag',
        category: 'Bags',
        subcategory: 'Handbags',
        brand: 'Hub Leather Pakistan',
        description: 'Full-grain leather bag with 14" padded laptop sleeve and detachable crossbody strap.',
        originalPrice: 12500,
        discountedPrice: 9990,
        discountPercentage: 20,
        stock: 12,
        rating: 4.9,
        reviewCount: 47,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        colors: ['Cognac Tan', 'Midnight Black'],
        specifications: {
          'Dimensions': '38cm x 28cm x 14cm',
          'Laptop Compartment': 'Up to 14-inch'
        },
        createdAt: '2026-10-16T15:00:00.000Z'
      },
      {
        id: 'prod-bg-2',
        sku: 'BG-BAK-02',
        name: 'Nomad Water-Resistant Urban Travel Backpack',
        category: 'Bags',
        subcategory: 'Backpacks',
        brand: 'Borjan Travel Tech',
        description: '30-liter commuter backpack with TSA flat opening and water-repellent ballistic nylon.',
        originalPrice: 7200,
        discountedPrice: 5750,
        discountPercentage: 20,
        stock: 26,
        rating: 4.7,
        reviewCount: 34,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
        specifications: {
          'Capacity': '30 Liters',
          'Material': '1680D Ballistic Cordura Nylon'
        },
        createdAt: '2026-10-22T08:00:00.000Z'
      },
      {
        id: 'prod-el-1',
        sku: 'EL-WAT-01',
        name: 'Apex Ultra Pro Smartwatch with ANC Earbuds Combo',
        category: 'Electronics',
        subcategory: 'Smart Watches',
        brand: 'Audionic Pakistan',
        description: '1.96-inch HD AMOLED Always-On display, Bluetooth calling with PTCL/Jazz SIM pairing, SpO2 & Heart Rate tracking, plus IP68 waterproof rating.',
        originalPrice: 11999,
        discountedPrice: 8499,
        discountPercentage: 29,
        stock: 16,
        rating: 4.8,
        reviewCount: 114,
        image: '/src/assets/images/product_smartwatch_audio_1794241401760.jpg',
        gallery: [
          '/src/assets/images/product_smartwatch_audio_1794241401760.jpg',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        colors: ['Titanium Grey', 'Obsidian Black'],
        specifications: {
          'Display': '1.96" Super AMOLED',
          'Battery Life': 'Up to 7 Days Normal Use',
          'Connectivity': 'Bluetooth 5.3 Low Energy',
          'Warranty': '1 Year Official Audionic Warranty'
        },
        createdAt: '2026-10-10T12:00:00.000Z'
      },
      {
        id: 'prod-el-2',
        sku: 'EL-AUD-02',
        name: 'BassDrop 360 Wireless Portable Bluetooth Speaker',
        category: 'Electronics',
        subcategory: 'Speakers',
        brand: 'Ronin Wireless',
        description: '30W stereo audio with dual passive radiators, 18-hour continuous battery life, RGB beat-sync ring light.',
        originalPrice: 8000,
        discountedPrice: 6200,
        discountPercentage: 22,
        stock: 20,
        rating: 4.7,
        reviewCount: 68,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
        specifications: {
          'Power Output': '30W RMS',
          'Playtime': '18 Hours',
          'Waterproof': 'IPX7 Submersible'
        },
        createdAt: '2026-10-18T16:00:00.000Z'
      },
      {
        id: 'prod-hl-1',
        sku: 'HL-LMP-01',
        name: 'Hand-Carved Himalayan Pink Crystal Salt Lamp with Dimmer',
        category: 'Home & Living',
        subcategory: 'Home Decor',
        brand: 'Khewra Mineral Craft',
        description: 'Authentic 100% natural salt rock mined directly from Khewra Salt Mines in Punjab. Emits soothing negative ions and warm glow.',
        originalPrice: 3200,
        discountedPrice: 2490,
        discountPercentage: 22,
        stock: 32,
        rating: 4.9,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        specifications: {
          'Weight': '3.5 kg - 4.5 kg Natural Rock',
          'Base': 'Solid Neem Wood Base',
          'Cord': 'Rotary Dimmer Switch'
        },
        createdAt: '2026-10-12T10:00:00.000Z'
      },
      {
        id: 'prod-hl-2',
        sku: 'HL-KIT-02',
        name: 'Heritage Clay Handi & Ceramic Serving Bowl Set',
        category: 'Home & Living',
        subcategory: 'Kitchen Items',
        brand: 'Gujrat Pottery Works',
        description: 'Authentic lead-free glazed terracotta cooking handi crafted in Gujrat for authentic Dum Biryani and Karahi.',
        originalPrice: 4800,
        discountedPrice: 3850,
        discountPercentage: 20,
        stock: 15,
        rating: 4.8,
        reviewCount: 49,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'],
        specifications: {
          'Material': '100% Organic Terracotta Clay',
          'Capacity': '2.5 Liters Handi + 2 Serving Bowls'
        },
        createdAt: '2026-10-20T14:00:00.000Z'
      },
      {
        id: 'prod-ja-1',
        sku: 'JA-KUN-01',
        name: 'Royal Mughal Kundan Polki Choker & Jhumka Earring Set',
        category: 'Jewelry & Accessories',
        subcategory: 'Necklaces',
        brand: 'Naurattan Heritage Jewellers',
        description: 'Traditional 22K gold electroplated bridal choker with genuine pearls, emerald glass drops, and hand-meenakari craftsmanship.',
        originalPrice: 15500,
        discountedPrice: 12400,
        discountPercentage: 20,
        stock: 8,
        rating: 5.0,
        reviewCount: 39,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        isBestSeller: true,
        specifications: {
          'Plating': '22K Micro Gold Plating (Non-Tarnish)',
          'Stones': 'Semi-Precious Kundan Polki & Fresh Water Pearls',
          'Included': 'Choker Necklace + Matching Chandbali Jhumkas'
        },
        createdAt: '2026-10-15T15:00:00.000Z'
      },
      {
        id: 'prod-ja-2',
        sku: 'JA-WAT-02',
        name: 'Gentleman Chronograph Rose Gold Mesh Wristwatch',
        category: 'Jewelry & Accessories',
        subcategory: 'Watches',
        brand: 'Sveston Pakistan',
        description: 'Precision Japanese quartz movement with active date window and Milanese magnetic mesh band.',
        originalPrice: 8500,
        discountedPrice: 6790,
        discountPercentage: 20,
        stock: 14,
        rating: 4.8,
        reviewCount: 76,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        gallery: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'],
        specifications: {
          'Case Diameter': '41mm',
          'Movement': 'Japanese Miyota Quartz',
          'Water Resistance': '30M / 3ATM'
        },
        createdAt: '2026-10-19T10:00:00.000Z'
      }
    ],
    coupons: [
      {
        id: 'c-welcome',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minSpend: 2000,
        maxDiscount: 1500,
        expiryDate: '2026-12-31',
        usageLimit: 500,
        usedCount: 84,
        isActive: true,
        description: '10% off on your first order across Pakistan (Min. Rs. 2,000)'
      },
      {
        id: 'c-azadi',
        code: 'AZADI20',
        discountType: 'percentage',
        discountValue: 20,
        minSpend: 5000,
        maxDiscount: 2500,
        expiryDate: '2026-12-31',
        usageLimit: 200,
        usedCount: 47,
        isActive: true,
        description: 'Flat 20% discount on orders above Rs. 5,000'
      },
      {
        id: 'c-freeship',
        code: 'FREESHIP',
        discountType: 'fixed',
        discountValue: 250,
        minSpend: 2500,
        expiryDate: '2026-12-31',
        usageLimit: 1000,
        usedCount: 312,
        isActive: true,
        description: 'Zero delivery fee on orders over Rs. 2,500'
      }
    ],
    users: [
      {
        id: 'user-admin-1',
        name: 'Shopsphere Store Owner',
        email: 'admin@shopsphere.pk',
        password: 'Admin@1234',
        phone: '0300-1234567',
        role: 'admin',
        city: 'Lahore',
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'user-customer-1',
        name: 'Hafsa Khan',
        email: 'hafsa.pk.25@gmail.com',
        password: 'Customer@1234',
        phone: '0321-7654321',
        role: 'customer',
        address: 'House #42, Street 8, Block F, DHA Phase 5',
        city: 'Lahore',
        postalCode: '54792',
        createdAt: '2026-09-01T12:00:00.000Z',
        savedAddresses: [
          {
            fullName: 'Hafsa Khan',
            phone: '0321-7654321',
            email: 'hafsa.pk.25@gmail.com',
            address: 'House #42, Street 8, Block F, DHA Phase 5',
            city: 'Lahore',
            postalCode: '54792',
            notes: 'Ring bell at side gate'
          }
        ]
      }
    ],
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'PK-918241',
        userId: 'user-customer-1',
        customerName: 'Hafsa Khan',
        customerEmail: 'hafsa.pk.25@gmail.com',
        customerPhone: '0321-7654321',
        shippingAddress: {
          fullName: 'Hafsa Khan',
          phone: '0321-7654321',
          email: 'hafsa.pk.25@gmail.com',
          address: 'House #42, Street 8, Block F, DHA Phase 5',
          city: 'Lahore',
          postalCode: '54792'
        },
        items: [
          {
            productId: 'prod-wc-1',
            name: 'Zariyah Embroidered Plum & Blush Lawn Luxury 3-Piece',
            image: '/src/assets/images/product_eastern_couture_1794241400091.jpg',
            price: 11990,
            quantity: 1,
            selectedSize: 'M',
            selectedColor: 'Plum & Rose Gold',
            total: 11990
          },
          {
            productId: 'prod-bc-1',
            name: 'Aurora Rose Botanical Clarifying Toner & Serum Duo',
            image: '/src/assets/images/product_beauty_skincare_1794241400871.jpg',
            price: 3350,
            quantity: 1,
            total: 3350
          }
        ],
        subtotal: 15340,
        discountAmount: 1534,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        totalAmount: 13806,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'Pending (COD)',
        orderStatus: 'Shipped',
        courierName: 'TCS Express Pakistan',
        courierTrackingNumber: 'TCS-PK-9821447',
        createdAt: '2026-11-06T14:32:00.000Z',
        updatedAt: '2026-11-08T10:15:00.000Z',
        history: [
          { status: 'Order Placed', timestamp: '2026-11-06T14:32:00.000Z', note: 'Customer placed order via website' },
          { status: 'Order Confirmed', timestamp: '2026-11-06T16:00:00.000Z', note: 'Phone verification confirmed by customer' },
          { status: 'Processing', timestamp: '2026-11-07T09:00:00.000Z', note: 'Packed at Shopsphere Central Hub, Lahore' },
          { status: 'Shipped', timestamp: '2026-11-08T10:15:00.000Z', note: 'Handed over to TCS Express (AWB: TCS-PK-9821447)' }
        ]
      },
      {
        id: 'ord-1002',
        orderNumber: 'PK-840192',
        userId: 'user-customer-1',
        customerName: 'Hafsa Khan',
        customerEmail: 'hafsa.pk.25@gmail.com',
        customerPhone: '0321-7654321',
        shippingAddress: {
          fullName: 'Hafsa Khan',
          phone: '0321-7654321',
          email: 'hafsa.pk.25@gmail.com',
          address: 'House #42, Street 8, Block F, DHA Phase 5',
          city: 'Lahore',
          postalCode: '54792'
        },
        items: [
          {
            productId: 'prod-hl-1',
            name: 'Hand-Carved Himalayan Pink Crystal Salt Lamp with Dimmer',
            image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
            price: 2490,
            quantity: 2,
            total: 4980
          }
        ],
        subtotal: 4980,
        discountAmount: 250,
        couponCode: 'FREESHIP',
        shippingFee: 0,
        totalAmount: 4730,
        paymentMethod: 'Easypaisa',
        paymentStatus: 'Paid',
        paymentReference: 'EP-TRX-88231947',
        orderStatus: 'Delivered',
        courierName: 'Leopards Courier',
        courierTrackingNumber: 'LEO-7749210',
        createdAt: '2026-10-24T11:20:00.000Z',
        updatedAt: '2026-10-27T16:45:00.000Z',
        history: [
          { status: 'Order Placed', timestamp: '2026-10-24T11:20:00.000Z' },
          { status: 'Order Confirmed', timestamp: '2026-10-24T12:00:00.000Z' },
          { status: 'Processing', timestamp: '2026-10-25T10:00:00.000Z' },
          { status: 'Shipped', timestamp: '2026-10-26T08:30:00.000Z' },
          { status: 'Out for Delivery', timestamp: '2026-10-27T11:00:00.000Z' },
          { status: 'Delivered', timestamp: '2026-10-27T16:45:00.000Z', note: 'Received by customer with signature' }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        productId: 'prod-wc-1',
        userId: 'user-customer-1',
        userName: 'Hafsa Khan',
        userCity: 'Lahore',
        rating: 5,
        comment: 'SubhanAllah the embroidery quality is breathtaking! The fabric is soft and the organza dupatta has very neat tilla borders. Delivery arrived in 2 days in Lahore.',
        date: '2026-10-28',
        verifiedPurchase: true,
        approved: true
      },
      {
        id: 'rev-2',
        productId: 'prod-bc-1',
        userId: 'user-2',
        userName: 'Ayesha Malik',
        userCity: 'Karachi',
        rating: 5,
        comment: 'The rose aroma is so calming! My skin feels super hydrated even in Karachi dry AC weather. Ordered my second bottle.',
        date: '2026-10-29',
        verifiedPurchase: true,
        approved: true
      },
      {
        id: 'rev-3',
        productId: 'prod-el-1',
        userId: 'user-3',
        userName: 'Bilal Tariq',
        userCity: 'Islamabad',
        rating: 5,
        comment: 'Battery lasted 6 days on a single charge. Bluetooth call sound is loud and clear. Great Pakistani product!',
        date: '2026-11-01',
        verifiedPurchase: true,
        approved: true
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'all',
        title: 'Grand Festive Sale is Live!',
        message: 'Enjoy up to 30% off across Beauty, Eastern Fashion, and Home Living. Use code WELCOME10 for an extra 10% discount.',
        type: 'promo',
        isRead: false,
        createdAt: '2026-11-08T08:00:00.000Z'
      },
      {
        id: 'notif-2',
        userId: 'user-customer-1',
        title: 'Order PK-918241 Shipped!',
        message: 'Your order has been dispatched with TCS Express tracking number TCS-PK-9821447. Delivery expected in 24-48 hours.',
        type: 'order',
        isRead: false,
        createdAt: '2026-11-08T10:15:00.000Z',
        link: 'track-order'
      },
      {
        id: 'notif-3',
        userId: 'admin',
        title: 'New Customer Order Received',
        message: 'Order PK-918241 (Rs. 13,806) placed by Hafsa Khan awaiting packing.',
        type: 'order',
        isRead: false,
        createdAt: '2026-11-06T14:32:00.000Z'
      }
    ]
  };
}

function readDb(): any {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialDbState();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db file, restoring initial state', err);
    const initialData = getInitialDbState();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDb(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// REST API Endpoints

// 1. Health & Store Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Shopsphere Pakistan',
    tagline: 'Premium Online Shopping Nationwide',
    currency: 'PKR',
    timestamp: new Date().toISOString()
  });
});

// 2. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  let items = db.products || [];

  const { category, subcategory, search, sort, isFeatured, isBestSeller, isNewArrival, minPrice, maxPrice } = req.query;

  if (category) {
    items = items.filter((p: any) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (subcategory) {
    items = items.filter((p: any) => p.subcategory.toLowerCase() === String(subcategory).toLowerCase());
  }
  if (isFeatured === 'true') {
    items = items.filter((p: any) => p.isFeatured);
  }
  if (isBestSeller === 'true') {
    items = items.filter((p: any) => p.isBestSeller);
  }
  if (isNewArrival === 'true') {
    items = items.filter((p: any) => p.isNewArrival);
  }
  if (minPrice) {
    items = items.filter((p: any) => p.discountedPrice >= Number(minPrice));
  }
  if (maxPrice) {
    items = items.filter((p: any) => p.discountedPrice <= Number(maxPrice));
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === 'price-asc') {
    items.sort((a: any, b: any) => a.discountedPrice - b.discountedPrice);
  } else if (sort === 'price-desc') {
    items.sort((a: any, b: any) => b.discountedPrice - a.discountedPrice);
  } else if (sort === 'rating') {
    items.sort((a: any, b: any) => b.rating - a.rating);
  } else if (sort === 'discount') {
    items.sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);
  } else {
    // Newest default
    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products: items, total: items.length });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const product = (db.products || []).find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const reviews = (db.reviews || []).filter((r: any) => r.productId === product.id && r.approved);
  res.json({ product, reviews });
});

// Admin Add Product
app.post('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  const {
    name,
    category,
    subcategory,
    brand,
    description,
    originalPrice,
    discountedPrice,
    stock,
    image,
    gallery,
    sizes,
    colors,
    specifications,
    isFeatured
  } = req.body;

  if (!name || !category || !originalPrice) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const finalDiscountPrice = discountedPrice || originalPrice;
  const discountPercentage = Math.round(((originalPrice - finalDiscountPrice) / originalPrice) * 100);

  const newProduct = {
    id: `prod-${Date.now()}`,
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    category,
    subcategory: subcategory || 'General',
    brand: brand || 'Shopsphere Selected',
    description: description || '',
    originalPrice: Number(originalPrice),
    discountedPrice: Number(finalDiscountPrice),
    discountPercentage: Math.max(0, discountPercentage),
    stock: Number(stock ?? 10),
    rating: 5.0,
    reviewCount: 0,
    image: image || '/src/assets/images/product_beauty_skincare_1794241400871.jpg',
    gallery: gallery && gallery.length > 0 ? gallery : [image],
    sizes: sizes || [],
    colors: colors || [],
    specifications: specifications || {},
    isFeatured: !!isFeatured,
    isNewArrival: true,
    createdAt: new Date().toISOString()
  };

  db.products = [newProduct, ...(db.products || [])];
  writeDb(db);

  res.status(201).json({ product: newProduct });
});

// Admin Update Product
app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.products || []).findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : existing.originalPrice,
    discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : existing.discountedPrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
  };

  if (updated.originalPrice && updated.discountedPrice) {
    updated.discountPercentage = Math.round(
      ((updated.originalPrice - updated.discountedPrice) / updated.originalPrice) * 100
    );
  }

  db.products[index] = updated;
  writeDb(db);

  res.json({ product: updated });
});

// Admin Delete Product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }
  writeDb(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 3. Categories API
app.get('/api/categories', (_req: Request, res: Response) => {
  const db = readDb();
  const categories = [
    'Beauty & Cosmetics',
    "Women's Clothing",
    "Men's Clothing",
    'Shoes',
    'Bags',
    'Electronics',
    'Home & Living',
    'Jewelry & Accessories'
  ];

  const result = categories.map((cat) => {
    const productsInCat = (db.products || []).filter((p: any) => p.category === cat);
    return {
      name: cat,
      count: productsInCat.length,
      image: productsInCat[0]?.image || '/src/assets/images/hero_shopsphere_banner_1794241400435.jpg'
    };
  });

  res.json({ categories: result });
});

// 4. Authentication API
app.post('/api/auth/register', (req: Request, res: Response) => {
  const db = readDb();
  const { name, email, phone, password, address, city, postalCode } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Please provide name, email, phone, and password' });
  }

  const existing = (db.users || []).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone,
    password, // in production hash with bcrypt
    role: 'customer',
    address: address || '',
    city: city || 'Karachi',
    postalCode: postalCode || '',
    createdAt: new Date().toISOString(),
    savedAddresses: address
      ? [
          {
            fullName: name,
            phone,
            email,
            address,
            city: city || 'Karachi',
            postalCode: postalCode || ''
          }
        ]
      : []
  };

  db.users = [...(db.users || []), newUser];

  // Also add welcome notification
  db.notifications = [
    {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to Shopsphere Pakistan!',
      message: 'Your account has been created. Use coupon code WELCOME10 to get 10% off your first order.',
      type: 'promo',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    ...(db.notifications || [])
  ];

  writeDb(db);

  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ user: userWithoutPass, token: `token-${newUser.id}` });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = readDb();
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Please provide email/phone and password' });
  }

  const user = (db.users || []).find(
    (u: any) =>
      (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: `token-${user.id}` });
});

// Update Customer Profile
app.put('/api/users/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = (db.users || []).findIndex((u: any) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = db.users[index];
  const { name, phone, address, city, postalCode, password, newPassword, savedAddresses } = req.body;

  if (newPassword) {
    if (user.password !== password) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    user.password = newPassword;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (city !== undefined) user.city = city;
  if (postalCode !== undefined) user.postalCode = postalCode;
  if (savedAddresses) user.savedAddresses = savedAddresses;

  db.users[index] = user;
  writeDb(db);

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass });
});

// Admin Get All Users
app.get('/api/users', (_req: Request, res: Response) => {
  const db = readDb();
  const users = (db.users || []).map((u: any) => {
    const { password, ...rest } = u;
    const userOrders = (db.orders || []).filter((o: any) => o.userId === u.id);
    const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    return {
      ...rest,
      orderCount: userOrders.length,
      totalSpent
    };
  });
  res.json({ users });
});

// 5. Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const { userId, status, search } = req.query;
  let orders = db.orders || [];

  if (userId) {
    orders = orders.filter((o: any) => o.userId === userId);
  }
  if (status && status !== 'all') {
    orders = orders.filter((o: any) => o.orderStatus === status);
  }
  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter((o: any) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  }

  orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ orders });
});

// Look up order by ID or orderNumber
app.get('/api/orders/:identifier', (req: Request, res: Response) => {
  const db = readDb();
  const idOrNum = req.params.identifier;
  const order = (db.orders || []).find(
    (o: any) => o.id === idOrNum || o.orderNumber.toLowerCase() === idOrNum.toLowerCase()
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ order });
});

// Create Order (Checkout)
app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal,
    discountAmount,
    couponCode,
    shippingFee,
    totalAmount,
    paymentMethod,
    paymentReference
  } = req.body;

  if (!items || items.length === 0 || !shippingAddress || !customerName) {
    return res.status(400).json({ error: 'Incomplete order payload' });
  }

  // Stock check and deduction
  for (const item of items) {
    const product = (db.products || []).find((p: any) => p.id === item.productId);
    if (product) {
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
      product.stock -= item.quantity;
    }
  }

  // If coupon was used, increment usage count
  if (couponCode) {
    const coupon = (db.coupons || []).find((c: any) => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
    }
  }

  const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  let paymentStatus = 'Pending (COD)';
  if (paymentMethod === 'Online Card Payment' || paymentMethod === 'Easypaisa' || paymentMethod === 'JazzCash') {
    paymentStatus = 'Paid';
  } else if (paymentMethod === 'Bank Transfer') {
    paymentStatus = 'Awaiting Verification';
  }

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: userId || `guest-${Date.now()}`,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal: Number(subtotal),
    discountAmount: Number(discountAmount || 0),
    couponCode: couponCode || null,
    shippingFee: Number(shippingFee || 0),
    totalAmount: Number(totalAmount),
    paymentMethod,
    paymentStatus,
    paymentReference: paymentReference || null,
    orderStatus: 'Order Placed',
    courierName: 'TCS Express Pakistan',
    courierTrackingNumber: `TCS-${orderNumber}`,
    createdAt: now,
    updatedAt: now,
    history: [
      {
        status: 'Order Placed',
        timestamp: now,
        note: `Order placed successfully via ${paymentMethod}`
      }
    ]
  };

  db.orders = [newOrder, ...(db.orders || [])];

  // Add notification for customer
  if (userId) {
    db.notifications = [
      {
        id: `notif-${Date.now()}-cust`,
        userId,
        title: `Order Confirmed: #${orderNumber}`,
        message: `Thank you! Your order of Rs. ${totalAmount.toLocaleString()} has been received and is being prepared.`,
        type: 'order',
        isRead: false,
        createdAt: now,
        link: 'track-order'
      },
      ...(db.notifications || [])
    ];
  }

  // Add notification for admin
  db.notifications = [
    {
      id: `notif-${Date.now()}-admin`,
      userId: 'admin',
      title: `New Order Received #${orderNumber}`,
      message: `${customerName} placed order #${orderNumber} for Rs. ${totalAmount.toLocaleString()} (${paymentMethod}).`,
      type: 'order',
      isRead: false,
      createdAt: now
    },
    ...(db.notifications || [])
  ];

  writeDb(db);

  res.status(201).json({ order: newOrder });
});

// Update Order Status (Admin or Customer Cancel)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = readDb();
  const { status, note, courierName, courierTrackingNumber } = req.body;
  const index = (db.orders || []).findIndex((o: any) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = db.orders[index];
  const previousStatus = order.orderStatus;
  const now = new Date().toISOString();

  // If cancelling an order, restore product inventory
  if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
    for (const item of order.items) {
      const product = (db.products || []).find((p: any) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    }
    order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';
  }

  order.orderStatus = status;
  order.updatedAt = now;
  if (courierName) order.courierName = courierName;
  if (courierTrackingNumber) order.courierTrackingNumber = courierTrackingNumber;

  order.history = [
    ...(order.history || []),
    {
      status,
      timestamp: now,
      note: note || `Status updated from ${previousStatus} to ${status}`
    }
  ];

  // Notify customer of status change
  if (order.userId) {
    db.notifications = [
      {
        id: `notif-${Date.now()}`,
        userId: order.userId,
        title: `Order #${order.orderNumber} ${status}`,
        message: note || `Your order #${order.orderNumber} status is now: ${status}`,
        type: 'order',
        isRead: false,
        createdAt: now,
        link: 'track-order'
      },
      ...(db.notifications || [])
    ];
  }

  db.orders[index] = order;
  writeDb(db);

  res.json({ order });
});

// 6. Coupons API
app.get('/api/coupons', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ coupons: db.coupons || [] });
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const db = readDb();
  const { code, subtotal } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Coupon code required' });
  }

  const coupon = (db.coupons || []).find(
    (c: any) => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ valid: false, message: 'Coupon usage limit has been reached' });
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ valid: false, message: 'This coupon has expired' });
  }

  if (subtotal < coupon.minSpend) {
    return res.status(400).json({
      valid: false,
      message: `Minimum purchase of Rs. ${coupon.minSpend.toLocaleString()} required for this coupon`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    coupon,
    discountAmount: discount,
    message: `Coupon ${coupon.code} applied: Save Rs. ${discount.toLocaleString()}!`
  });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const db = readDb();
  const { code, discountType, discountValue, minSpend, maxDiscount, expiryDate, usageLimit, description } = req.body;

  if (!code || !discountValue) {
    return res.status(400).json({ error: 'Code and discount value required' });
  }

  const newCoupon = {
    id: `c-${Date.now()}`,
    code: String(code).toUpperCase().trim(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minSpend: Number(minSpend || 0),
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    expiryDate: expiryDate || '2027-12-31',
    usageLimit: Number(usageLimit || 1000),
    usedCount: 0,
    isActive: true,
    description: description || `${discountValue}${discountType === 'percentage' ? '%' : ' PKR'} off`
  };

  db.coupons = [...(db.coupons || []), newCoupon];
  writeDb(db);
  res.status(201).json({ coupon: newCoupon });
});

app.delete('/api/coupons/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.coupons = (db.coupons || []).filter((c: any) => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// 7. Reviews API
app.get('/api/reviews', (req: Request, res: Response) => {
  const db = readDb();
  const { productId } = req.query;
  let reviews = db.reviews || [];
  if (productId) {
    reviews = reviews.filter((r: any) => r.productId === productId);
  }
  res.json({ reviews });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const db = readDb();
  const { productId, userId, userName, userCity, rating, comment } = req.body;

  if (!productId || !comment || !rating) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    userId: userId || 'guest',
    userName: userName || 'Verified Customer',
    userCity: userCity || 'Pakistan',
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true,
    approved: true
  };

  db.reviews = [newReview, ...(db.reviews || [])];

  // Recalculate product rating
  const prodReviews = db.reviews.filter((r: any) => r.productId === productId);
  const avg = prodReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prodReviews.length;
  const prod = (db.products || []).find((p: any) => p.id === productId);
  if (prod) {
    prod.rating = parseFloat(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  writeDb(db);
  res.status(201).json({ review: newReview });
});

// 8. Notifications API
app.get('/api/notifications', (req: Request, res: Response) => {
  const db = readDb();
  const { userId } = req.query;
  let list = db.notifications || [];

  if (userId === 'admin') {
    list = list.filter((n: any) => n.userId === 'admin' || n.userId === 'all');
  } else if (userId) {
    list = list.filter((n: any) => n.userId === userId || n.userId === 'all');
  }

  res.json({ notifications: list });
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const db = readDb();
  const notif = (db.notifications || []).find((n: any) => n.id === req.params.id);
  if (notif) {
    notif.isRead = true;
    writeDb(db);
  }
  res.json({ success: true });
});

// 9. Admin Stats API
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const db = readDb();
  const orders = db.orders || [];
  const products = db.products || [];
  const users = (db.users || []).filter((u: any) => u.role === 'customer');

  const totalSales = orders
    .filter((o: any) => o.orderStatus !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o: any) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing').length;
  const deliveredOrders = orders.filter((o: any) => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter((p: any) => p.stock <= 10).length;

  // Category breakdown
  const categoryStats: Record<string, { count: number; revenue: number }> = {};
  for (const o of orders) {
    if (o.orderStatus === 'Cancelled') continue;
    for (const it of o.items) {
      const prod = products.find((p: any) => p.id === it.productId);
      const cat = prod?.category || 'Other';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, revenue: 0 };
      }
      categoryStats[cat].count += it.quantity;
      categoryStats[cat].revenue += it.total;
    }
  }

  res.json({
    totalSales,
    totalOrders: orders.length,
    totalCustomers: users.length,
    totalProducts: products.length,
    pendingOrders,
    deliveredOrders,
    lowStockProducts,
    categoryStats
  });
});

// Mount Vite or Static Distribution
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shopsphere Pakistan Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Shopsphere server', err);
});
