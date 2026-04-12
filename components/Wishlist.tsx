
'use client';

import React from 'react';
import { useApp } from '../store/AppContext';
import Link from 'next/link';
import { createSlug } from '../utils/seo';
import SmartImage from './SmartImage';

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

const Wishlist: React.FC = () => {
  const { products, wishlist, toggleWishlist, addToCart } = useApp();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-3 bg-white p-6 rounded-sm shadow-sm border">
        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Sản phẩm yêu thích</h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-sm border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Danh sách yêu thích đang trống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="group bg-white border border-slate-100 hover:border-[#ee4d2d] hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden rounded-sm">
                <Link href={`/product/${createSlug(product.name, product.id)}`} className="block relative aspect-square overflow-hidden bg-white">
                  <SmartImage src={product.images[0]} widthHint={480} heightHint={480} fit="fit" sizes="(max-width: 768px) 50vw, 20vw" className="w-full h-full object-contain p-2 group-hover:scale-105 transition-all duration-700" alt={product.name} />
                </Link>
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 line-clamp-2 leading-tight h-10 group-hover:text-[#ee4d2d] transition-colors">{product.name}</h3>
                  <div className="space-y-1">
                    <span className="text-sm font-black text-[#ee4d2d]">₫{product.price.toLocaleString()}</span>
                    <StarRating rating={product.rating} />
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
