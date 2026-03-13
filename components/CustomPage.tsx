
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '../store/AppContext';

const CustomPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { customMenus } = useApp();
  const [isReady, setIsReady] = useState(false);

  // Đợi 1.5 giây để đảm bảo Firebase đã kịp trả về dữ liệu customMenus
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const activeMenu = useMemo(() => {
    if (!slug || customMenus.length === 0) return undefined;
    // Chuẩn hóa slug để so khớp chính xác trên mọi trình duyệt mobile
    const targetSlug = slug.toLowerCase().trim();
    return customMenus.find(m => m.slug.toLowerCase() === targetSlug && m.isActive);
  }, [slug, customMenus]);

  if (!activeMenu) {
    if (!isReady) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-[#ee4d2d] rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đang kết nối trang ẩn...</p>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-6">
        <i className="fa-solid fa-link-slash text-6xl text-slate-100"></i>
        <h2 className="text-xl font-black uppercase text-slate-400 italic">Trang không tồn tại hoặc đã bị ẩn</h2>
        <p className="text-[10px] text-slate-400 uppercase">Vui lòng quay lại Trang chủ hoặc thử lại sau</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-[#ee4d2d]"></div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
          {activeMenu.title}
        </h1>
      </div>
      
      <div className="flex-grow bg-white rounded-sm border shadow-sm overflow-hidden relative" style={{ minHeight: 'calc(100vh - 300px)' }}>
         <iframe 
            src={activeMenu.url} 
            className="absolute inset-0 w-full h-full border-none"
            title={activeMenu.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
         ></iframe>
      </div>
      
      <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-sm">
        <p className="text-[9px] md:text-[10px] text-orange-700 italic font-medium leading-relaxed">
          * Nội dung này được nhúng trực tiếp từ liên kết ẩn của hệ thống Asun. Nếu không thấy nội dung, vui lòng kiểm tra trình duyệt của bạn có chặn Iframe hay không.
        </p>
      </div>
    </div>
  );
};

export default CustomPage;
