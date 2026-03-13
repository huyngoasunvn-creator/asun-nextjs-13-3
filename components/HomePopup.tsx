
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../store/AppContext';

const HomePopup: React.FC = () => {
  const { homePopup } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Chỉ hiện ở trang chủ
    if (pathname !== '/') return;
    
    // Kiểm tra nếu popup đang hoạt động
    if (!homePopup.isActive || !homePopup.imageUrl) return;

    // Kiểm tra thời gian
    const now = new Date();
    if (homePopup.startDate && new Date(homePopup.startDate) > now) return;
    if (homePopup.endDate && new Date(homePopup.endDate) < now) return;

    // Kiểm tra session (chỉ hiện 1 lần mỗi lần mở trình duyệt)
    const hasSeenPopup = sessionStorage.getItem('hasSeenHomePopup');
    if (hasSeenPopup) return;

    // Hiển thị sau 1.5s để mượt mà
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname, homePopup]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenHomePopup', 'true');
  };

  const handleAction = () => {
    handleClose();
    if (homePopup.link) {
      if (homePopup.link.startsWith('http')) {
        window.open(homePopup.link, '_blank');
      } else {
        router.push(homePopup.link);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative max-w-lg w-full bg-white rounded-sm shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-90 duration-500"
        onClick={e => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-10 h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Ảnh quảng cáo */}
        <div 
          onClick={handleAction}
          className="cursor-pointer group relative overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[400px]"
        >
          <img 
            src={homePopup.imageUrl} 
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
            alt="Promotion" 
          />
          
          {/* Overlay hiệu ứng */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Nút bấm giả lập trên ảnh */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
             <button className="px-10 py-3.5 bg-white text-[#ee4d2d] font-black uppercase text-xs tracking-[0.2em] shadow-2xl rounded-full transform group-hover:-translate-y-2 transition-all">
                KHÁM PHÁ NGÀY
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
