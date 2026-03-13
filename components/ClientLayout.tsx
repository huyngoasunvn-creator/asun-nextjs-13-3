'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { useApp } from '@/store/AppContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import FloatingContact from './FloatingContact';
import StockAlertModal from './StockAlertModal';
import HomePopup from './HomePopup';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const { products } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow pt-[145px] md:pt-[200px] pb-20 md:pb-12 px-3 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FloatingContact />
      <StockAlertModal />
      <HomePopup />
      <Footer />
    </div>
  );
};

export default ClientLayout;
