# Collector's Corner — Dev Handoff

**Repo:** https://github.com/whatusernameshouldiuse/rentagun-collectors-corner
**Preview:** https://collectors-corner-nu.vercel.app
**All files are in the `woocommerce-ready/` folder in the repo.**

---

## 1. Upload Images to WordPress Media Library

Upload these files from `woocommerce-ready/guns/`:

| File | Product |
|------|---------|
| `imi-uzi.jpeg` | IMI UZI Action Arms Model A |
| `sw-model-39-2.jpeg` | Smith & Wesson Model 39-2 |
| `ruger-10-22-takedown.jpeg` | Ruger 10/22 Takedown |
| `ati-gsg5.jpeg` | ATI GSG-5 |
| `emperor-duke.jpeg` | Emperor Duke |
| `ruger-bearcat.jpeg` | Ruger Bearcat |
| `collectors-corner-badge.png` | Category badge |

**Note the WP media URLs after upload — you'll need them in steps 3 and 4.**

---

## 2. Import Products

1. Go to **WooCommerce > Products > Import**
2. Upload `collectors-corner-import-sheets.csv` from `~/Work/Rentagun/data/`
3. Map columns (should auto-detect since headers match existing export)
4. Run import — creates 6 booking products in "Collectors Corner" category
5. After import, edit each product and swap the Vercel image URL with the WP media URL from Step 1

**Category:** The import CSV sets category to "Collectors Corner" — it will be auto-created if it doesn't exist. If you already created it manually, make sure the slug is `collectors-corner`.

---

## 3. Badge Overlay on Product Thumbnails

**What it does:** Shows the Collector's Corner shield badge in the top-right corner of product images when browsing the shop — only on products in the "Collectors Corner" category.

**Install via Code Snippets plugin (recommended):**
1. Install "Code Snippets" plugin if not already active
2. Create new snippet
3. Paste contents of `woocommerce-ready/collectors-corner-badge-overlay.php`
4. Find this line and update with the actual WP media URL of the badge:
   ```php
   $badge_url = '/wp-content/uploads/2026/02/collectors-corner-badge.png';
   ```
5. Activate the snippet

**Works on:** Shop page, category archive pages, and single product pages.

---

## 4. Homepage Featured Products → Collector's Corner

**What it does:** Replaces the homepage featured products section with Collector's Corner products.

**Easiest method — UX Builder shortcode:**
1. Open homepage in **Flatsome > UX Builder**
2. Find the current featured products section
3. Replace with a Text/shortcode element containing:
   ```
   [collectors_corner_showcase]
   ```
4. This requires the PHP from `woocommerce-ready/flatsome-collectors-corner-featured.php` to be added as a Code Snippet first (same process as Step 3)
5. Find the badge URL line and update it:
   ```php
   $badge_url = '/wp-content/uploads/2026/02/collectors-corner-badge.png';
   ```

**What the shortcode renders:**
- Warm cream background section
- Collector's Corner badge image
- "Collector's Corner" heading in Bebas Neue
- Italic Playfair Display subtitle
- 3-column product grid with badge overlays
- Red "Browse the Full Collection" CTA button → `/product-category/collectors-corner/`

**Alternative — simpler approach:**
If you just want to swap the products without custom styling, replace the current featured products shortcode with:
```
[ux_products cat="collectors-corner" products="6" columns="3" title="Collector's Corner"]
```

---

## 5. Landing Page (Optional)

The full Collector's Corner landing page is in `woocommerce-ready/`:
- `collectors-corner.html` — Static HTML
- `collectors-corner.css` — Stylesheet
- `collectors-corner.js` — Scroll animations, counters

This is the full page visible at https://collectors-corner-nu.vercel.app. It can be added as a custom WordPress page template if desired, or used as a design reference.

**Fonts needed** (add via theme settings or `<link>` tags):
- Bebas Neue (headlines)
- Inter (body)
- Playfair Display (serif accents)

---

## Files Summary

```
woocommerce-ready/
├── collectors-corner-badge-overlay.php    ← Badge on product thumbnails
├── flatsome-collectors-corner-featured.php ← Homepage featured section
├── collectors-corner-badge.png            ← The badge image
├── collectors-corner.html                 ← Landing page HTML
├── collectors-corner.css                  ← Landing page CSS
├── collectors-corner.js                   ← Landing page JS
└── guns/                                  ← Product images
    ├── imi-uzi.jpeg
    ├── sw-model-39-2.jpeg
    ├── ruger-10-22-takedown.jpeg
    ├── ati-gsg5.jpeg
    ├── emperor-duke.jpeg
    └── ruger-bearcat.jpeg
```

**Import CSV:** `~/Work/Rentagun/data/collectors-corner-import-sheets.csv`

---

## Quick Test Checklist

- [ ] 6 products visible at `/product-category/collectors-corner/`
- [ ] Badge appears on CC product thumbnails in shop
- [ ] Badge does NOT appear on non-CC products
- [ ] Homepage shows CC products in featured section
- [ ] "Browse the Full Collection" CTA goes to `/product-category/collectors-corner/`
- [ ] Booking calendar works (7-30 day range, date picker)
