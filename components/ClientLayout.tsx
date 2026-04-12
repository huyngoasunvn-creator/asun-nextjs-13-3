'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import FloatingContact from './FloatingContact';
import StockAlertModal from './StockAlertModal';
import HomePopup from './HomePopup';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
