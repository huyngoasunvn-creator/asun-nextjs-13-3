
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Promotions from './components/Promotions';
import FlashSales from './components/FlashSales';
import ShockSales from './components/ShockSales';
import Wishlist from './components/Wishlist';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import FloatingContact from './components/FloatingContact';
import StockAlertModal from './components/StockAlertModal';
import HomePopup from './components/HomePopup';
import CustomPage from './components/CustomPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { products } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (authLoading || (products.length === 0)) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[300]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#ee4d2d] rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Asun xin chào Quý Khách!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow pt-[145px] md:pt-[200px] pb-20 md:pb-12 px-3 md:px-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/p/:slug" element={<CustomPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/flash-sales" element={<FlashSales />} />
          <Route path="/shock-sales" element={<ShockSales />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
          <Route path="*" element={<ProductList />} />
        </Routes>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FloatingContact />
      <StockAlertModal />
      <HomePopup />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <MainLayout />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
