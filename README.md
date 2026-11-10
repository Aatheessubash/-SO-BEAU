# SO BEAU — Premium Fashion & Medical Scrubs E-Commerce Platform

> **Brand Tagline:** SO YOU. SO BEAU.  
> **Brand Message:** *"Your stories. Your ideas. Our next creation."*

---

## 1. Project Overview

**SO BEAU** is an Australian fashion brand initially specialising in premium medical scrubs, founded by a doctor and someone with a fashion background. 

Combining haute-couture drape, 4-way stretch comfort, and hospital-grade performance, SO BEAU breaks away from traditional medical uniform suppliers to deliver a contemporary luxury fashion aesthetic for Australian healthcare professionals.

### Future Scalability
The platform architecture supports expansion into:
- **Medical Scrubs** (Tops, Joggers, Straight-Leg Pants, Signature Sets, Lab Coats & Performance Jackets)
- **Modal Underscrubs**
- **Activewear Studio** (Longline Bras, High-Rise 7/8 Leggings)
- **Everyday Clothing** (Modal Loungewear, Shift Overcoats)
- **Lifestyle & Shift Accessories** (Canvas Totes, Stethoscope Cases)

---

## 2. Visual Identity & Design System (Brand Guidelines 2026)

### Official Branding Concept
> *"So beau is a contemporary lifestyle brand rooted in individual expression, confidence, and modern sophistication. The refined wordmark and tagline — “So you. So beau.” capture the essence of a brand that empowers you to be yourself, in and beyond the workplace. Designed for stylish medical scrubs and future lifestyle apparel, So beau blends functionality with elevated, everyday style."*
> 
> **Website Domain:** `www.sobeau.com.au`

### Official Colour System
- **DEEP FOREST GREEN (`#1B3B2B`):** Primary signature shade and dark canvas. Conveys clinical authority, natural luxury, and timeless depth.
- **WARM CREAM (`#FDFBF7`):** Primary canvas and apparel base. Replaces cold sterile clinical whites with tactile warmth.
- **SOFT BEIGE (`#E7DEC2`):** Secondary neutral accent, reminiscent of natural studio linens, hangtags, and skin-tone harmony.
- **MUTED GOLD (`#C5A059`):** Prestige accent used for four-point star sparkles, luxury packaging hot foil, and embroidery.
- **TERRACOTTA CLAY / DESERT ROSE (`#8C554F`):** Hero campaign scrub colorway with soft matte finish, structured silhouette, and embroidered gold caduceus.

### Brand Pattern & Clear Space
- **The Monogram Star Matrix:** Repeating Warm Cream serif `S` letterforms on Deep Forest Green, adorned with four-point Muted Gold sparkles (`✦`) and diamond stars in the interstitial spaces.
- **Clear Space:** Proportional exclusion zone equal to cap-height `S` surrounding the wordmark and tagline.
- **Bespoke Wordmark:** Distinctive fluid ligature connecting `o` and `b`, with a four-point gold sparkle floating at the upper-right of the `u`.

### Typography
- **Editorial Headings:** `Cormorant Garamond` (Classic luxury fashion publication serif)
- **Body & Product Metadata:** `Plus Jakarta Sans` (Clean geometric sans-serif)

---

## 3. Implemented Pages & Routes

| Route | Page | Key Features |
|---|---|---|
| `/` | **Homepage** | Rotating announcement bar, editorial hero banner, curated collections (Best Sellers, New Arrivals, Shop All), brand philosophy, product anatomical highlights, founder story preview, clinician community quotes, shoppable Instagram grid. |
| `/collections/scrubs` | **Shop Page** | Category filter (Tops, Pants, Outerwear, Activewear, etc.), palette swatch filters, size chips (XXS to 3XL), price slider, sort dropdown, 3/4 column grid toggle, wishlist filter, active filter pills. |
| `/products/:slug` | **Product Detail Page (PDP)** | Multi-angle editorial gallery with hover zoom & fullscreen lightbox, color & size selectors, interactive size guide modal, sticky Add-to-Bag bar, rich collapsible accordions (BeauTech™ specs, fit notes, wash care, shipping), verified clinician review system with "Write a Review" form, and related products. |
| `/pages/our-story` | **Our Story** | The founder narrative: The Doctor & The Atelier ("Two worlds. One beautiful idea."), dual perspective grid (The Ward vs The Studio), future horizon roadmap. |
| `/pages/community` | **Community Hub** | "This brand is yours too" — clinician impact statistics, 4-stage co-design timeline, live community ideas voting board with real-time upvotes, interactive idea submission form, and clinician quotes. |
| `/pages/contact` | **Contact & Studio** | Melbourne studio contact info, department-specific contact form (Customer Care, Clinic Teams, Media, Feedback), bulk hospital team outfitting information, FAQ links. |
| `/checkout` | **Checkout Experience** | 2-step Australian checkout flow: Express checkout (Apple Pay, Afterpay), customer info, Australian state delivery address, Australia Post Standard vs Express method, promo code (`BEAU10` for 10% off), Australian GST (10%) breakdown. |
| `/orders/:id` | **Order Confirmation** | Real order receipt with generated reference (`SB-AU-XXXXXX`), dispatch estimate, itemized invoice, delivery details, and 30-day exchange assurance. |
| `/pages/size-guide` | **Sizing Guide** | Full Australian sizing chart (AU 4 to AU 20), metric (CM) and imperial (IN) measurement toggle, measurement instructions for Bust, Waist, and Hips. |
| `/pages/shipping` | **Shipping & Delivery** | Australia Post Standard & Express transit schedules, carbon-neutral shipping, free AU shipping threshold ($150 AUD). |
| `/pages/returns` | **Returns & Exchanges** | 30-day Australian exchange protocol, Australia Post QR return codes, infection control & hygiene criteria. |
| `/pages/faq` | **FAQ Knowledge Base** | Categorized accordion answering common questions on sizing, BeauTech™ fabric, care, ATO tax deductibility, and hospital bulk orders. |
| `/pages/privacy` | **Privacy Policy** | Compliant with the Australian Privacy Principles (APPs) and Privacy Act 1988 (Cth). |
| `/pages/terms` | **Terms & Conditions** | Compliant with Australian Consumer Law (ACL) Schedule 2. |
| `*` | **404 Not Found** | Editorial error screen with easy navigation recovery. |

---

## 4. Key Interactive Capabilities

1. **Persistent Cart Drawer (`CartDrawer`):**
   - Free shipping progress bar (`$150 AUD` threshold)
   - Real-time quantity adjustment & item removal
   - Promotional code application (`BEAU10` for 10% off)
   - Live Australian GST and total calculations
   - LocalStorage persistence

2. **Quick View Modal (`QuickViewModal`):**
   - Accessible from any product card across the store
   - Allows instant color, size, and quantity selection with direct add-to-bag action

3. **Global Search Modal (`SearchModal`):**
   - Instant live search matching product titles, descriptions, categories, and color names
   - Trending search pills (e.g. *Joggers*, *Sage V-Neck*, *Lab Coat*, *Modal*, *Activewear*)

4. **Wishlist System:**
   - Save pieces directly from product cards or detail pages
   - Dedicated filter on the Shop page to view saved pieces

5. **Clinician Reviews Engine:**
   - Real-time review submission with rating stars, clinician specialty (e.g. ICU Nurse, Doctor), location, and verified fit feedback

6. **Community Co-Design Voting Board:**
   - Live voting on prototype suggestions submitted by Australian healthcare professionals
   - Direct form to submit new scrub feature suggestions to the Melbourne design studio

7. **Australian Sizing & Pricing Compliance:**
   - All monetary amounts displayed in Australian Dollars (`$ AUD`)
   - Mandatory Australian GST (10%) calculations itemized
   - AU 4 to AU 20 standard mapping

---

## 5. Development & Build Scripts

```bash
# Run both Express API backend & Vite dev server concurrently
npm run dev

# Run Vite client only
npm run dev:client

# Run Express server only
npm run dev:server

# Build production bundle with TypeScript typecheck
npm run build

# Preview production build locally
npm run preview

# Start Express server in production
npm start
```
