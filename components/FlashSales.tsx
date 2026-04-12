
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import Link from 'next/link';
import { Product } from '../types';
import { createSlug } from '../utils/seo';
import SmartImage from './SmartImage';

const FlashSaleCountdown: React.FC<{ targetTime: string, label: string, theme: 'red' | 'blue' }> = ({ targetTime, label, theme }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetTime).getTime() - new Date().getTime();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        h: Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0'),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const bgColor = theme === 'red' ? 'bg-slate-900' : 'bg-blue-900';

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'red' ? 'text-white/80' : 'text-blue-100'}`}>{label}</span>
      <div className="flex gap-2 items-center">
        <div className={`${bgColor} text-white px-3 py-1.5 rounded-sm font-black text-sm shadow-xl border border-white/10`}>{timeLeft.h}</div>
        <span className={`font-black ${theme === 'red' ? 'text-white' : 'text-blue-900'}`}>:</span>
        <div className={`${bgColor} text-white px-3 py-1.5 rounded-sm font-black text-sm shadow-xl border border-white/10`}>{timeLeft.m}</div>
        <span className={`font-black ${theme === 'red' ? 'text-white' : 'text-blue-900'}`}>:</span>
        <div className={`${bgColor} text-white px-3 py-1.5 rounded-sm font-black text-sm shadow-xl border border-white/10`}>{timeLeft.s}</div>
      </div>
    </div>
  );
};

type FlashSalesProps = {
  initialProducts?: Product[];
};

const FlashSales: React.FC<FlashSalesProps> = ({ initialProducts = [] }) => {
  const { products, addToCart } = useApp();
  const sourceProducts = products.length > 0 ? products : initialProducts;
  const now = new Date();

  const activeFlashSales = useMemo(() => {
    return sourceProducts.filter(p => 
      !p.isHidden &&
      p.flashSalePrice && 
      p.flashSaleEnd && 
      new Date(p.flashSaleEnd) > now &&
      (!p.flashSaleStart || new Date(p.flashSaleStart) <= now)
    );
  }, [sourceProducts]);

  const upcomingFlashSales = useMemo(() => {
    return sourceProducts.filter(p => 
      !p.isHidden &&
      p.flashSalePrice && 
      p.flashSaleStart && 
      new Date(p.flashSaleStart) > now
    );
  }, [sourceProducts]);

  const maskPrice = (price: number) => {
    const s = price.toLocaleString('vi-VN');
    if (s.length < 3) return s;
    return s.charAt(0) + "??" + s.substring(3);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative bg-slate-900 rounded-sm p-8 md:p-16 overflow-hidden shadow-2xl border-b-4 border-[#ee4d2d]">
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
           <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-bolt-lightning text-yellow-300 text-3xl md:text-5xl animate-pulse"></i>
                <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase">FLASH SALES</h1>
              </div>
           </div>
           {activeFlashSales.length > 0 && (
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-sm border border-white/10 shadow-2xl">
                <FlashSaleCountdown targetTime={activeFlashSales[0].flashSaleEnd!} label="KẾT THÚC SAU" theme="red" />
             </div>
           )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3 italic">
             <span className="w-2 h-8 bg-[#ee4d2d]"></span> ĐANG DIỄN RA
          </h2>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {activeFlashSales.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-sm border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Chưa có deal nào đang mở</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {activeFlashSales.map(product => {
              const pPrice = product.flashSalePrice!;
              const hasDiscount = product.originalPrice && product.originalPrice > pPrice;
              const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - pPrice) / product.originalPrice!) * 100) : 0;
              
              return (
                <div key={product.id} className={`group bg-white border border-transparent hover:border-[#ee4d2d] hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden rounded-sm shadow-sm ${product.isOutOfStock ? 'grayscale-[0.4]' : ''}`}>
                  <Link href={`/product/${createSlug(product.name, product.id)}`} className="block relative aspect-square overflow-hidden bg-white">
                    <SmartImage src={product.images[0]} widthHint={480} heightHint={480} fit="fit" sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw" className="w-full h-full object-contain p-2 group-hover:scale-105 transition-all duration-700" alt={product.name} />
                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                      <div className="bg-[#ee4d2d] text-white text-[9px] font-black px-1.5 py-0.5 uppercase italic">LIVE NOW</div>
                      <div className="bg-yellow-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5">-{discountPercent}%</div>
                    </div>
                  </Link>

                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{product.brand}</div>
                      <h3 className="text-[13px] font-bold text-slate-700 line-clamp-2 leading-tight h-10 group-hover:text-[#ee4d2d] transition-colors">{product.name}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg font-black text-[#ee4d2d]">₫{pPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button 
                      disabled={product.isOutOfStock}
                      onClick={(e) => { e.preventDefault(); addToCart(product); }} 
                      className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${product.isOutOfStock ? 'bg-slate-300' : 'bg-slate-900 text-white hover:bg-[#ee4d2d]'}`}
                    >
                      {product.isOutOfStock ? 'HẾT HÀNG' : 'MUA NGAY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {upcomingFlashSales.length > 0 && (
        <div className="space-y-8 bg-blue-50/50 p-6 md:p-10 rounded-sm border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-lg md:text-2xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-3 italic">
                 <span className="w-2 h-8 bg-blue-600"></span> SẮP DIỄN RA
            </h2>
            <FlashSaleCountdown targetTime={upcomingFlashSales[0].flashSaleStart!} label="SẼ MỞ BÁN SAU" theme="blue" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pt-6">
            {upcomingFlashSales.map(product => (
              <div key={product.id} className="group bg-white border border-blue-100 transition-all duration-500 flex flex-col h-full relative overflow-hidden rounded-sm shadow-sm grayscale-[0.5] hover:grayscale-0">
                <div className="block relative aspect-square overflow-hidden bg-white">
                  <SmartImage src={product.images[0]} widthHint={480} heightHint={480} fit="fit" sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <h3 className="text-[13px] font-bold text-slate-600 line-clamp-2 h-10">{product.name}</h3>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Giá Flash Sale Dự Kiến:</span>
                    <span className="text-lg font-black text-blue-600 italic">₫{maskPrice(product.flashSalePrice!)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSales;
