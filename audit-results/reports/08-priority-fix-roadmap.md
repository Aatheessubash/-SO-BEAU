# Priority Fix Roadmap & Engineering Remediation Plan

This roadmap structures all identified defects into an actionable phased engineering plan.

---

## Phase 1: Critical (P0) Blockers
- **Current Status:** ✅ **ZERO P0 BUGS DETECTED.**
- No application crashes, runtime errors, or data loss conditions present.

---

## Phase 2: High-Priority (P1) Workflow & Responsive Fixes
**Target SLA:** 24 Hours

### Task 2.1: Resolve Tablet Portrait Header Overflow (`RESP-001`)
- **Target File:** `src/styles/components/Navbar.scss`
- **Root Cause:** Breakpoint for desktop text navigation vs hamburger drawer is currently set at 768px, but 5 text links + logo + 3 action buttons require ~840px.
- **Action:** Expand mobile hamburger drawer trigger query from `768px` to `900px` (`@media (max-width: 900px)`).
- **Estimated Effort:** 10 minutes.

---

## Phase 3: Responsive & Layout Polish (P2)
**Target SLA:** Current Sprint

### Task 3.1: Contain Mobile Thumbnail Scroll Button (`UI-002`)
- **Target File:** `src/styles/components/ProductGallery.scss`
- **Action:** Add `max-width: 100%; overflow-x: auto; scrollbar-width: none;` to `.gallery-thumbnails-strip` on mobile breakpoint (≤ 768px).
- **Estimated Effort:** 15 minutes.

### Task 3.2: Eliminate Layout Shifts on Images (`PERF-001`)
- **Target Files:** `ProductCard.tsx`, `ProductGallery.tsx`, `BrandLogo.tsx`
- **Action:** Add explicit `width` and `height` attributes or declare `aspect-ratio: 3 / 4;` on `.product-gallery-container` and `.product-card-image`.
- **Estimated Effort:** 30 minutes.

### Task 3.3: Boost Auxiliary Metadata Color Contrast (`A11Y-001`)
- **Target File:** `src/styles/pages/ProductDetailPage.scss`
- **Action:** Update `.card-stock-hint` color from `#94A3B8` to `#64748B` to achieve 4.62:1 WCAG AA contrast ratio.
- **Estimated Effort:** 5 minutes.

---

## Phase 4: Frontend Performance Optimizations
**Target SLA:** Next Sprint

### Task 4.1: Convert Legacy Image Formats to WebP (`PERF-003`)
- **Action:** Batch compress the 28 identified PNG/JPEG lookbook assets to WebP format.

### Task 4.2: Add High-Contrast Keyboard Focus Rings (`A11Y-002`)
- **Action:** Standardize `:focus-visible` styling across all action buttons in `_variables.scss`.

---

## Phase 5: Verification in Mode B
Once Phase 2 and Phase 3 fixes are implemented, re-execute:
```bash
/complete-ui-ux-audit verify
```
This will automatically verify that `scrollWidth === 800px` on tablet viewports and that CLS drops below 0.05.
