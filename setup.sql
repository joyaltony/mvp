-- ============================================================
-- Restock Club — Supabase Schema + Seed Data
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT,
  price NUMERIC(10,2) NOT NULL,
  old_price NUMERIC(10,2),
  rating NUMERIC(3,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  badge TEXT,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  description TEXT,
  origin TEXT,
  in_stock BOOLEAN DEFAULT true,
  nutrition JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount INTEGER NOT NULL CHECK (discount BETWEEN 1 AND 99),
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SETTINGS TABLE (always a single row with id=1)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  free_shipping NUMERIC(10,2) DEFAULT 35.00,
  delivery_fee NUMERIC(10,2) DEFAULT 3.99,
  tax_rate NUMERIC(5,2) DEFAULT 5.00,
  promo_label TEXT DEFAULT '⚡ Limited Offer',
  bar_message TEXT DEFAULT 'Use code FRESH20 for 20% off your entire order + Free delivery on orders over $35!',
  highlight_code TEXT DEFAULT 'FRESH20',
  hero_pill TEXT DEFAULT '🌿 100% Farm To Doorstep',
  hero_title TEXT DEFAULT 'Crisp, Organic Groceries Delivered in 20 Mins',
  hero_subtitle TEXT DEFAULT 'Directly from certified local organic family farms. Always picked at the peak of flavor, pesticide-free, and guaranteed fresh.',
  delivery_time TEXT DEFAULT '20-30 minutes',
  store_name TEXT DEFAULT 'Restock Club',
  contact_email TEXT DEFAULT 'hello@restockclub.com',
  flag_dark_mode BOOLEAN DEFAULT true,
  flag_wishlist BOOLEAN DEFAULT true,
  flag_quick_view BOOLEAN DEFAULT true,
  flag_promo_bar BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT,
  items INTEGER DEFAULT 1,
  total NUMERIC(10,2),
  payment TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (allow public access — no auth for MVP)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_products" ON products;
DROP POLICY IF EXISTS "public_all_coupons"  ON coupons;
DROP POLICY IF EXISTS "public_all_settings" ON settings;
DROP POLICY IF EXISTS "public_all_orders"   ON orders;

CREATE POLICY "public_all_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_coupons"  ON coupons  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_orders"   ON orders   FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED — Default Settings (single row)
-- ============================================================
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED — Default Coupons
-- ============================================================
INSERT INTO coupons (code, discount, description, active) VALUES
  ('FRESH20', 20, '20% off entire order', true),
  ('SAVE10',  10, '10% off entire order', true),
  ('ORGANIC', 15, '15% off organic items', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED — Default Product Catalog (16 products)
-- ============================================================
INSERT INTO products (id, name, category, unit, price, old_price, rating, reviews, badge, tags, image, description, origin, in_stock, nutrition) VALUES
('prod-1','Organic Hass Avocados','fruits','Pack of 3 pcs',3.99,5.49,4.9,142,'Organic',ARRAY['organic','vegan'],'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80','Creamy, nutrient-dense Hass avocados grown in certified organic soil. Perfect for fresh guacamole, salads, and morning toast.','Green Valley Farm, California',true,'{"cal":"160 kcal","carbs":"8.5g","protein":"2g"}'),
('prod-2','Crisp Honeycrisp Apples','fruits','1 kg (~5-6 pcs)',3.49,4.80,4.8,89,'Fresh Pick',ARRAY['organic','deals'],'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80','Extra juicy with the perfect balance of sweet and tangy crunch. Harvested directly from orchard branches within 24 hours.','Hood River Orchards, Oregon',true,'{"cal":"95 kcal","carbs":"25g","protein":"0.5g"}'),
('prod-3','Fresh Farm Whole Milk','dairy','1 Gallon (3.8L)',4.29,NULL,4.9,210,'100% Grass-Fed',ARRAY['organic'],'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80','Rich, creamy whole milk from pasture-raised, grass-fed cows. Non-homogenized natural goodness loaded with calcium and vitamins.','Meadowbrook Dairy, Wisconsin',true,'{"cal":"150 kcal","carbs":"12g","protein":"8g"}'),
('prod-4','Artisan Sourdough Country Loaf','bakery','650g loaf',4.99,6.20,4.9,175,'Freshly Baked',ARRAY['vegan','deals'],'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80','Slow-fermented for 36 hours using a 10-year heirloom starter. Crackly caramelized crust with a soft, airy, chew-worthy crumb.','Golden Hearth Bakery, Local',true,'{"cal":"185 kcal","carbs":"36g","protein":"7g"}'),
('prod-5','Organic Baby Spinach Leaves','vegetables','300g clamshell',2.79,3.50,4.7,64,'Pre-Washed',ARRAY['organic','vegan','gluten-free'],'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80','Tender, triple-washed baby spinach packed with iron, vitamin K, and antioxidants. Ready to toss into your healthy green smoothies.','Salinas Organic Growers, California',true,'{"cal":"23 kcal","carbs":"3.6g","protein":"2.9g"}'),
('prod-6','Sweet Driscoll Strawberries','fruits','450g pack',4.49,5.99,4.8,132,'Sale 25%',ARRAY['organic','deals','vegan','gluten-free'],'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80','Sun-ripened, intensely sweet red berries hand-picked at peak ripeness. Naturally fragrant, luscious, and full of Vitamin C.','Coastal Berry Groves, California',true,'{"cal":"49 kcal","carbs":"11.7g","protein":"1g"}'),
('prod-7','Pasture-Raised Brown Eggs','dairy','12 large eggs',4.89,NULL,5.0,310,'Free-Range',ARRAY['organic','gluten-free'],'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80','Deep orange yolks with unmatched rich flavor. Laid by hens with 108+ square feet of outdoor pasture roaming space each.','Vital Pastures Co., Iowa',true,'{"cal":"72 kcal","carbs":"0.4g","protein":"6.3g"}'),
('prod-8','Greek Whole Milk Plain Yogurt','dairy','500g tub',3.89,4.60,4.8,98,'High Protein',ARRAY['gluten-free','deals'],'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80','Traditional strained Greek yogurt, velvety thick texture packed with 15g protein per serving and 5 active live probiotic cultures.','Olympus Dairy, New York',true,'{"cal":"130 kcal","carbs":"6g","protein":"15g"}'),
('prod-9','Cold-Pressed Valencia Orange Juice','beverages','1 Liter bottle',4.79,5.50,4.9,145,'No Added Sugar',ARRAY['organic','vegan','gluten-free'],'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80','100% pure squeezed Florida Valencia oranges. Never heated or concentrated, preserving vibrant citrus aroma and natural enzymes.','Citrus Heights Grove, Florida',true,'{"cal":"110 kcal","carbs":"26g","protein":"2g"}'),
('prod-10','Extra Virgin Organic Olive Oil','grocery','750ml glass bottle',11.99,14.99,4.9,180,'First Cold Press',ARRAY['organic','vegan','gluten-free','deals'],'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80','Single-estate Koroneiki olives cold-pressed within 4 hours of picking. Low acidity with grassy, peppery notes.','Crete Estate, Greece',true,'{"cal":"120 kcal","carbs":"0g","protein":"0g"}'),
('prod-11','Roasted Sea Salt Pistachios','snacks','250g resealable pouch',5.99,7.20,4.8,112,'Keto Friendly',ARRAY['vegan','gluten-free','deals'],'https://images.unsplash.com/photo-1525412852267-331264b3ef8b?auto=format&fit=crop&w=600&q=80','Slow dry-roasted California pistachios dusted lightly with mineral Mediterranean sea salt. High fiber, healthy fats, and protein.','San Joaquin Orchards, California',true,'{"cal":"160 kcal","carbs":"8g","protein":"6g"}'),
('prod-12','Heirloom Vine-Ripe Tomatoes','vegetables','750g (~4-5 pcs)',3.29,4.10,4.7,74,'Sweet and Juicy',ARRAY['organic','vegan','gluten-free'],'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80','Vibrant multicolored heirloom varieties with complex old-world tomato sweetness. Ideal for Caprese salad and rustic sauces.','Heritage Ridge Greenhouse, Ohio',true,'{"cal":"22 kcal","carbs":"4.8g","protein":"1.1g"}'),
('prod-13','Raw Unfiltered Wildflower Honey','grocery','400g glass jar',6.99,NULL,5.0,240,'Raw and Pure',ARRAY['organic','gluten-free'],'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80','Unpasteurized raw honey harvested from wild mountain blossoms. Naturally retains active bee pollen, propolis, and rich floral depth.','Blue Ridge Apiary, North Carolina',true,'{"cal":"64 kcal","carbs":"17g","protein":"0.1g"}'),
('prod-14','Crisp Bell Peppers Trio','vegetables','3 pack (Red, Yellow, Orange)',3.69,4.50,4.8,62,'Vitamin C Boost',ARRAY['organic','vegan','deals'],'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80','Thick-walled, vibrant sweet bell peppers with an invigorating crisp crunch. 200% daily Vitamin C requirement in half a pepper.','Greenhouse Valley, Ontario',true,'{"cal":"31 kcal","carbs":"6g","protein":"1g"}'),
('prod-15','Ceremonial Grade Matcha Blend','beverages','100g tin',9.99,12.50,4.9,86,'Direct From Japan',ARRAY['organic','vegan','deals'],'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80','Shade-grown first harvest stone-ground green tea leaves from Uji, Kyoto. Smooth umami notes with zero bitterness and calm alertness.','Uji Tea Gardens, Kyoto, Japan',true,'{"cal":"3 kcal","carbs":"0.4g","protein":"0.3g"}'),
('prod-16','Multigrain Seed Artisan Crackers','snacks','200g box',3.79,4.40,4.6,51,'Non-GMO',ARRAY['vegan','organic'],'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80','Baked with whole chia, flaxseed, sesame, and quinoa seeds. Hearty crunch that pairs harmoniously with artisan dips and cheeses.','Rustic Grain Co., Vermont',true,'{"cal":"135 kcal","carbs":"18g","protein":"4g"}'),
('prod-17','Fresh Organic Broccoli Florets','vegetables','500g bunch',2.49,3.20,4.8,95,'Farm Fresh',ARRAY['organic','vegan','deals'],'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80','Crisp, emerald-green organic broccoli crowns harvested early morning. Packed with dietary fiber, sulforaphane, and Vitamin C.','Green Valley Organic Farms, California',true,'{"cal":"34 kcal","carbs":"6.6g","protein":"2.8g"}'),
('prod-18','Crisp Rainbow Sweet Carrots','vegetables','1 kg bunch with greens',2.99,3.75,4.9,82,'Crisp & Sweet',ARRAY['organic','vegan','deals'],'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80','Sweet, earthy heirloom rainbow carrots rich in beta-carotene. Perfect for roasting, dipping in hummus, or juicing.','Sunburst Organic Farms, Oregon',true,'{"cal":"41 kcal","carbs":"9.6g","protein":"0.9g"}'),
('prod-19','Golden Sweet Cavendish Bananas','fruits','Bunch (~6-7 pcs, 1.2 kg)',1.89,2.40,4.9,320,'Bestseller',ARRAY['organic','vegan'],'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80','Naturally sweet bananas packed with potassium, Vitamin B6, and quick clean energy for breakfasts and workouts.','Rainforest Fair Trade Alliance, Costa Rica',true,'{"cal":"89 kcal","carbs":"22.8g","protein":"1.1g"}'),
('prod-20','Alphonso Royal Mangoes Pack','fruits','Box of 4 premium pcs',7.99,9.99,5.0,214,'King of Mangoes',ARRAY['organic','deals'],'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80','Celebrated for their saffron aroma, fiberless melt-in-mouth pulp, and unrivaled natural sweetness. The true king of fruits.','Ratnagiri Heritage Groves',true,'{"cal":"60 kcal","carbs":"15g","protein":"0.8g"}'),
('prod-21','Royal Aged Himalayan Basmati Rice','grocery','5 kg Sealed Bag',14.49,17.99,4.9,189,'Aged 2 Years',ARRAY['organic','gluten-free','deals'],'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80','Naturally aged long-grain basmati with an unmistakable aroma and fluffy, non-sticky grains that cook up to twice their length.','Himalayan Foothills, Punjab',true,'{"cal":"160 kcal","carbs":"36g","protein":"3.5g"}'),
('prod-22','Stone-Ground 100% Whole Wheat Chakki Atta','grocery','5 kg Bag',9.99,12.00,4.8,140,'High Fiber',ARRAY['organic','vegan'],'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80','Traditional stone-ground whole wheat flour that retains the germ, bran, and essential nutrients for soft, nutritious rotis and breads.','Madhya Pradesh Organic Farms',true,'{"cal":"340 kcal","carbs":"72g","protein":"12g"}'),
('prod-23','Organic Rolled Oats & Chia Supermix','grocery','1 kg Resealable Pouch',5.49,6.80,4.9,115,'Heart Healthy',ARRAY['organic','vegan','gluten-free','deals'],'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80','100% whole grain rolled jumbo oats blended with organic black chia seeds. High in soluble beta-glucan fiber and plant protein.','Midwest Organic Mills, USA',true,'{"cal":"375 kcal","carbs":"65g","protein":"14g"}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_categories" ON categories;
CREATE POLICY "public_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);

INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('vegetables', 'Vegetables', '🥦', 1, true),
  ('grocery', 'Grocery', '🛒', 2, true),
  ('fruits', 'Fruits', '🍎', 3, true),
  ('dairy', 'Dairy & Eggs', '🥛', 4, true),
  ('bakery', 'Bakery', '🥖', 5, true),
  ('beverages', 'Beverages', '🥤', 6, true),
  ('snacks', 'Snacks', '🍿', 7, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- ============================================================
-- 6. BANNERS TABLE (Hero Carousel)
-- ============================================================
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  highlight TEXT,
  subtitle TEXT,
  pill TEXT,
  image TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '#groceries-heading',
  cta_sec_text TEXT,
  cta_sec_cat TEXT,
  badge_icon TEXT DEFAULT '⚡',
  badge_title TEXT,
  badge_code TEXT,
  bg_gradient TEXT,
  sort_order INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_banners" ON banners;
CREATE POLICY "public_all_banners" ON banners FOR ALL USING (true) WITH CHECK (true);

INSERT INTO banners (id, title, highlight, subtitle, pill, image, cta_text, cta_link, cta_sec_text, cta_sec_cat, badge_icon, badge_title, badge_code, bg_gradient, sort_order, active) VALUES
  ('banner-1', 'Crisp, Organic Groceries', 'Delivered in 20 Mins', 'Directly from certified local organic family farms. Always picked at the peak of flavor, pesticide-free, and guaranteed fresh.', '🌿 100% Farm To Doorstep', 'assets/hero_banner.jpg', '🛒 Shop Today''s Harvest', '#groceries-heading', 'Explore Fresh Fruits', 'fruits', '⚡', 'Flash 20% OFF', 'Code: FRESH20', 'linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%)', 1, true),
  ('banner-2', 'Handpicked Green Harvest', 'Up to 25% Off', 'Sweet heirloom carrots, vine-ripened tomatoes, and crisp baby spinach washed and packed within hours of morning harvesting.', '🥦 Farm-Fresh Veggie Fest', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', '🥦 Browse Farm Veggies', '#groceries-heading', 'Shop All Produce', 'vegetables', '🥕', 'Veggie Special', 'Save 25% Today', 'linear-gradient(135deg, #0f3826 0%, #155e3e 50%, #10b981 100%)', 2, true),
  ('banner-3', 'Pure Himalayan Basmati & Cold-Pressed', 'Artisan Oils', 'Stock your home with organic whole wheat flour, single-estate Greek olive oils, and mountain wildflower raw honey.', '🛒 Kitchen Staples & Oils', 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=900&q=80', '🌾 Shop Grocery Staples', '#groceries-heading', 'View Dairy & Eggs', 'grocery', '🍯', 'Free Shipping', 'On Orders $35+', 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #334155 100%)', 3, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  highlight = EXCLUDED.highlight,
  subtitle = EXCLUDED.subtitle,
  pill = EXCLUDED.pill,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- ============================================================
-- ENABLE REALTIME (run once — enables postgres_changes for all tables)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE banners;
