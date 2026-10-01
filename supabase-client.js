/**
 * Restock Club — Supabase Client
 * Shared between storefront (index.html) and admin panel (admin.html).
 * Load AFTER the Supabase CDN script.
 */
const SUPABASE_URL  = 'https://yrqptdgrrzuhigpzluqg.supabase.co';
const SUPABASE_ANON = 'sb_publishable_3WAXGakQbrjtI-dN-Rs-0A_OM83GNSe';

// createClient comes from the Supabase CDN UMD bundle
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  realtime: { params: { eventsPerSecond: 10 } }
});
window.db = db;
