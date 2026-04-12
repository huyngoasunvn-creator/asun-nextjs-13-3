
'use client';

import React from 'react';
import { useApp } from '../store/AppContext';
import Link from 'next/link';
import { Product } from '../types';
import { createSlug } from '../utils/seo';
import SmartImage from './SmartImage';

type PromotionsProps = {
  initialProducts?: Product[];
};

const Promotions: React.FC<PromotionsProps> = ({ initialProducts = [] }) => {
  const { products } = useApp();
  const sourceProducts = products.length > 0 ? products : initialProducts;
  const now = new Date();
  
  const isGiftActive = (p: Product) => {
    if (!p.giftName) return false;
    if (p.giftStartDate && new Date(p.giftStartDate) > now) return false;
    if (p.giftEndDate && new Date(p.giftEndDate) < now) return false;
    return true;
  };

  const isBuyXGetYActive = (p: Product) => {
    if (!p.promoBuyQty || !p.promoGetQty) return false;
    if (p.promoStartDate && new Date(p.promoStartDate) > now) return false;
    if (p.promoEndDate && new Date(p.promoEndDate) < now) return false;
    return true;
  };

  const promoProducts = sourceProducts.filter(p => !p.isHidden && (isGiftActive(p) || isBuyXGetYActive(p)) && !p.isOutOfStock);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative h-[180px] md:h-[300px] rounded-sm overflow-hidden bg-slate-800 shadow-2xl">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">Đặc Quyền <span className="text-pink-500">Ưu Đãi</span></h1>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center justify-center gap-2">
             <i className="fa-solid fa-gift text-pink-600"></i> Siêu Ưu Đãi Đang Diễn Ra
        </h2>

        {promoProducts.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-sm border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-bold uppercase text-xs">Hiện chưa có chương trình mới</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {promoProducts.map(product => {
              const buyXGetY = isBuyXGetYActive(product);
              return (
                <Link key={product.id} href={`/product/${createSlug(product.name, product.id)}`} className="group relative bg-white border border-slate-100 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="p-4 bg-white flex-grow">
                    <h3 className={`text-sm font-black italic uppercase tracking-tighter ${buyXGetY ? 'text-blue-600' : 'text-pink-600'}`}>
                      {buyXGetY ? `Mua ${product.promoBuyQty} Tặng ${product.promoGetQty}` : product.giftName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <SmartImage src={product.images[0]} widthHint={80} heightHint={80} sizes="40px" className="w-10 h-10 object-cover rounded-sm border" alt={product.name} />
                        <span className="text-xs font-bold text-slate-700 truncate">{product.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
