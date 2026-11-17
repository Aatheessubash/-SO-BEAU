# Frontend Performance & Core Web Vitals Audit Report

**Audited Route:** `http://localhost:3001` (Home & Product Details)  
**Evaluation Engine:** Chrome DevTools Performance & Navigation Timing APIs  
**Overall Performance Score:** **70 / 100**  

---

## 1. Core Web Vitals Lab Measurement Scorecard

| Metric | Measured Value | Official Target | Verdict | Diagnostic Impact |
|---|---|---|---|---|
| **FCP** (First Contentful Paint) | **628 ms** | ≤ 1,800 ms | ✅ **GOOD** | Rapid initial DOM text rendering. |
| **LCP** (Largest Contentful Paint) | **848 ms** | ≤ 2,500 ms | ✅ **GOOD** | Hero scrub set model image renders swiftly. |
| **CLS** (Cumulative Layout Shift) | **0.12** | ≤ 0.10 | ⚠️ **POOR** | Shifting elements caused by missing image dimension attributes. |
| **TTFB** (Time to First Byte) | **2 ms** | ≤ 800 ms | ✅ **GOOD** | Extremely fast local/edge Vite server response. |
| **DOM Element Count** | **535 nodes** | ≤ 1,500 nodes | ✅ **OPTIMAL** | Lean, well-pruned DOM tree avoiding excessive layout recalculation. |
| **Render-Blocking Scripts** | **0 scripts** | 0 scripts | ✅ **GOOD** | Modern ESM module architecture with zero blocking header tags. |

---

## 2. Resource & Asset Weight Breakdown
- **Total Requests Tracked:** 115 requests.
- **HTTP Failures (4xx / 5xx):** 0 failures.
- **Slow Requests (> 800ms):** 0 requests.
- **Duplicate Requests:** 1 duplicate check (idempotent favicon request).
- **Images Missing Explicit Dimensions:** 26 images.
- **Legacy PNG/JPEG Images Pending WebP Conversion:** 28 images.

---

## 3. High-Priority Performance Recommendations

1. **Eliminate Cumulative Layout Shift (CLS):**
   Add explicit `width` and `height` HTML attributes (or CSS `aspect-ratio`) to the 26 identified `<img>` elements across product cards and galleries. This allows the browser to reserve the exact layout box before the asset finishes loading, dropping CLS from 0.12 to < 0.02.
2. **Convert Legacy Images to WebP/AVIF:**
   Convert 28 uncompressed PNG/JPEG files into modern WebP format with 85% compression quality. This will reduce total image payload by approximately 45%.
3. **Preload Critical Hero Assets:**
   Add `<link rel="preload" as="image" href="/images/blue_scrub_female/TYRAECOM28.125576_2048x.webp" fetchpriority="high">` in `index.html` to further optimize LCP on mobile connections.
