
'use client';

import React from 'react';
import { useApp } from '../store/AppContext';

const Footer: React.FC = () => {
  const { appConfig } = useApp();

  return (
    <footer className="bg-white border-t-4 border-[#ee4d2d] text-slate-600 py-8 md:py-12 px-4 mt-10 md:mt-20">
      <div className="max-w-7xl mx-auto border-b border-slate-100 pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          
          {/* Cột 1: Tải ứng dụng - Tối ưu Mobile */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest">Tải ứng dụng</h4>
            <div className="flex flex-row md:flex-row gap-3 md:gap-4 items-center">
               {/* Ẩn QR trên mobile vì không thực tế khi dùng chính điện thoại đó để quét */}
               <div className="hidden md:flex w-20 h-20 bg-white items-center justify-center border p-1 rounded-sm shadow-sm shrink-0">
                  <img src={appConfig.qrCodeUrl} alt="App QR" className="w-full h-full object-contain" />
               </div>
               <div className="flex flex-row md:flex-col gap-2 md:gap-2 md:justify-between md:py-0.5">
                  <a 
                    href={appConfig.appStoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white border border-slate-200 px-3 py-2 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <i className="fa-brands fa-apple text-sm"></i> App Store
                  </a>
                  <a 
                    href={appConfig.googlePlayUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white border border-slate-200 px-3 py-2 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <i className="fa-brands fa-google-play text-sm"></i> Google Play
                  </a>
               </div>
            </div>
          </div>

          {/* Cột 2: Chứng nhận Bộ Công Thương - Gọn hơn */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest">Chứng nhận</h4>
            {appConfig.bctUrl && (
              <a 
                href={appConfig.bctUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block transition-transform hover:scale-105 active:scale-95"
              >
                <img 
                  src="https://dangkywebvoibocongthuong.com/wp-content/uploads/2021/11/logo-da-thong-bao-bo-cong-thuong.png" 
                  alt="Đã thông báo Bộ Công Thương" 
                  className="h-10 md:h-16 w-auto object-contain" 
                />
              </a>
            )}
          </div>

          {/* Cột 3: Hệ thống kho hàng - Gọn hơn */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest">Hệ thống kho hàng</h4>
            <div className="space-y-3 md:space-y-4 text-center md:text-left w-full">
              <div className="flex items-start gap-2.5 justify-center md:justify-start">
                <i className="fa-solid fa-location-dot text-[#ee4d2d] mt-0.5 shrink-0 text-xs"></i>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Trung tâm HN</span>
                  <p className="text-[10px] md:text-[11px] leading-snug">386 Nguyễn Văn Linh, Long Biên, Hà Nội.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 justify-center md:justify-start">
                <i className="fa-solid fa-location-dot text-[#ee4d2d] mt-0.5 shrink-0 text-xs"></i>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Trung tâm HCM</span>
                  <p className="text-[10px] md:text-[11px] leading-snug">Hẻm 2 Thủy Lợi, Phước Long A, TP. Thủ Đức.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bản quyền hiển thị rõ nét */}
      <div className="max-w-7xl mx-auto pt-6 md:pt-8 text-center">
        <p className="text-[10px] md:text-[11px] text-slate-400 font-bold tracking-wider uppercase">
          © 2026 DROPPII ASUN. ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
