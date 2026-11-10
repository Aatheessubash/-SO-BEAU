import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { FlyToCartOverlay } from './components/common/FlyToCartOverlay';
import { GlobalInteractiveOverlays } from './components/common/GlobalInteractiveOverlays';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { ShippingPage } from './pages/ShippingPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <div className="site-wrapper">
          {/* Top Rotating Promotional & Shipping Announcements */}
          <AnnouncementBar />

          {/* Luxury Fashion Editorial Navbar */}
          <Navbar />

          {/* Main Application Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections/scrubs" element={<ShopPage />} />
              <Route path="/shop" element={<Navigate to="/collections/scrubs" replace />} />
              <Route path="/products" element={<Navigate to="/collections/scrubs" replace />} />
              <Route path="/scrubs" element={<Navigate to="/collections/scrubs" replace />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/pages/our-story" element={<OurStoryPage />} />
              <Route path="/about" element={<Navigate to="/pages/our-story" replace />} />
              <Route path="/our-story" element={<Navigate to="/pages/our-story" replace />} />
              <Route path="/brand" element={<Navigate to="/pages/our-story" replace />} />
              <Route path="/pages/community" element={<CommunityPage />} />
              <Route path="/pages/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:id" element={<OrderConfirmationPage />} />
              <Route path="/pages/size-guide" element={<SizeGuidePage />} />
              <Route path="/pages/shipping" element={<ShippingPage />} />
              <Route path="/pages/returns" element={<ReturnsPage />} />
              <Route path="/pages/faq" element={<FAQPage />} />
              <Route path="/pages/privacy" element={<PrivacyPage />} />
              <Route path="/pages/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Luxury Editorial Footer */}
          <Footer />

          {/* Persistent Global Drawers & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
          <ToastContainer />
          <FlyToCartOverlay />
          <GlobalInteractiveOverlays />
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
