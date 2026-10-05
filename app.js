a/**
 * Restock Club Groceries - Core Application Logic
 * Products, coupons & settings are synced from the Admin Panel (admin.html)
 * via localStorage keys: fh_admin_products | fh_admin_coupons | fh_admin_settings
 */

// --- 1. Categories Data (Synced from Admin Panel / Supabase) ---
const CATEGORIES_DEFAULT = [
  { id: 'vegetables', name: 'Vegetables', icon: '🥦', sort_order: 1, active: true },
  { id: 'grocery', name: 'Grocery', icon: '🛒', sort_order: 2, active: true },
  { id: 'fruits', name: 'Fruits', icon: '🍎', sort_order: 3, active: true },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', sort_order: 4, active: true },
  { id: 'bakery', name: 'Bakery', icon: '🥖', sort_order: 5, active: true },
  { id: 'beverages', name: 'Beverages', icon: '🥤', sort_order: 6, active: true },
  { id: 'snacks', name: 'Snacks', icon: '🍿', sort_order: 7, active: true }
];
let CATEGORIES = [...CATEGORIES_DEFAULT];

// --- 1b. Hero Carousel Banners (Synced from Admin Panel / Supabase) ---
const BANNERS_DEFAULT = [
  {
    id: 'banner-1',
    title: 'THE DAILY SPREAD',
    subtitle: '',
    pill: 'House of bb',
    starburst_text: 'Start your\nday @',
    starburst_price: '₹19',
    image: 'assets/daily_spread_promo.jpg',
    cta_text: 'Shop now',
    cta_link: '#groceries-heading',
    bg_gradient: '#FFDD33',
    sort_order: 1,
    active: true
  },
  {
    id: 'banner-2',
    title: 'FARM FRESH HARVEST',
    subtitle: '',
    pill: '100% Organic',
    starburst_text: 'Fresh\npicks @',
    starburst_price: '₹29',
    image: 'assets/farm_fresh_banner.jpg',
    cta_text: 'Shop now',
    cta_link: '#groceries-heading',
    bg_gradient: '#D8F3DC',
    sort_order: 2,
    active: true
  },
  {
    id: 'banner-3',
    title: 'ROYAL PANTRY DEALS',
    subtitle: '',
    pill: 'Kitchen Staples',
    starburst_text: 'Savings\nup to',
    starburst_price: '40% OFF',
    image: 'assets/pantry_deals_banner.jpg',
    cta_text: 'Shop now',
    cta_link: '#groceries-heading',
    bg_gradient: '#FFE5D9',
    sort_order: 3,
    active: true
  }
];
let BANNERS = [...BANNERS_DEFAULT];
let currentHeroSlideIndex = 0;
let heroAutoPlayIntervalMs = 5000;
let heroCarouselTimer = null;
let isHeroPaused = false;

// --- 2. Product Catalog Data (Defaults — overridden by Admin Panel) ---
const PRODUCTS_DEFAULT = [
  {
    id: "prod-1",
    name: "Organic Hass Avocados",
    category: "fruits",
    unit: "Pack of 3 pcs",
    price: 3.99,
    oldPrice: 5.49,
    rating: 4.9,
    reviews: 142,
    badge: "Organic",
    tags: ["organic", "vegan"],
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
    description: "Creamy, nutrient-dense Hass avocados grown in certified organic soil. Perfect for fresh guacamole, salads, and morning toast.",
    origin: "Green Valley Farm, California",
    nutrition: { cal: "160 kcal", carbs: "8.5g", protein: "2g" }
  },
  {
    id: "prod-2",
    name: "Crisp Honeycrisp Apples",
    category: "fruits",
    unit: "1 kg (~5-6 pcs)",
    price: 3.49,
    oldPrice: 4.80,
    rating: 4.8,
    reviews: 89,
    badge: "Fresh Pick",
    tags: ["organic", "deals"],
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    description: "Extra juicy with the perfect balance of sweet and tangy crunch. Harvested directly from orchard branches within 24 hours.",
    origin: "Hood River Orchards, Oregon",
    nutrition: { cal: "95 kcal", carbs: "25g", protein: "0.5g" }
  },
  {
    id: "prod-3",
    name: "Fresh Farm Whole Milk",
    category: "dairy",
    unit: "1 Gallon (3.8L)",
    price: 4.29,
    oldPrice: null,
    rating: 4.9,
    reviews: 210,
    badge: "100% Grass-Fed",
    tags: ["organic"],
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    description: "Rich, creamy whole milk from pasture-raised, grass-fed cows. Non-homogenized natural goodness loaded with calcium & vitamins.",
    origin: "Meadowbrook Dairy, Wisconsin",
    nutrition: { cal: "150 kcal", carbs: "12g", protein: "8g" }
  },
  {
    id: "prod-4",
    name: "Artisan Sourdough Country Loaf",
    category: "bakery",
    unit: "650g loaf",
    price: 4.99,
    oldPrice: 6.20,
    rating: 4.9,
    reviews: 175,
    badge: "Freshly Baked",
    tags: ["vegan", "deals"],
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    description: "Slow-fermented for 36 hours using a 10-year heirloom starter. Crackly caramelized crust with a soft, airy, chew-worthy crumb.",
    origin: "Golden Hearth Bakery, Local",
    nutrition: { cal: "185 kcal", carbs: "36g", protein: "7g" }
  },
  {
    id: "prod-5",
    name: "Organic Baby Spinach Leaves",
    category: "vegetables",
    unit: "300g clamshell",
    price: 2.79,
    oldPrice: 3.50,
    rating: 4.7,
    reviews: 64,
    badge: "Pre-Washed",
    tags: ["organic", "vegan", "gluten-free"],
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    description: "Tender, triple-washed baby spinach packed with iron, vitamin K, and antioxidants. Ready to toss into your healthy green smoothies.",
    origin: "Salinas Organic Growers, California",
    nutrition: { cal: "23 kcal", carbs: "3.6g", protein: "2.9g" }
  },
  {
    id: "prod-6",
    name: "Sweet Driscoll Strawberries",
    category: "fruits",
    unit: "450g pack",
    price: 4.49,
    oldPrice: 5.99,
    rating: 4.8,
    reviews: 132,
    badge: "Sale 25%",
    tags: ["organic", "deals", "vegan", "gluten-free"],
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    description: "Sun-ripened, intensely sweet red berries hand-picked at peak ripeness. Naturally fragrant, luscious, and full of Vitamin C.",
    origin: "Coastal Berry Groves, California",
    nutrition: { cal: "49 kcal", carbs: "11.7g", protein: "1g" }
  },
  {
    id: "prod-7",
    name: "Pasture-Raised Brown Eggs",
    category: "dairy",
    unit: "12 large eggs",
    price: 4.89,
    oldPrice: null,
    rating: 5.0,
    reviews: 310,
    badge: "Free-Range",
    tags: ["organic", "gluten-free"],
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
    description: "Deep orange yolks with unmatched rich flavor. Laid by hens with 108+ square feet of outdoor pasture roaming space each.",
    origin: "Vital Pastures Co., Iowa",
    nutrition: { cal: "72 kcal", carbs: "0.4g", protein: "6.3g" }
  },
  {
    id: "prod-8",
    name: "Greek Whole Milk Plain Yogurt",
    category: "dairy",
    unit: "500g tub",
    price: 3.89,
    oldPrice: 4.60,
    rating: 4.8,
    reviews: 98,
    badge: "High Protein",
    tags: ["gluten-free", "deals"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    description: "Traditional strained Greek yogurt, velvety thick texture packed with 15g protein per serving and 5 active live probiotic cultures.",
    origin: "Olympus Dairy, New York",
    nutrition: { cal: "130 kcal", carbs: "6g", protein: "15g" }
  },
  {
    id: "prod-9",
    name: "Cold-Pressed Valencia Orange Juice",
    category: "beverages",
    unit: "1 Liter bottle",
    price: 4.79,
    oldPrice: 5.50,
    rating: 4.9,
    reviews: 145,
    badge: "No Added Sugar",
    tags: ["organic", "vegan", "gluten-free"],
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    description: "100% pure squeezed Florida Valencia oranges. Never heated or concentrated, preserving vibrant citrus aroma and natural enzymes.",
    origin: "Citrus Heights Grove, Florida",
    nutrition: { cal: "110 kcal", carbs: "26g", protein: "2g" }
  },
  {
    id: "prod-10",
    name: "Extra Virgin Organic Olive Oil",
    category: "grocery",
    unit: "750ml glass bottle",
    price: 11.99,
    oldPrice: 14.99,
    rating: 4.9,
    reviews: 180,
    badge: "First Cold Press",
    tags: ["organic", "vegan", "gluten-free", "deals"],
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    description: "Single-estate Koroneiki olives cold-pressed within 4 hours of picking. Low acidity (<0.3%) with grassy, peppery notes.",
    origin: "Crete Estate, Greece",
    nutrition: { cal: "120 kcal", carbs: "0g", protein: "0g" }
  },
  {
    id: "prod-11",
    name: "Roasted Sea Salt Pistachios",
    category: "snacks",
    unit: "250g resealable pouch",
    price: 5.99,
    oldPrice: 7.20,
    rating: 4.8,
    reviews: 112,
    badge: "Keto Friendly",
    tags: ["vegan", "gluten-free", "deals"],
    image: "https://images.unsplash.com/photo-1525412852267-331264b3ef8b?auto=format&fit=crop&w=600&q=80",
    description: "Slow dry-roasted California pistachios dusted lightly with mineral Mediterranean sea salt. High fiber, healthy fats, and protein.",
    origin: "San Joaquin Orchards, California",
    nutrition: { cal: "160 kcal", carbs: "8g", protein: "6g" }
  },
  {
    id: "prod-12",
    name: "Heirloom Vine-Ripe Tomatoes",
    category: "vegetables",
    unit: "750g (~4-5 pcs)",
    price: 3.29,
    oldPrice: 4.10,
    rating: 4.7,
    reviews: 74,
    badge: "Sweet & Juicy",
    tags: ["organic", "vegan", "gluten-free"],
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    description: "Vibrant multicolored heirloom varieties with complex old-world tomato sweetness. Ideal for Caprese salad and rustic sauces.",
    origin: "Heritage Ridge Greenhouse, Ohio",
    nutrition: { cal: "22 kcal", carbs: "4.8g", protein: "1.1g" }
  },
  {
    id: "prod-13",
    name: "Raw Unfiltered Wildflower Honey",
    category: "grocery",
    unit: "400g glass jar",
    price: 6.99,
    oldPrice: null,
    rating: 5.0,
    reviews: 240,
    badge: "Raw & Pure",
    tags: ["organic", "gluten-free"],
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    description: "Unpasteurized raw honey harvested from wild mountain blossoms. Naturally retains active bee pollen, propolis, and rich floral depth.",
    origin: "Blue Ridge Apiary, North Carolina",
    nutrition: { cal: "64 kcal", carbs: "17g", protein: "0.1g" }
  },
  {
    id: "prod-14",
    name: "Crisp Bell Peppers Trio",
    category: "vegetables",
    unit: "3 pack (Red, Yellow, Orange)",
    price: 3.69,
    oldPrice: 4.50,
    rating: 4.8,
    reviews: 62,
    badge: "Vitamin C Boost",
    tags: ["organic", "vegan", "deals"],
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
    description: "Thick-walled, vibrant sweet bell peppers with an invigorating crisp crunch. 200% daily Vitamin C requirement in half a pepper.",
    origin: "Greenhouse Valley, Ontario",
    nutrition: { cal: "31 kcal", carbs: "6g", protein: "1g" }
  },
  {
    id: "prod-15",
    name: "Ceremonial Grade Matcha Blend",
    category: "beverages",
    unit: "100g tin",
    price: 9.99,
    oldPrice: 12.50,
    rating: 4.9,
    reviews: 86,
    badge: "Direct From Japan",
    tags: ["organic", "vegan", "deals"],
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Shade-grown first harvest stone-ground green tea leaves from Uji, Kyoto. Smooth umami notes with zero bitterness and calm alertness.",
    origin: "Uji Tea Gardens, Kyoto, Japan",
    nutrition: { cal: "3 kcal", carbs: "0.4g", protein: "0.3g" }
  },
  {
    id: "prod-16",
    name: "Multigrain Seed Artisan Crackers",
    category: "snacks",
    unit: "200g box",
    price: 3.79,
    oldPrice: 4.40,
    rating: 4.6,
    reviews: 51,
    badge: "Non-GMO",
    tags: ["vegan", "organic"],
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    description: "Baked with whole chia, flaxseed, sesame, and quinoa seeds. Hearty crunch that pairs harmoniously with artisan dips and cheeses.",
    origin: "Rustic Grain Co., Vermont",
    nutrition: { cal: "135 kcal", carbs: "18g", protein: "4g" }
  },
  {
    id: "prod-17",
    name: "Fresh Organic Broccoli Florets",
    category: "vegetables",
    unit: "500g bunch",
    price: 2.49,
    oldPrice: 3.20,
    rating: 4.8,
    reviews: 95,
    badge: "Farm Fresh",
    tags: ["organic", "vegan", "deals"],
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80",
    description: "Crisp, emerald-green organic broccoli crowns harvested early morning. Packed with dietary fiber, sulforaphane, and Vitamin C.",
    origin: "Green Valley Organic Farms, California",
    nutrition: { cal: "34 kcal", carbs: "6.6g", protein: "2.8g" }
  },
  {
    id: "prod-18",
    name: "Crisp Rainbow Sweet Carrots",
    category: "vegetables",
    unit: "1 kg bunch with greens",
    price: 2.99,
    oldPrice: 3.75,
    rating: 4.9,
    reviews: 82,
    badge: "Crisp & Sweet",
    tags: ["organic", "vegan", "deals"],
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
    description: "Sweet, earthy heirloom rainbow carrots rich in beta-carotene. Perfect for roasting, dipping in hummus, or juicing.",
    origin: "Sunburst Organic Farms, Oregon",
    nutrition: { cal: "41 kcal", carbs: "9.6g", protein: "0.9g" }
  },
  {
    id: "prod-19",
    name: "Golden Sweet Cavendish Bananas",
    category: "fruits",
    unit: "Bunch (~6-7 pcs, 1.2 kg)",
    price: 1.89,
    oldPrice: 2.40,
    rating: 4.9,
    reviews: 320,
    badge: "Bestseller",
    tags: ["organic", "vegan"],
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    description: "Naturally sweet bananas packed with potassium, Vitamin B6, and quick clean energy for breakfasts and workouts.",
    origin: "Rainforest Fair Trade Alliance, Costa Rica",
    nutrition: { cal: "89 kcal", carbs: "22.8g", protein: "1.1g" }
  },
  {
    id: "prod-20",
    name: "Alphonso Royal Mangoes Pack",
    category: "fruits",
    unit: "Box of 4 premium pcs",
    price: 7.99,
    oldPrice: 9.99,
    rating: 5.0,
    reviews: 214,
    badge: "King of Mangoes",
    tags: ["organic", "deals"],
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    description: "Celebrated for their saffron aroma, fiberless melt-in-mouth pulp, and unrivaled natural sweetness. The true king of fruits.",
    origin: "Ratnagiri Heritage Groves",
    nutrition: { cal: "60 kcal", carbs: "15g", protein: "0.8g" }
  },
  {
    id: "prod-21",
    name: "Royal Aged Himalayan Basmati Rice",
    category: "grocery",
    unit: "5 kg Sealed Bag",
    price: 14.49,
    oldPrice: 17.99,
    rating: 4.9,
    reviews: 189,
    badge: "Aged 2 Years",
    tags: ["organic", "gluten-free", "deals"],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "Naturally aged long-grain basmati with an unmistakable aroma and fluffy, non-sticky grains that cook up to twice their length.",
    origin: "Himalayan Foothills, Punjab",
    nutrition: { cal: "160 kcal", carbs: "36g", protein: "3.5g" }
  },
  {
    id: "prod-22",
    name: "Stone-Ground 100% Whole Wheat Chakki Atta",
    category: "grocery",
    unit: "5 kg Bag",
    price: 9.99,
    oldPrice: 12.00,
    rating: 4.8,
    reviews: 140,
    badge: "High Fiber",
    tags: ["organic", "vegan"],
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    description: "Traditional stone-ground whole wheat flour that retains the germ, bran, and essential nutrients for soft, nutritious rotis and breads.",
    origin: "Madhya Pradesh Organic Farms",
    nutrition: { cal: "340 kcal", carbs: "72g", protein: "12g" }
  },
  {
    id: "prod-23",
    name: "Organic Rolled Oats & Chia Supermix",
    category: "grocery",
    unit: "1 kg Resealable Pouch",
    price: 5.49,
    oldPrice: 6.80,
    rating: 4.9,
    reviews: 115,
    badge: "Heart Healthy",
    tags: ["organic", "vegan", "gluten-free", "deals"],
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
    description: "100% whole grain rolled jumbo oats blended with organic black chia seeds. High in soluble beta-glucan fiber and plant protein.",
    origin: "Midwest Organic Mills, USA",
    nutrition: { cal: "375 kcal", carbs: "65g", protein: "14g" }
  }
];

// ─── Supabase ↔ JS mappers ────────────────────────────────────────────────
function dbToProduct(row) {
  return {
    id: row.id, name: row.name, category: row.category, unit: row.unit || '',
    price: parseFloat(row.price),
    oldPrice: row.old_price ? parseFloat(row.old_price) : null,
    rating: parseFloat(row.rating) || 4.5, reviews: row.reviews || 0,
    badge: row.badge || '', tags: row.tags || [], image: row.image || '',
    description: row.description || '', origin: row.origin || '',
    inStock: row.in_stock !== false,
    nutrition: row.nutrition || { cal: '0 kcal', carbs: '0g', protein: '0g' }
  };
}

function dbToCoupons(rows) {
  // Start with hardcoded base, then apply admin overrides
  const base = { FRESH20: 0.20, SAVE10: 0.10, ORGANIC: 0.15 };
  (rows || []).forEach(c => {
    if (c.active && c.code) base[c.code.toUpperCase()] = c.discount / 100;
    else if (!c.active) delete base[c.code?.toUpperCase()];
  });
  return base;
}

function dbToSettings(row) {
  if (!row) return { freeShipping: 35, deliveryFee: 3.99, taxRate: 5 };
  return {
    freeShipping: parseFloat(row.free_shipping) || 35,
    deliveryFee:  parseFloat(row.delivery_fee)  || 3.99,
    taxRate:      parseFloat(row.tax_rate)       || 5
  };
}

// Live arrays — start with defaults, overwritten after Supabase fetch
let PRODUCTS = [...PRODUCTS_DEFAULT];

// --- 2. Application State ---
const State = {
  cart: {}, // { [productId]: quantity }
  wishlist: new Set(),
  activeCategory: "all",
  activeTag: "all",
  searchQuery: "",
  sortBy: "featured",
  promoCode: null,
  promoDiscountPct: 0,
  theme: "light",
  currentQuickViewId: null
};

let ADMIN_SETTINGS = { freeShipping: 35, deliveryFee: 3.99, taxRate: 5 };

let COUPONS = { FRESH20: 0.20, SAVE10: 0.10, ORGANIC: 0.15 };

// --- 3. Storage Persistence Helpers ---
function loadPersistedState() {
  try {
    const savedCart = localStorage.getItem("fh_cart");
    if (savedCart) State.cart = JSON.parse(savedCart);

    const savedWishlist = localStorage.getItem("fh_wishlist");
    if (savedWishlist) State.wishlist = new Set(JSON.parse(savedWishlist));

    const savedTheme = localStorage.getItem("fh_theme") || "light";
    setTheme(savedTheme);
  } catch (e) {
    console.warn("Could not load local storage", e);
  }
}

function saveCart() {
  try {
    localStorage.setItem("fh_cart", JSON.stringify(State.cart));
  } catch (e) {}
}

function saveWishlist() {
  try {
    localStorage.setItem("fh_wishlist", JSON.stringify([...State.wishlist]));
  } catch (e) {}
}

// --- 4. Theme Toggle ---
function setTheme(theme) {
  State.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("fh_theme", theme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
    themeBtn.setAttribute("title", theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
  }
}

function toggleTheme() {
  setTheme(State.theme === "dark" ? "light" : "dark");
}

// --- 5. Cart Logic ---
function addToCart(productId, count = 1) {
  State.cart[productId] = (State.cart[productId] || 0) + count;
  saveCart();
  renderApp();
  
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    showToast(`Added ${product.name} to cart!`, "🛒");
  }
}

function updateCartQuantity(productId, delta) {
  if (!State.cart[productId]) return;
  State.cart[productId] += delta;
  if (State.cart[productId] <= 0) {
    delete State.cart[productId];
  }
  saveCart();
  renderApp();
}

function removeFromCart(productId) {
  delete State.cart[productId];
  saveCart();
  renderApp();
}

function clearCart() {
  State.cart = {};
  saveCart();
  renderApp();
}

function toggleWishlist(productId) {
  if (State.wishlist.has(productId)) {
    State.wishlist.delete(productId);
    showToast("Removed from wishlist", "🤍");
  } else {
    State.wishlist.add(productId);
    showToast("Saved to your wishlist!", "❤️");
  }
  saveWishlist();
  renderApp();
}

// --- 6. Calculations & INR Currency Formatter ---
function formatInr(val) {
  if (val === null || val === undefined) return 0;
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  // If value is small (< 30), scale to natural Indian Quick-commerce rupee range
  if (num < 30) return Math.round(num * 25);
  return Math.round(num);
}

function getCartTotals() {
  let subtotal = 0;
  let totalItemsCount = 0;

  for (const [productId, qty] of Object.entries(State.cart)) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      subtotal += formatInr(product.price) * qty;
      totalItemsCount += qty;
    }
  }

  const freeShippingThreshold = formatInr(ADMIN_SETTINGS.freeShipping || 35.00);
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : (formatInr(ADMIN_SETTINGS.deliveryFee || 3.99));
  const discountAmount = Math.round(subtotal * State.promoDiscountPct);
  const estimatedTax = Math.round((subtotal - discountAmount) * ((ADMIN_SETTINGS.taxRate || 5) / 100));
  const total = Math.max(0, subtotal - discountAmount + shippingFee + (subtotal > 0 ? estimatedTax : 0));

  return {
    subtotal,
    totalItemsCount,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    discountAmount,
    estimatedTax,
    total
  };
}

// --- 7. Rendering Functions ---

// Render Product Card (Blinkit Style with 12 MINS delivery pill, ₹ pricing, and crisp + ADD button)
function renderProductCard(product) {
  const inCartQty = State.cart[product.id] || 0;
  const isFav = State.wishlist.has(product.id);

  let badgeHtml = "";
  if (product.badge) {
    let badgeClass = "badge-organic";
    if (product.badge.includes("%") || product.badge.toLowerCase().includes("sale")) badgeClass = "badge-discount";
    else if (product.badge.toLowerCase().includes("fresh")) badgeClass = "badge-fresh";
    badgeHtml = `<span class="product-badge ${badgeClass}">${product.badge}</span>`;
  }

  const inrPrice = formatInr(product.price);
  const inrOldPrice = product.oldPrice ? formatInr(product.oldPrice) : null;
  const savings = inrOldPrice && inrOldPrice > inrPrice ? Math.round(inrOldPrice - inrPrice) : null;

  const cartButtonMarkup = inCartQty > 0 
    ? `
      <div class="quantity-stepper" onclick="event.stopPropagation();">
        <button class="stepper-btn" onclick="updateCartQuantity('${product.id}', -1)" title="Decrease quantity">−</button>
        <span class="stepper-count">${inCartQty}</span>
        <button class="stepper-btn" onclick="updateCartQuantity('${product.id}', 1)" title="Increase quantity">+</button>
      </div>
    `
    : `
      <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${product.id}', 1)">
        <span>+</span> ADD
      </button>
    `;

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="card-media" onclick="openQuickView('${product.id}')">
        <div class="badge-stack">
          ${badgeHtml}
        </div>
        <button class="btn-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Save to favorites">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'%3E%3Crect fill=\'%23ecfdf5\' width=\'300\' height=\'300\'/%3E%3Ctext fill=\'%23059669\' font-family=\'sans-serif\' font-size=\'40\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3E🍎 Fresh%3C/text%3E%3C/svg%3E';"
        />
        <div class="quick-view-overlay">
          <span class="btn-quick-view">Quick View</span>
        </div>
      </div>

      <div class="card-body">
        <div class="blinkit-delivery-tag">⚡ 12 MINS</div>
        ${savings ? `<div class="blinkit-off-tag">₹${savings} OFF</div>` : ''}

        <div class="card-category-unit">
          <span class="card-category">${product.category}</span>
          <span class="card-unit">${product.unit}</span>
        </div>
        <h3 class="card-title" onclick="openQuickView('${product.id}')">${product.name}</h3>

        <div class="card-rating-strip">
          <span class="stars-gold">★</span>
          <span class="rating-score">${product.rating}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>

        <div class="card-footer">
          <div class="price-box">
            <span class="current-price">₹${inrPrice}</span>
            ${inrOldPrice ? `<span class="regular-price">₹${inrOldPrice}</span>` : ""}
          </div>
          ${cartButtonMarkup}
        </div>
      </div>
    </article>
  `;
}

// Render Products Grid with Current Filter State
function renderProducts() {
  const gridContainer = document.getElementById("productsGrid");
  const itemsCountLabel = document.getElementById("itemsCount");
  if (!gridContainer) return;

  // Filter
  let filtered = PRODUCTS.filter(p => {
    // Category match
    const categoryMatch = State.activeCategory === "all" || 
      p.category === State.activeCategory ||
      (State.activeCategory === "grocery" && p.category === "pantry") ||
      (State.activeCategory === "vegetables" && (p.category === "vegitable" || p.category === "veggies"));
    
    // Tag match
    const tagMatch = State.activeTag === "all" || (p.tags && p.tags.includes(State.activeTag));

    // Search query match
    const query = State.searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    return categoryMatch && tagMatch && searchMatch;
  });

  // Sort
  if (State.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (State.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (State.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (State.sortBy === "popular") {
    filtered.sort((a, b) => b.reviews - a.reviews);
  }

  // Update item count indicator
  if (itemsCountLabel) {
    itemsCountLabel.innerHTML = `Showing <strong>${filtered.length}</strong> items`;
  }

  // Render cards or empty message
  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-results">
        <div class="empty-icon">🔍</div>
        <h3>No matching groceries found</h3>
        <p>Try clearing your search or browsing another category.</p>
        <button class="btn-hero-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
  } else {
    gridContainer.innerHTML = filtered.map(renderProductCard).join("");
  }
}

// Render Cart Drawer
function renderCartDrawer() {
  const itemsContainer = document.getElementById("cartItemsList");
  const drawerSubtotal = document.getElementById("cartSubtotal");
  const drawerTotal = document.getElementById("cartTotal");
  const drawerShipping = document.getElementById("cartShipping");
  const drawerDiscount = document.getElementById("cartDiscount");
  const discountRow = document.getElementById("discountRow");
  const headerCartCount = document.getElementById("headerCartCount");
  const headerCartTotal = document.getElementById("headerCartTotal");
  const drawerHeaderCount = document.getElementById("drawerHeaderCount");
  const shippingMeterText = document.getElementById("shippingMeterText");
  const shippingMeterFill = document.getElementById("shippingMeterFill");
  const checkoutBtn = document.getElementById("proceedToCheckoutBtn");

  const totals = getCartTotals();

  // Header Cart Button badge
  if (headerCartCount) headerCartCount.textContent = totals.totalItemsCount;
  if (headerCartTotal) headerCartTotal.textContent = `₹${totals.total}`;
  if (drawerHeaderCount) drawerHeaderCount.textContent = `${totals.totalItemsCount} items`;

  // Free shipping meter
  if (shippingMeterText && shippingMeterFill) {
    if (totals.subtotal === 0) {
      shippingMeterText.innerHTML = `Add items to qualify for <strong>FREE Delivery</strong>`;
      shippingMeterFill.style.width = "0%";
    } else if (totals.isFreeShipping) {
      shippingMeterText.innerHTML = `🎉 You unlocked <strong>FREE Express Delivery</strong>!`;
      shippingMeterFill.style.width = "100%";
    } else {
      const remaining = Math.max(0, totals.freeShippingThreshold - totals.subtotal);
      const pct = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
      shippingMeterText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Express Delivery</strong>`;
      shippingMeterFill.style.width = `${pct}%`;
    }
  }

  // Cart item rows
  if (itemsContainer) {
    const cartEntries = Object.entries(State.cart);
    if (cartEntries.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <h4>Your basket is empty</h4>
          <p>Fresh organic produce and farm treats are waiting for you!</p>
          <button class="btn-hero-primary" onclick="closeCartDrawer()">Start Shopping</button>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      if (checkoutBtn) checkoutBtn.disabled = false;
      itemsContainer.innerHTML = cartEntries.map(([id, qty]) => {
        const prod = PRODUCTS.find(p => p.id === id);
        if (!prod) return "";
        const itemPrice = formatInr(prod.price) * qty;
        return `
          <div class="cart-item">
            <img src="${prod.image}" alt="${prod.name}" class="cart-item-img" />
            <div class="cart-item-details">
              <h4 class="cart-item-title">${prod.name}</h4>
              <p class="cart-item-unit">${prod.unit}</p>
              <span class="cart-item-price-unit">₹${itemPrice}</span>
            </div>
            <div class="cart-item-controls">
              <button class="btn-remove-item" onclick="removeFromCart('${prod.id}')" title="Remove item">✕</button>
              <div class="cart-stepper">
                <button onclick="updateCartQuantity('${prod.id}', -1)">−</button>
                <span>${qty}</span>
                <button onclick="updateCartQuantity('${prod.id}', 1)">+</button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // Summary figures
  if (drawerSubtotal) drawerSubtotal.textContent = `₹${totals.subtotal}`;
  if (drawerShipping) drawerShipping.textContent = totals.isFreeShipping ? "FREE" : `₹${totals.shippingFee}`;
  
  if (discountRow && drawerDiscount) {
    if (totals.discountAmount > 0) {
      discountRow.style.display = "flex";
      drawerDiscount.textContent = `-₹${totals.discountAmount}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  if (drawerTotal) drawerTotal.textContent = `₹${totals.total}`;

  // Update floating cart capsule bar
  renderFloatingCartBar();
}

// Render Wishlist badge count
function renderWishlistBadge() {
  const badge = document.getElementById("headerFavCount");
  if (badge) {
    badge.textContent = State.wishlist.size;
  }
}

// Render dynamic Blinkit category strip with active indicator
function renderCategoriesNav() {
  const nav = document.getElementById("categoriesNav");
  if (!nav) return;

  const activeCats = CATEGORIES
    .filter(c => c.active !== false)
    .sort((a, b) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));

  let html = `
    <button class="blinkit-cat-item ${State.activeCategory === 'all' ? 'active' : ''}" data-category="all" onclick="setCategory('all')" title="All Products">
      <div class="cat-item-icon-box">🧃</div>
      <span class="cat-item-name">All</span>
    </button>
  `;

  // Standard icons map for quick-commerce categories
  const iconFallback = {
    'vegetables': '🥦',
    'grocery': '🛒',
    'fruits': '🍎',
    'dairy': '🥛',
    'bakery': '🥖',
    'beverages': '🥤',
    'snacks': '🍿',
    'navratri': '🥢',
    'electronics': '🎧',
    'beauty': '💄',
    'gifting': '🎁',
    'decor': '🪔'
  };

  activeCats.forEach(cat => {
    const isAct = State.activeCategory === cat.id;
    const catIcon = cat.icon || iconFallback[cat.id.toLowerCase()] || '📦';
    html += `
      <button class="blinkit-cat-item ${isAct ? 'active' : ''}" data-category="${cat.id}" onclick="setCategory('${cat.id}')" title="${cat.name}">
        <div class="cat-item-icon-box">${catIcon}</div>
        <span class="cat-item-name">${cat.name}</span>
      </button>
    `;
  });

  nav.innerHTML = html;
}

// Render dynamic footer category links
function renderFooterCategories() {
  const list = document.getElementById("footerCategoriesList");
  if (!list) return;

  const activeCats = CATEGORIES
    .filter(c => c.active !== false)
    .sort((a, b) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));

  list.innerHTML = activeCats.map(cat => `
    <li><a href="javascript:void(0)" onclick="setCategory('${cat.id}')">${cat.icon || ''} ${cat.name}</a></li>
  `).join('');
}

// --- 7b. Hero Carousel Rendering & Rotation Controls ---
function renderHeroCarousel() {
  const track = document.getElementById("heroSlidesTrack");
  const dotsContainer = document.getElementById("heroCarouselDots");
  if (!track) return;

  const activeBanners = BANNERS
    .filter(b => b.active !== false)
    .sort((a, b) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));

  if (activeBanners.length === 0) {
    track.innerHTML = `
      <div class="hero-slide active" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%);">
        <div class="hero-content">
          <div class="hero-pill"><span>🌿</span> Restock Club</div>
          <h1 class="hero-title">Crisp, Organic Groceries <span>Delivered in 20 Mins</span></h1>
          <p class="hero-subtitle">Directly from certified local organic family farms.</p>
        </div>
      </div>
    `;
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  if (currentHeroSlideIndex >= activeBanners.length) {
    currentHeroSlideIndex = 0;
  }

  track.innerHTML = activeBanners.map((banner, idx) => {
    const isActive = idx === currentHeroSlideIndex;
    const bg = banner.bg_gradient || '#FFDD33';

    if (banner.image) {
      return `
        <div class="hero-slide ${isActive ? 'active' : ''}" style="background: ${bg};" data-slide-index="${idx}">
          <a href="${banner.cta_link || '#groceries-heading'}" class="hero-slide-link" aria-label="${banner.title || 'Special Offer'}">
            <img src="${banner.image}" alt="${banner.title || 'Promotional Banner'}" class="hero-banner-img" loading="${idx === 0 ? 'eager' : 'lazy'}" onerror="this.src='assets/daily_spread_promo.jpg'" />
          </a>
        </div>
      `;
    }

    return `
      <div class="hero-slide ${isActive ? 'active' : ''}" style="background: ${bg};" data-slide-index="${idx}">
        <div class="hero-content">
          ${banner.pill ? `<div class="hero-pill">${banner.pill}</div>` : ''}
          <h1 class="hero-title">${banner.title || ''} ${banner.highlight ? `<span>${banner.highlight}</span>` : ''}</h1>
          ${banner.subtitle ? `<p class="hero-subtitle">${banner.subtitle}</p>` : ''}
          <div class="hero-cta-group">
            <a href="${banner.cta_link || '#groceries-heading'}" class="btn-hero-primary">${banner.cta_text || 'Shop Now'}</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (dotsContainer) {
    if (activeBanners.length <= 1) {
      dotsContainer.style.display = 'none';
    } else {
      dotsContainer.style.display = 'flex';
      dotsContainer.innerHTML = activeBanners.map((_, idx) => `
        <button class="carousel-dot ${idx === currentHeroSlideIndex ? 'active' : ''}" 
                onclick="goToHeroSlide(${idx})" 
                aria-label="Go to slide ${idx + 1}"></button>
      `).join('');
    }
  }

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (prevBtn && nextBtn) {
    prevBtn.style.display = activeBanners.length <= 1 ? 'none' : 'flex';
    nextBtn.style.display = activeBanners.length <= 1 ? 'none' : 'flex';
  }

  // Bind touch swipe on carousel for mobile
  const carouselWrap = document.getElementById('heroCarouselWrap');
  if (carouselWrap && !carouselWrap.dataset.touchBound) {
    carouselWrap.dataset.touchBound = 'true';
    let touchStartX = 0;
    let touchEndX = 0;
    carouselWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextHeroSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevHeroSlide();
      }
    }, { passive: true });
  }

  startHeroCarouselTimer();
}

function goToHeroSlide(index) {
  const activeBanners = BANNERS.filter(b => b.active !== false);
  if (activeBanners.length === 0) return;
  currentHeroSlideIndex = (index + activeBanners.length) % activeBanners.length;

  const slides = document.querySelectorAll('.hero-slides-track .hero-slide');
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentHeroSlideIndex);
  });

  const dots = document.querySelectorAll('.carousel-dots-wrap .carousel-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentHeroSlideIndex);
  });

  startHeroCarouselTimer();
}

function nextHeroSlide() {
  const activeBanners = BANNERS.filter(b => b.active !== false);
  if (activeBanners.length <= 1) return;
  goToHeroSlide(currentHeroSlideIndex + 1);
}

function prevHeroSlide() {
  const activeBanners = BANNERS.filter(b => b.active !== false);
  if (activeBanners.length <= 1) return;
  goToHeroSlide(currentHeroSlideIndex - 1);
}

function startHeroCarouselTimer() {
  if (heroCarouselTimer) {
    clearInterval(heroCarouselTimer);
    heroCarouselTimer = null;
  }
  const activeBanners = BANNERS.filter(b => b.active !== false);
  if (activeBanners.length <= 1) return;

  heroCarouselTimer = setInterval(() => {
    if (!isHeroPaused) {
      const currentActive = BANNERS.filter(b => b.active !== false);
      if (currentActive.length > 1) {
        currentHeroSlideIndex = (currentHeroSlideIndex + 1) % currentActive.length;
        const slides = document.querySelectorAll('.hero-slides-track .hero-slide');
        slides.forEach((slide, idx) => {
          slide.classList.toggle('active', idx === currentHeroSlideIndex);
        });
        const dots = document.querySelectorAll('.carousel-dots-wrap .carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentHeroSlideIndex);
        });
      }
    }
  }, heroAutoPlayIntervalMs);
}

// Floating Blinkit "View Cart" Capsule Bar
function renderFloatingCartBar() {
  const bar = document.getElementById("floatingCartBar");
  const thumb = document.getElementById("cartBarThumb");
  const sub = document.getElementById("cartBarSub");
  if (!bar) return;

  const totals = getCartTotals();
  if (totals.totalItemsCount === 0) {
    bar.style.display = "none";
    return;
  }

  // Set preview thumbnail to first product in cart
  const firstCartId = Object.keys(State.cart)[0];
  const firstProd = PRODUCTS.find(p => p.id === firstCartId);
  if (thumb && firstProd) {
    thumb.src = firstProd.image;
    thumb.alt = firstProd.name;
  }

  if (sub) {
    sub.textContent = `${totals.totalItemsCount} ${totals.totalItemsCount === 1 ? 'Item' : 'Items'} • ₹${totals.total}`;
  }

  bar.style.display = "flex";
}

// Overall app state refresh
function renderApp() {
  renderHeroCarousel();
  renderCategoriesNav();
  renderFooterCategories();
  renderProducts();
  renderCartDrawer();
  renderFloatingCartBar();
  renderWishlistBadge();
}

// --- 8. Coupon Code Logic ---
function applyCoupon() {
  const input = document.getElementById("couponInput");
  const feedback = document.getElementById("couponFeedback");
  if (!input || !feedback) return;

  const code = input.value.trim().toUpperCase();
  if (COUPONS[code]) {
    State.promoCode = code;
    State.promoDiscountPct = COUPONS[code];
    feedback.textContent = `Promo code '${code}' applied! (${COUPONS[code] * 100}% off)`;
    feedback.className = "coupon-feedback success";
    showToast(`Promo applied: ${COUPONS[code] * 100}% off!`, "🏷️");
    renderCartDrawer();
  } else {
    feedback.textContent = "Invalid promo code. Try 'FRESH20' for 20% off.";
    feedback.className = "coupon-feedback error";
  }
}

// --- 9. Modal Interactions ---

// Cart Drawer open/close
function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Quick View Modal
function openQuickView(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  State.currentQuickViewId = productId;
  const modal = document.getElementById("quickViewModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (!modal || !backdrop) return;

  const inCartQty = State.cart[prod.id] || 0;

  modal.innerHTML = `
    <button class="modal-close-btn" onclick="closeAllModals()" title="Close">✕</button>
    <div class="quick-view-grid">
      <div class="modal-img-wrap">
        <img src="${prod.image}" alt="${prod.name}" />
      </div>
      <div class="modal-info-wrap">
        <span class="qv-category">${prod.category} • ${prod.unit}</span>
        <h2 class="qv-title">${prod.name}</h2>
        <div class="qv-price-row">
          <span class="qv-price">₹${formatInr(prod.price)}</span>
          ${prod.oldPrice ? `<span class="qv-old-price">₹${formatInr(prod.oldPrice)}</span>` : ""}
          <span class="product-badge badge-organic">${prod.badge || "Farm Fresh"}</span>
        </div>
        <p class="qv-desc">${prod.description}</p>

        <div class="nutrition-grid">
          <div class="nutri-item">
            <div class="val">${prod.nutrition.cal}</div>
            <div class="lbl">Calories</div>
          </div>
          <div class="nutri-item">
            <div class="val">${prod.nutrition.carbs}</div>
            <div class="lbl">Carbs</div>
          </div>
          <div class="nutri-item">
            <div class="val">${prod.nutrition.protein}</div>
            <div class="lbl">Protein</div>
          </div>
        </div>

        <div class="qv-origin">
          <span>🌱</span>
          <span>Sourced from <strong>${prod.origin}</strong></span>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: auto;">
          <button class="btn-checkout" style="flex: 1;" onclick="addToCart('${prod.id}', 1); closeAllModals(); openCartDrawer();">
            🛒 Add to Cart (₹${formatInr(prod.price)})
          </button>
          <button class="btn-icon" style="width: 48px; height: 48px;" onclick="toggleWishlist('${prod.id}')">
            ${State.wishlist.has(prod.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "block";
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

// Checkout Modal
function openCheckoutModal() {
  closeCartDrawer();
  const modal = document.getElementById("checkoutModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (!modal || !backdrop) return;

  const totals = getCartTotals();

  modal.innerHTML = `
    <button class="modal-close-btn" onclick="closeAllModals()" title="Close">✕</button>
    <div class="checkout-modal-wrap">
      <h2 class="checkout-title">Express Grocery Checkout</h2>
      <p class="checkout-sub">Guaranteed delivery in 12–17 minutes to your doorstep.</p>

      <form id="checkoutForm" onsubmit="handlePlaceOrder(event)">
        <div class="form-row-2">
          <div class="form-group">
            <label>First & Last Name</label>
            <input type="text" class="form-control" id="co-name" required placeholder="Joyal Tony" value="Joyal Tony" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" class="form-control" id="co-phone" required placeholder="+91 98765 43210" value="+91 98765 43210" />
          </div>
        </div>

        <div class="form-group">
          <label>Delivery Address</label>
          <input type="text" class="form-control" required placeholder="4th floor, cyber view hostel, HITEC City" value="4th floor, cyber view hostel, HITEC City" />
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>Delivery Instructions (Optional)</label>
            <input type="text" class="form-control" placeholder="Leave at door / ring bell" value="Leave at security desk" />
          </div>
          <div class="form-group">
            <label>Delivery Speed</label>
            <select class="form-control">
              <option>⚡ Priority Express (12–17 min)</option>
              <option>Standard Delivery (Today, 6-8 PM)</option>
            </select>
          </div>
        </div>

        <label style="display:block; font-size: 0.8rem; font-weight:700; margin-bottom: 0.4rem;">Select Payment Method</label>
        <div class="payment-methods-grid">
          <div class="payment-method-card active" onclick="selectPaymentMethod(this)">
            <div class="pm-icon">💳</div>
            <div class="pm-label">UPI / Cards</div>
          </div>
          <div class="payment-method-card" onclick="selectPaymentMethod(this)">
            <div class="pm-icon">📱</div>
            <div class="pm-label">GPay / PhonePe</div>
          </div>
          <div class="payment-method-card" onclick="selectPaymentMethod(this)">
            <div class="pm-icon">💵</div>
            <div class="pm-label">Cash on Delivery</div>
          </div>
        </div>

        <div style="background: var(--bg-surface-alt); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
          <div class="summary-row" style="margin-bottom: 0.25rem;">
            <span>Items (${totals.totalItemsCount})</span>
            <span>₹${totals.subtotal}</span>
          </div>
          <div class="summary-row" style="margin-bottom: 0.25rem;">
            <span>Delivery</span>
            <span>${totals.isFreeShipping ? 'FREE' : `₹${totals.shippingFee}`}</span>
          </div>
          ${totals.discountAmount > 0 ? `
            <div class="summary-row" style="color: var(--primary-600); margin-bottom: 0.25rem;">
              <span>Promo Discount</span>
              <span>-₹${totals.discountAmount}</span>
            </div>
          ` : ''}
          <div class="summary-row" style="font-weight: 800; font-size: 1.1rem; color: var(--text-main); margin-top: 0.5rem; border-top: 1px dashed var(--border-light); padding-top: 0.5rem;">
            <span>Total to Pay:</span>
            <span>₹${totals.total}</span>
          </div>
        </div>

        <button type="submit" class="btn-checkout" id="orderSubmitBtn">
          Confirm & Place Order (₹${totals.total})
        </button>
      </form>
    </div>
  `;

  modal.style.display = "block";
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectPaymentMethod(cardElement) {
  document.querySelectorAll(".payment-method-card").forEach(el => el.classList.remove("active"));
  cardElement.classList.add("active");
}

// Order Placement Handler
async function handlePlaceOrder(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("orderSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Processing order...";
  }

  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const totals = getCartTotals();
  const nameInput = document.getElementById("co-name") || (event.target ? event.target.querySelector('input[type="text"]') : null);
  const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Joyal Tony";
  const pmCard = document.querySelector('.payment-method-card.active .pm-label');
  const paymentMethod = pmCard ? pmCard.textContent.trim() : "Credit / Debit";

  const orderPayload = {
    id: orderNumber,
    customer: customerName,
    items: totals.totalItemsCount || 1,
    total: parseFloat(totals.total.toFixed(2)),
    payment: paymentMethod,
    status: 'Pending'
  };

  try {
    const client = (typeof db !== 'undefined' ? db : null) || window.db;
    if (client) {
      const { data, error } = await client.from('orders').insert(orderPayload);
      if (error) {
        console.error("Supabase order insert error:", error);
      } else {
        console.log("Order saved to Supabase:", orderNumber, data);
      }
    } else {
      console.warn("No Supabase client found; order could not be saved to DB.");
    }
  } catch (err) {
    console.error("Order Supabase save failed:", err);
  }

  // Instant cross-tab broadcast to open Admin panel tabs
  try {
    const bc = new BroadcastChannel('restock_orders');
    bc.postMessage({ type: 'NEW_ORDER', order: orderPayload });
    bc.close();
  } catch (e) {}

  try {
    localStorage.setItem('restock_latest_order', JSON.stringify({ ...orderPayload, timestamp: Date.now() }));
  } catch (e) {}

  clearCart();
  openSuccessModal(orderNumber, totals.total);
}

// Order Success Modal
function openSuccessModal(orderNumber, orderTotal) {
  const modal = document.getElementById("successModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (!modal || !backdrop) return;

  // Hide other modals
  const qv = document.getElementById("quickViewModal");
  const co = document.getElementById("checkoutModal");
  if (qv) qv.style.display = "none";
  if (co) co.style.display = "none";

  modal.innerHTML = `
    <div class="success-modal-wrap">
      <div class="success-check-bubble">✓</div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.35rem;">Order Successfully Placed!</h2>
      <div class="success-order-id">Order ID: #${orderNumber}</div>
      <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 400px; margin-bottom: 1.5rem;">
        Thank you! Our personal shoppers are already selecting the freshest items. Your groceries will arrive in <strong>20-25 minutes</strong>.
      </p>

      <!-- Live Delivery Timeline -->
      <div class="delivery-timeline">
        <div class="timeline-line">
          <div class="timeline-line-progress"></div>
        </div>
        <div class="timeline-step done">
          <div class="step-node">✓</div>
          <span class="step-title">Confirmed</span>
        </div>
        <div class="timeline-step done">
          <div class="step-node">✓</div>
          <span class="step-title">Packing</span>
        </div>
        <div class="timeline-step active">
          <div class="step-node">🛵</div>
          <span class="step-title">On the Way</span>
        </div>
        <div class="timeline-step">
          <div class="step-node">🏠</div>
          <span class="step-title">Delivered</span>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; width: 100%; max-width: 320px;">
        <button class="btn-checkout" style="flex:1;" onclick="closeAllModals()">
          Continue Shopping
        </button>
      </div>
    </div>
  `;

  modal.style.display = "block";
  backdrop.classList.add("open");
}

function closeAllModals() {
  const backdrop = document.getElementById("modalBackdrop");
  const qv = document.getElementById("quickViewModal");
  const co = document.getElementById("checkoutModal");
  const sc = document.getElementById("successModal");

  if (backdrop) backdrop.classList.remove("open");
  if (qv) qv.style.display = "none";
  if (co) co.style.display = "none";
  if (sc) sc.style.display = "none";
  document.body.style.overflow = "";
}

// --- 10. Filters & Navigation Handlers ---
function setCategory(category) {
  State.activeCategory = category;
  document.querySelectorAll(".category-tab, .blinkit-cat-item").forEach(tab => {
    if (tab.dataset.category === category) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
  renderProducts();
}

function setTag(tag) {
  State.activeTag = tag;
  document.querySelectorAll(".tag-filter-btn").forEach(btn => {
    if (btn.dataset.tag === tag) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  renderProducts();
}

function resetFilters() {
  State.activeCategory = "all";
  State.activeTag = "all";
  State.searchQuery = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  
  document.querySelectorAll(".category-tab, .blinkit-cat-item").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === "all");
  });
  document.querySelectorAll(".tag-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tag === "all");
  });
  renderProducts();
}

// --- 11. Toast Notifications ---
function showToast(message, icon = "🛒") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

// --- 11b. Blinkit Mobile Interactive Features ---

// Rotating Search Placeholder (Matching "wedding props", "dandiya", etc.)
const SEARCH_PROMPTS = [
  'Search "wedding props"',
  'Search "fresh vegetables"',
  'Search "pooja thali & flowers"',
  'Search "dandiya sticks"',
  'Search "organic milk & ghee"',
  'Search "alphonso mangoes"',
  'Search "daily farm bread"'
];
let searchPromptIndex = 0;
let searchPromptTimer = null;

function startSearchPlaceholderRotation() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  if (searchPromptTimer) clearInterval(searchPromptTimer);
  searchPromptTimer = setInterval(() => {
    if (document.activeElement !== input && !input.value) {
      searchPromptIndex = (searchPromptIndex + 1) % SEARCH_PROMPTS.length;
      input.setAttribute("placeholder", SEARCH_PROMPTS[searchPromptIndex]);
    }
  }, 3500);
}

// Voice Search Support
function triggerVoiceSearch() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec) {
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.onstart = () => showToast("Listening... Speak now", "🎙️");
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.value = transcript;
          State.searchQuery = transcript;
          renderProducts();
          showToast(`Searching for "${transcript}"`, "🔍");
        }
      };
      recognition.onerror = () => showToast("Type to search", "🎙️");
      recognition.start();
      return;
    } catch (e) {}
  }
  showToast("Voice search: Speak or type in search box", "🎙️");
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.focus();
}

// Address Selection Modal
function openAddressModal() {
  const modal = document.getElementById("addressModal");
  if (modal) modal.style.display = "flex";
}

function closeAddressModal() {
  const modal = document.getElementById("addressModal");
  if (modal) modal.style.display = "none";
}

function selectAddress(tag, subText) {
  const tagEl = document.getElementById("currentAddressTag");
  const subEl = document.getElementById("currentAddressSub");
  if (tagEl) tagEl.textContent = tag;
  if (subEl) subEl.textContent = `- ${subText}`;

  document.querySelectorAll(".address-option").forEach(opt => {
    opt.classList.remove("active");
    const radio = opt.querySelector(".addr-radio");
    if (radio) radio.textContent = "○";
  });

  if (window.event && window.event.currentTarget) {
    const activeOpt = window.event.currentTarget;
    activeOpt.classList.add("active");
    const radio = activeOpt.querySelector(".addr-radio");
    if (radio) radio.textContent = "●";
  }

  closeAddressModal();
  showToast(`Delivery location set to: ${tag}`, "📍");
}

// Order Again Modal
function openOrderAgainModal() {
  const modal = document.getElementById("orderAgainModal");
  const list = document.getElementById("orderAgainList");
  if (!modal) return;

  if (list) {
    // Pick 5 top products to display
    const items = PRODUCTS.slice(0, 5);
    list.innerHTML = items.map(prod => `
      <div class="order-again-item">
        <img src="${prod.image}" alt="${prod.name}" class="order-again-img" />
        <div class="order-again-info">
          <div class="order-again-name">${prod.name}</div>
          <div class="order-again-price">₹${formatInr(prod.price)} • ${prod.unit}</div>
        </div>
        <button class="btn-add-cart" onclick="addToCart('${prod.id}', 1); closeOrderAgainModal();">
          + ADD
        </button>
      </div>
    `).join('');
  }

  modal.style.display = "flex";
}

function closeOrderAgainModal() {
  const modal = document.getElementById("orderAgainModal");
  if (modal) modal.style.display = "none";
}

// Bottom App Navigation Dock Handlers
function switchNavTab(tab) {
  document.querySelectorAll(".bottom-app-nav .nav-tab").forEach(t => t.classList.remove("active"));
  const tabHome = document.getElementById("navTabHome");
  if (tab === 'home') {
    if (tabHome) tabHome.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function scrollToCategories() {
  const el = document.getElementById("categoriesNav") || document.getElementById("groceries-heading");
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// --- 12. Initialization & Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load cart / wishlist / theme from localStorage (user-specific, stays local)
  loadPersistedState();
  startSearchPlaceholderRotation();

  // 2. Show skeleton loading state in products grid
  const gridEl = document.getElementById('productsGrid');
  if (gridEl) {
    gridEl.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
        <div style="font-size:2rem;margin-bottom:12px;animation:spin 1s linear infinite;display:inline-block">🌀</div>
        <p style="font-weight:600">Connecting to database...</p>
      </div>`;
  }

  // 3. Fetch products, categories, coupons, settings, banners from Supabase
  try {
    const [prodRes, catRes, couponRes, settingsRes, bannerRes] = await Promise.all([
      db.from('products').select('*').eq('in_stock', true).order('created_at'),
      db.from('categories').select('*').order('sort_order'),
      db.from('coupons').select('*'),
      db.from('settings').select('*').eq('id', 1).single(),
      db.from('banners').select('*').order('sort_order')
    ]);
    if (prodRes.data && prodRes.data.length) PRODUCTS = prodRes.data.map(dbToProduct);
    if (catRes && catRes.data && catRes.data.length) {
      CATEGORIES = catRes.data;
    } else {
      const savedCats = localStorage.getItem('restock_admin_categories');
      if (savedCats) {
        try { CATEGORIES = JSON.parse(savedCats); } catch(e){}
      }
    }
    if (bannerRes && bannerRes.data && bannerRes.data.length) {
      BANNERS = bannerRes.data;
    } else {
      const savedBanners = localStorage.getItem('restock_admin_banners');
      if (savedBanners) {
        try { BANNERS = JSON.parse(savedBanners); } catch(e){}
      }
    }
    const savedInterval = localStorage.getItem('restock_admin_banner_interval');
    if (savedInterval) {
      const sec = parseInt(savedInterval);
      if (sec > 0) heroAutoPlayIntervalMs = sec * 1000;
    }

    if (couponRes.data) COUPONS = dbToCoupons(couponRes.data);
    if (settingsRes.data) ADMIN_SETTINGS = dbToSettings(settingsRes.data);
  } catch (err) {
    console.warn('Supabase fetch failed — using defaults:', err);
    PRODUCTS = [...PRODUCTS_DEFAULT];
    const savedCats = localStorage.getItem('restock_admin_categories');
    if (savedCats) {
      try { CATEGORIES = JSON.parse(savedCats); } catch(e){}
    }
    const savedBanners = localStorage.getItem('restock_admin_banners');
    if (savedBanners) {
      try { BANNERS = JSON.parse(savedBanners); } catch(e){}
    }
  }

  // Setup carousel hover & touch pause
  const carouselWrap = document.getElementById('heroCarouselWrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', () => { isHeroPaused = true; });
    carouselWrap.addEventListener('mouseleave', () => { isHeroPaused = false; });
    carouselWrap.addEventListener('touchstart', () => { isHeroPaused = true; }, { passive: true });
    carouselWrap.addEventListener('touchend', () => {
      setTimeout(() => { isHeroPaused = false; }, 2000);
    }, { passive: true });
  }

  // 4. Bind search input
  const searchInput = document.getElementById('searchInput');
  const clearBtn    = document.getElementById('searchClearBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = State.searchQuery ? 'block' : 'none';
      renderProducts();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      State.searchQuery = '';
      clearBtn.style.display = 'none';
      renderProducts();
    });
  }

  // 5. Bind sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      State.sortBy = e.target.value;
      renderProducts();
    });
  }

  // 6. ESC closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeAllModals(); closeCartDrawer(); }
  });

  // 7. Initial render
  renderApp();

  // 8. Supabase Realtime — live sync from admin panel (any device!)
  db.channel('storefront-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
      const { data } = await db.from('products').select('*').eq('in_stock', true).order('created_at');
      if (data) {
        PRODUCTS = data.map(dbToProduct);
        // Clean cart items that were deleted or taken out of stock
        const validIds = new Set(PRODUCTS.map(p => p.id));
        let cleaned = false;
        Object.keys(State.cart).forEach(id => { if (!validIds.has(id)) { delete State.cart[id]; cleaned = true; } });
        if (cleaned) saveCart();
      }
      renderApp();
      showToast('Product catalog updated!', '🔄');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, async () => {
      const { data } = await db.from('coupons').select('*');
      if (data) {
        COUPONS = dbToCoupons(data);
        if (State.promoCode && !COUPONS[State.promoCode]) {
          State.promoCode = null; State.promoDiscountPct = 0;
        }
      }
      renderCartDrawer();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, async () => {
      const { data } = await db.from('settings').select('*').eq('id', 1).single();
      if (data) ADMIN_SETTINGS = dbToSettings(data);
      renderCartDrawer();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
      try {
        const { data } = await db.from('categories').select('*').order('sort_order');
        if (data && data.length) {
          CATEGORIES = data;
          renderCategoriesNav();
          renderFooterCategories();
          renderProducts();
          showToast('Categories updated!', '🗂️');
        }
      } catch (e) {}
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, async () => {
      try {
        const { data } = await db.from('banners').select('*').order('sort_order');
        if (data && data.length) {
          BANNERS = data;
          renderHeroCarousel();
          showToast('Banner carousel updated!', '🖼️');
        }
      } catch (e) {}
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') console.log('✅ Supabase Realtime connected');
    });

  // Cross-tab immediate sync via BroadcastChannel
  try {
    const catBc = new BroadcastChannel('restock_categories');
    catBc.onmessage = (ev) => {
      if (ev.data && ev.data.categories) {
        CATEGORIES = ev.data.categories;
        renderCategoriesNav();
        renderFooterCategories();
        renderProducts();
        showToast('Categories updated!', '🗂️');
      }
    };
  } catch (e) {}

  try {
    const bannerBc = new BroadcastChannel('restock_banners');
    bannerBc.onmessage = (ev) => {
      if (ev.data) {
        if (ev.data.banners) {
          BANNERS = ev.data.banners;
        }
        if (ev.data.interval) {
          const sec = parseInt(ev.data.interval);
          if (sec > 0) heroAutoPlayIntervalMs = sec * 1000;
        }
        renderHeroCarousel();
        showToast('Banner carousel updated!', '🖼️');
      }
    };
  } catch (e) {}

  // Storage event listener for cross-tab sync
  window.addEventListener('storage', (ev) => {
    if (ev.key === 'restock_admin_categories' && ev.newValue) {
      try {
        CATEGORIES = JSON.parse(ev.newValue);
        renderCategoriesNav();
        renderFooterCategories();
        renderProducts();
        showToast('Categories updated!', '🗂️');
      } catch (e) {}
    }
    if (ev.key === 'restock_admin_banners' && ev.newValue) {
      try {
        BANNERS = JSON.parse(ev.newValue);
        renderHeroCarousel();
        showToast('Banner carousel updated!', '🖼️');
      } catch (e) {}
    }
    if (ev.key === 'restock_admin_banner_interval' && ev.newValue) {
      const sec = parseInt(ev.newValue);
      if (sec > 0) {
        heroAutoPlayIntervalMs = sec * 1000;
        startHeroCarouselTimer();
      }
    }
  });
});

// Add spin keyframe if not present
const _spinStyle = document.createElement('style');
_spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(_spinStyle);
