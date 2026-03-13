
'use client';

import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import Link from 'next/link';
import { createSlug } from '../utils/seo';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`text-[8px] ${rating >= star ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-slate-200'}`}></i>
      ))}
      <span className="text-[9px] text-slate-400 font-bold ml-1">{rating}</span>
    </div>
  );
};

const ShockSales: React.FC = () => {
  const { products, addToCart, wishlist, toggleWishlist } = useApp();
  
  const shockSaleProducts = useMemo(() => {
    return products
      .filter(p => !p.isHidden && p.isShockSale && p.shockSalePrice)
      .sort((a, b) => (a.isOutOfStock ? 1 : 0) - (b.isOutOfStock ? 1 : 0));
  }, [products]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-sm p-8 md:p-16 overflow-hidden shadow-2xl border-b-4 border-yellow-400 text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase">XẢ HÀNG <span className="text-yellow-400">SIÊU SỐC</span></h1>
      </div>

      <div className="space-y-8">
        {shockSaleProducts.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-sm border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Hiện tại chưa có chương trình xả hàng</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {shockSaleProducts.map(product => {
              const sPrice = product.shockSalePrice!;
              const hasDiscount = product.originalPrice && product.originalPrice > sPrice;
              const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - sPrice) / product.originalPrice!) * 100) : 0;
              
              return (
                <div key={product.id} className="group bg-white border-2 border-transparent hover:border-purple-600 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden rounded-sm shadow-sm">
                  <Link href={`/product/${createSlug(product.name, product.id)}`} className="block relative aspect-square overflow-hidden bg-white">
                    <img src={product.images[0]} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                      <div className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 uppercase italic">XẢ KHO</div>
                      <div className="bg-yellow-400 text-purple-900 text-[10px] font-black px-2 py-0.5">-{discountPercent}%</div>
                    </div>
                  </Link>

                  <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-700 line-clamp-2 leading-tight h-10 group-hover:text-purple-600 transition-colors">{product.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xl font-black text-purple-600">₫{sPrice.toLocaleString()}</span>
                      <StarRating rating={product.rating} />
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button 
                      disabled={product.isOutOfStock}
                      onClick={(e) => { e.preventDefault(); addToCart(product); }} 
                      className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${product.isOutOfStock ? 'bg-slate-200' : 'bg-slate-900 text-white hover:bg-purple-600'}`}
                    >
                      {product.isOutOfStock ? 'HẾT HÀNG' : 'SĂN NGAY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShockSales;