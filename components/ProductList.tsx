'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Category, Product, Banner, Coupon } from '../types';
import Link from 'next/link';
import { createSlug } from '../utils/seo';

type SortOption = 'relevance' | 'newest' | 'topSales' | 'priceAsc' | 'priceDesc' | 'featured' | 'topRated';

const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const FlashSaleCountdown: React.FC<{ endTime: string }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(endTime).getTime() - new Date().getTime();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        h: Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0'),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  return (
    <div className="flex gap-1.5 items-center">
      <div className="bg-slate-900 text-white px-2 py-1 rounded-sm font-black text-xs shadow-md border border-white/10">{timeLeft.h}</div>
      <span className="font-black text-slate-900">:</span>
      <div className="bg-slate-900 text-white px-2 py-1 rounded-sm font-black text-xs shadow-md border border-white/10">{timeLeft.m}</div>
      <span className="font-black text-slate-900">:</span>
      <div className="bg-slate-900 text-white px-2 py-1 rounded-sm font-black text-xs shadow-md border border-white/10">{timeLeft.s}</div>
    </div>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <i 
          key={star} 
          className={`text-[8px] ${
            rating >= star 
              ? 'fa-solid fa-star text-yellow-400' 
              : (rating > star - 1 
                  ? 'fa-solid fa-star-half-stroke text-yellow-400' 
                  : 'fa-regular fa-star text-slate-200')
          }`}
        ></i>
      ))}
      <span className="text-[9px] text-slate-400 font-bold ml-1">{rating}</span>
    </div>
  );
};

const CouponIncentive: React.FC<{ product: Product, coupons: Coupon[] }> = ({ product, coupons }) => {
  const now = new Date();
  const bestCoupon = useMemo(() => {
    const applicable = coupons.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      if (c.scope === 'all') return true;
      if (c.scope === 'category' && c.applicableCategories?.includes(product.category)) return true;
      if (c.scope === 'product' && c.productId === product.id) return true;
      return false;
    });
    return applicable.sort((a, b) => {
      if (a.type === 'freeship' && b.type !== 'freeship') return -1;
      if (b.type === 'freeship' && a.type !== 'freeship') return 1;
      return b.value - a.value;
    })[0];
  }, [coupons, product]);

  if (!bestCoupon) return null;
  const diff = bestCoupon.minOrder - product.price;
  const isFreeship = bestCoupon.type === 'freeship';

  if (diff > 0) {
    return (
      <div className="mt-1 flex items-center gap-1 animate-pulse">
        <i className={`fa-solid ${isFreeship ? 'fa-truck-fast text-blue-500' : 'fa-circle-info text-orange-500'} text-[8px]`}></i>
        <span className={`text-[8px] font-bold uppercase italic leading-none ${isFreeship ? 'text-blue-600' : 'text-orange-600'}`}>
          Mua thêm ₫{diff.toLocaleString()} để {isFreeship ? 'FREE SHIP' : 'GIẢM GIÁ'}
        </span>
      </div>
    );
  }
  return (
    <div className="mt-1 flex items-center gap-1">
      <i className="fa-solid fa-circle-check text-emerald-500 text-[8px]"></i>
      <span className="text-[8px] font-black uppercase italic leading-none text-emerald-600">
        Đủ ĐK {isFreeship ? 'FREE SHIP' : 'GIẢM GIÁ'}
      </span>
    </div>
  );
};

const ProductList: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
  const { 
    products, addToCart, wishlist, toggleWishlist, banners, searchQuery, 
    activeCategory, setActiveCategory, selectedBrand, setSelectedBrand, 
    commitments, visibleCategories, brands, categoryConfigs, categoryThemes,
    setAlertProduct, coupons, saveCouponToUser, userSavedCouponCodes
  } = useApp();
  const { user } = useAuth();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCommitment, setActiveCommitment] = useState<{title: string, content: string} | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const mainBanners = banners.filter(b => b.isActive && b.position === 'main');
  const sideBanners = banners.filter(b => b.isActive && b.position === 'side').slice(0, 2);
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

  const hasAnyPromo = (p: Product) => isGiftActive(p) || isBuyXGetYActive(p);

  const flashSaleProducts = useMemo(() => {
    return products.filter(p => 
      !p.isHidden && p.flashSalePrice && p.flashSaleEnd && new Date(p.flashSaleEnd) > now && (!p.flashSaleStart || new Date(p.flashSaleStart) <= now)
    ).sort((a, b) => (a.isOutOfStock ? 1 : 0) - (b.isOutOfStock ? 1 : 0));
  }, [products, now]);

  const promoProducts = useMemo(() => {
    return products.filter(p => !p.isHidden && hasAnyPromo(p) && !p.isOutOfStock).slice(0, 15);
  }, [products, now]);

  const activeCoupons = useMemo(() => {
    return coupons.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      return true;
    }).slice(0, 10);
  }, [coupons, now]);

  useEffect(() => {
    if (mainBanners.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % mainBanners.length), 5000);
    return () => clearInterval(timer);
  }, [mainBanners.length]);

  const getCategoryIcon = (category: Category | 'Tất cả') => {
    switch(category) {
      case Category.SMARTPHONES: return 'fa-mobile-screen';
      case Category.LAPTOPS: return 'fa-laptop';
      case Category.AUDIO: return 'fa-headphones';
      case Category.HOME_APPLIANCES: return 'fa-kitchen-set';
      case Category.WEARABLES: return 'fa-clock';
      case Category.WATER_PURIFIER: return 'fa-droplet';
      case Category.ELECTRONICS: return 'fa-tv';
      case Category.GROCERY: return 'fa-layer-group';
      case Category.FASHION: return 'fa-shirt';
      case Category.BEAUTY: return 'fa-heart-pulse';
      case Category.TOYS: return 'fa-puzzle-piece';
      case Category.HOME_LIFE: return 'fa-couch';
      case Category.OTHERS: return 'fa-box-open';
      default: return 'fa-layer-group';
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const normalizedQuery = removeAccents(searchQuery);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    let result = products.filter(p => {
      if (p.isHidden) return false;
      const normalizedPName = removeAccents(p.name);
      const normalizedPBrand = removeAccents(p.brand);
      const normalizedPCat = removeAccents(p.category);
      const matchesSearch = queryWords.length === 0 || queryWords.every(word => normalizedPName.includes(word) || normalizedPBrand.includes(word) || normalizedPCat.includes(word));
      const matchesCategory = activeCategory === 'Tất cả' || p.category === activeCategory;
      const matchesBrand = !selectedBrand || p.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
    result.sort((a, b) => {
      if (a.isOutOfStock !== b.isOutOfStock) return a.isOutOfStock ? 1 : -1;
      const getPrice = (p: Product) => {
        const isFS = p.flashSalePrice && p.flashSaleEnd && new Date(p.flashSaleEnd) > now && (!p.flashSaleStart || new Date(p.flashSaleStart) <= now);
        if (p.isShockSale && p.shockSalePrice) return p.shockSalePrice;
        return isFS ? p.flashSalePrice! : p.price;
      };
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'topSales': return b.soldCount - a.soldCount;
        case 'topRated': return b.rating - a.rating;
        case 'featured': return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case 'priceAsc': return getPrice(a) - getPrice(b);
        case 'priceDesc': return getPrice(b) - getPrice(a);
        default: return 0;
      }
    });
    return result;
  }, [products, searchQuery, activeCategory, selectedBrand, sortBy, now]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, selectedBrand, searchQuery, sortBy]);

  const handleCategorySwitch = (cat: Category) => {
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollectCoupon = async (coupon: Coupon) => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu mã ưu đãi!");
      return;
    }
    await saveCouponToUser(coupon);
  };

  const sortedVisibleCategories = useMemo(() => {
    return [...categoryConfigs].sort((a, b) => a.order - b.order).filter(conf => visibleCategories.includes(conf.category));
  }, [categoryConfigs, visibleCategories]);

  const activeTheme = useMemo(() => {
    if (activeCategory === 'Tất cả') return null;
    return categoryThemes.find(t => t.category === activeCategory);
  }, [categoryThemes, activeCategory]);

  return (
    <div className="space-y-3 md:space-y-5 mt-2">
      {!searchQuery && !selectedBrand && activeCategory === 'Tất cả' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          <div className="md:col-span-2 relative h-[200px] md:h-[380px] rounded-sm overflow-hidden shadow-sm bg-slate-100">
            {mainBanners.map((banner, index) => (
              <div key={banner.id} className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                <img src={banner.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center p-6 md:p-12 text-white">
                  <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 uppercase italic tracking-tighter leading-tight max-w-md drop-shadow-2xl">{banner.title}</h2>
                  <Link href={banner.link} className="bg-white text-[#ee4d2d] px-6 md:px-8 py-2.5 md:py-3.5 rounded-sm font-black w-fit uppercase text-[10px] md:text-xs tracking-widest shadow-2xl hover:scale-105 transition-transform">{banner.buttonText}</Link>
                </div>
              </div>
            ))}
            {mainBanners.length > 1 && (
              <div className="absolute bottom-4 left-6 flex gap-2 z-20">
                {mainBanners.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-3'}`} />
                ))}
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-2 md:gap-3 h-[380px]">
            {sideBanners.map((b) => (
              <Link key={b.id} href={b.link} className="flex-1 rounded-sm overflow-hidden relative border shadow-sm group">
                <img src={b.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-black text-xs uppercase italic leading-tight drop-shadow-lg">{b.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && !selectedBrand && activeCategory !== 'Tất cả' && activeTheme && (
        <div className="relative h-[120px] md:h-[240px] rounded-sm overflow-hidden shadow-md border-b-4 border-[#ee4d2d] animate-in slide-in-from-top duration-500">
           <img src={activeTheme.image} className="w-full h-full object-cover" alt={activeCategory} />
           <div className={`absolute inset-0 bg-gradient-to-r ${activeTheme.color} to-transparent opacity-80`}></div>
           <div className="absolute inset-0 flex items-center px-6 md:px-12">
              <div className="space-y-1 md:space-y-2 max-w-2xl text-white">
                 <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                       <i className={`fa-solid ${getCategoryIcon(activeCategory)} text-lg md:text-2xl text-white`}></i>
                    </div>
                    <div>
                       <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Ngành hàng</span>
                       <h1 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">{activeCategory}</h1>
                    </div>
                 </div>
                 <p className="text-[8px] md:text-base font-bold uppercase tracking-tight text-white/90 italic">{activeTheme.slogan}</p>
              </div>
           </div>
        </div>
      )}

      {!searchQuery && !selectedBrand && activeCoupons.length > 0 && (
        <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100 group/voucher">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
             <h2 className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <span className="w-1 h-3.5 bg-[#ee4d2d]"></span> TRUNG TÂM MÃ GIẢM GIÁ
             </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 snap-x scroll-smooth">
             {activeCoupons.map(coupon => {
               const isFreeship = coupon.type === 'freeship';
               const isSaved = userSavedCouponCodes.includes(coupon.code);
               return (
                 <div key={coupon.id} className={`min-w-[210px] md:min-w-[240px] h-[85px] md:h-[95px] bg-white border border-dashed rounded-sm flex items-center relative overflow-hidden snap-start shadow-sm hover:shadow-md transition-shadow group ${isFreeship ? 'border-emerald-300' : 'border-[#ee4d2d]/30'}`}>
                    <div className={`w-20 md:w-24 h-full border-r border-dashed flex flex-col items-center justify-center p-2 ${isFreeship ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-[#ee4d2d]/20'}`}>
                       {isFreeship ? (
                         <div className="text-emerald-600 flex flex-col items-center">
                           <i className={`fa-solid fa-truck-fast text-xl mb-1`}></i>
                           <span className="text-[9px] font-black uppercase">FREESHIP</span>
                         </div>
                       ) : (
                         <div className="text-[#ee4d2d] font-black text-base md:text-lg leading-none">
                           {coupon.type === 'percent' ? `${coupon.value}%` : `₫${coupon.value >= 1000 ? (coupon.value/1000) + 'k' : coupon.value}`}
                         </div>
                       )}
                    </div>
                    <div className="flex-1 h-full p-2 md:p-2.5 flex flex-col justify-between">
                       <div>
                          <div className="flex items-center gap-1">
                            <i className={`fa-solid ${isFreeship ? 'fa-truck-fast text-emerald-500' : 'fa-tag text-[#ee4d2d]'} text-[8px]`}></i>
                            <h4 className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase leading-tight truncate">Mã: {coupon.code}</h4>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 mt-1 uppercase">Đơn từ ₫{coupon.minOrder.toLocaleString()}</p>
                       </div>
                       <button 
                          onClick={() => handleCollectCoupon(coupon)}
                          className={`w-full py-1 rounded-sm text-[8px] md:text-[9px] font-black uppercase transition-all ${isSaved ? 'bg-slate-100 text-slate-400' : (isFreeship ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#ee4d2d] text-white hover:bg-black shadow-sm')} active:scale-95`}
                       >
                          {isSaved ? (<><i className="fa-solid fa-check mr-1"></i> ĐÃ LƯU</>) : (isFreeship ? 'LƯU FREESHIP' : 'LƯU MÃ')}
                       </button>
                    </div>
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-slate-100"></div>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-slate-100"></div>
                 </div>
               );
             })}
          </div>
        </div>
      )}

      {!searchQuery && !selectedBrand && activeCategory === 'Tất cả' && (
        <div className="bg-white py-6 md:py-8 border-y border-slate-100 shadow-sm px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
            {commitments.map((c) => (
              <div key={c.id} onClick={() => setActiveCommitment({title: c.title, content: c.detail})} className="flex items-center gap-4 group px-2 md:border-r border-slate-100 last:border-none cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 group-hover:bg-blue-600 transition-all shadow-sm">
                  <i className={`fa-solid ${c.icon} text-xl text-blue-600 group-hover:text-white transition-colors`}></i>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-blue-900 font-black text-[13px] uppercase leading-tight tracking-tight">{c.title}</h4>
                  <p className="text-[10px] text-blue-700 font-bold opacity-60 uppercase leading-normal">{c.desc}</p>
                  <div className="text-[9px] text-[#ee4d2d] font-black uppercase tracking-widest mt-1 flex items-center gap-1 hover:opacity-80 transition-all">
                    XEM CHI TIẾT <i className="fa-solid fa-chevron-right text-[7px]"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && (
        <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100 relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
            <h2 className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <span className="w-1 h-3.5 bg-[#ee4d2d]"></span> KHÁM PHÁ NGÀNH HÀNG
            </h2>
          </div>
          <div className="flex items-start gap-2 md:gap-5 overflow-x-auto custom-scrollbar pt-1 pb-2 px-1 snap-x">
            <button onClick={() => setActiveCategory('Tất cả')} className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none w-[60px] md:w-[75px] snap-start">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${activeCategory === 'Tất cả' ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md scale-105' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-[#ee4d2d]/40'}`}>
                <i className="fa-solid fa-layer-group text-base md:text-lg"></i>
              </div>
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center leading-tight transition-colors ${activeCategory === 'Tất cả' ? 'text-[#ee4d2d]' : 'text-slate-400 group-hover:text-[#ee4d2d]'}`}>TẤT CẢ</span>
            </button>
            {sortedVisibleCategories.map(conf => (
              <button key={conf.category} onClick={() => setActiveCategory(conf.category)} className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none w-[60px] md:w-[75px] snap-start">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${activeCategory === conf.category ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md scale-105' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-[#ee4d2d]/40'}`}>
                  <i className={`fa-solid ${getCategoryIcon(conf.category)} text-base md:text-lg`}></i>
                </div>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center leading-tight min-h-[2em] transition-colors ${activeCategory === conf.category ? 'text-[#ee4d2d]' : 'text-slate-400 group-hover:text-[#ee4d2d]'}`}>{conf.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && activeCategory === 'Tất cả' && brands.length > 0 && (
        <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100 relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
             <h2 className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <span className="w-1 h-3.5 bg-[#ee4d2d]"></span> THƯƠNG HIỆU CHÍNH HÃNG
             </h2>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pt-1 pb-3 px-1 snap-x scroll-smooth">
            <button 
              onClick={() => setSelectedBrand(null)} 
              className={`shrink-0 flex flex-col items-center gap-2 snap-start transition-all group ${!selectedBrand ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${!selectedBrand ? 'border-[#ee4d2d] bg-orange-50 shadow-md' : 'border-slate-100 bg-white'}`}>
                <i className="fa-solid fa-tags text-lg text-slate-300"></i>
              </div>
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center transition-colors ${!selectedBrand ? 'text-[#ee4d2d]' : 'text-slate-400'}`}>TẤT CẢ</span>
            </button>
            {brands.map(brand => (
              <button 
                key={brand.id} 
                onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                className={`shrink-0 flex items-center flex-col gap-2 snap-start transition-all group ${selectedBrand === brand.name ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden p-1 shadow-sm ${selectedBrand === brand.name ? 'border-[#ee4d2d] bg-white shadow-md' : 'border-slate-100 bg-white'}`}>
                  <img src={brand.logoUrl} className="w-full h-full object-contain" alt={brand.name} />
                </div>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center transition-colors ${selectedBrand === brand.name ? 'text-[#ee4d2d]' : 'text-slate-400'}`}>{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && !selectedBrand && flashSaleProducts.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-bolt-lightning text-[#ee4d2d] text-xl md:text-2xl animate-pulse"></i>
                <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-[#ee4d2d]">FLASH SALE</span>
              </div>
              <FlashSaleCountdown endTime={flashSaleProducts[0].flashSaleEnd!} />
            </div>
            <Link href="/flash-sales" className="text-[10px] font-black text-[#ee4d2d] uppercase flex items-center gap-1 hover:underline">Xem thêm <i className="fa-solid fa-chevron-right text-[8px]"></i></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 snap-x">
            {flashSaleProducts.map(p => (
              <Link key={p.id} href={`/product/${createSlug(p.name, p.id)}`} className={`w-[140px] md:w-[180px] shrink-0 bg-slate-50 p-2.5 rounded-sm flex flex-col items-center group relative border border-transparent hover:border-[#ee4d2d] transition-all snap-start ${p.isOutOfStock ? 'opacity-70' : ''}`}>
                <div className="aspect-square w-full rounded-sm overflow-hidden mb-2 relative bg-white border">
                  <img src={p.images[0]} className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-1 left-1 bg-yellow-400 text-slate-900 text-[8px] font-black px-1 rounded-sm shadow-sm">-{Math.round(((p.originalPrice! - p.flashSalePrice!) / p.originalPrice!) * 100)}%</div>
                  {p.isFreeship && <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[7px] font-black px-1 py-0.5 rounded-sm shadow-sm z-10"><i className="fa-solid fa-truck-fast"></i></div>}
                </div>
                <div className="text-[10px] font-bold text-slate-700 line-clamp-1 mb-0.5">{p.name}</div>
                <div className="text-xs md:text-sm font-black text-[#ee4d2d]">₫{p.flashSalePrice?.toLocaleString()}</div>
                <CouponIncentive product={p} coupons={coupons} />
                <div className="w-full h-2.5 bg-slate-200 rounded-full mt-2 overflow-hidden relative shadow-inner">
                   <div className={`${p.isOutOfStock ? 'bg-slate-400' : 'bg-gradient-to-r from-orange-500 to-[#ee4d2d]'} h-full`} style={{ width: p.isOutOfStock ? '100%' : '80%' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && !selectedBrand && promoProducts.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-gift text-lg text-pink-600"></i>
              <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-slate-800">SĂN QUÀ TẶNG</h2>
            </div>
            <Link href="/promotions" className="text-[10px] font-black text-pink-600 uppercase flex items-center gap-1 hover:underline">Tất cả <i className="fa-solid fa-chevron-right text-[8px]"></i></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 snap-x">
            {promoProducts.map(p => {
              const buyXGetY = isBuyXGetYActive(p);
              const giftProd = p.promoGiftProductId ? products.find(prod => prod.id === p.promoGiftProductId) : null;
              return (
                <Link key={p.id} href={`/product/${createSlug(p.name, p.id)}`} className="w-[150px] md:w-[200px] shrink-0 bg-white p-2.5 rounded-sm flex flex-col group relative border border-slate-100 hover:border-pink-500 hover:shadow-lg transition-all snap-start">
                  <div className="aspect-square w-full rounded-sm overflow-hidden mb-2 relative bg-slate-50 border border-slate-50">
                    <img src={p.images[0]} className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-1 left-1 bg-pink-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-md italic">FREE GIFT</div>
                    {p.isFreeship && <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-md italic z-10">FREESHIP</div>}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-1 flex items-center gap-1.5 border-t border-pink-100">
                      <div className="w-5 h-5 bg-pink-50 rounded-sm border border-pink-100 flex items-center justify-center shrink-0">
                         {giftProd ? <img src={giftProd.images[0]} className="w-full h-full object-cover" /> : p.promoGiftImage ? <img src={p.promoGiftImage} className="w-full h-full object-cover" /> : <i className="fa-solid fa-gift text-pink-500 text-[8px]"></i>}
                      </div>
                      <span className="text-[7px] md:text-[8px] font-black text-pink-600 uppercase italic line-clamp-1">{buyXGetY ? `Mua ${p.promoBuyQty} Tặng ${p.promoGetQty}` : 'Tặng: ' + p.giftName}</span>
                    </div>
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-700 line-clamp-2 leading-tight h-8 mb-1.5 group-hover:text-pink-600 transition-colors">{p.name}</h3>
                  <div className="flex flex-col gap-1 mt-auto">
                    <span className="text-xs font-black text-[#ee4d2d]">₫{p.price.toLocaleString()}</span>
                    <CouponIncentive product={p} coupons={coupons} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
           <div className="flex items-center gap-2 md:gap-3 overflow-x-auto custom-scrollbar w-full md:w-auto pb-2 md:pb-0 snap-x">
              {[{ id: 'featured', label: 'Gợi ý' }, { id: 'newest', label: 'Mới nhất' }, { id: 'topRated', label: 'Yêu thích' }, { id: 'topSales', label: 'Bán chạy' }].map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => setSortBy(opt.id as any)} 
                  className={`px-3 md:px-5 py-2 rounded-sm text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap shadow-sm border snap-start ${sortBy === opt.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                >
                  {opt.label}
                </button>
              ))}
              <select 
                value={sortBy.includes('price') ? sortBy : ''} 
                onChange={(e) => setSortBy(e.target.value as any)} 
                className={`px-3 md:px-5 py-2 rounded-sm text-[9px] md:text-[10px] font-black uppercase transition-all shadow-sm border outline-none snap-start shrink-0 ${sortBy.includes('price') ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-slate-600 border-slate-100'}`}
              >
                <option value="" disabled>Giá</option>
                <option value="priceAsc">Thấp - Cao</option>
                <option value="priceDesc">Cao - Thấp</option>
              </select>
           </div>
           
           {(searchQuery || activeCategory !== 'Tất cả') && (
             <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto custom-scrollbar no-scrollbar py-1">
                <button onClick={() => setSelectedBrand(null)} className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all ${!selectedBrand ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>TẤT CẢ HÃNG</button>
                {brands.map(brand => (
                  <button key={brand.id} onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${selectedBrand === brand.name ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d]' : 'border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-black uppercase">{brand.name}</span>
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="min-h-[600px]">
        {paginatedProducts.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-sm border border-dashed border-slate-200">
            <i className="fa-solid fa-magnifying-glass text-4xl text-slate-100 mb-3"></i>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {paginatedProducts.map(product => {
                const isFS = product.flashSalePrice && product.flashSaleEnd && new Date(product.flashSaleEnd) > now && (!product.flashSaleStart || new Date(product.flashSaleStart) <= now);
                let pPrice = product.isShockSale && product.shockSalePrice ? product.shockSalePrice : (isFS ? product.flashSalePrice! : product.price);
                const hasDiscount = product.originalPrice && product.originalPrice > pPrice;
                const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - pPrice) / product.originalPrice!) * 100) : 0;
                const isInWishlist = wishlist.includes(product.id);
                const giftActive = hasAnyPromo(product);
                return (
                  <div key={product.id} className="group bg-white border border-transparent hover:border-[#ee4d2d] hover:shadow-xl transition-all duration-500 flex flex-col h-full relative overflow-hidden rounded-sm shadow-sm">
                    <Link href={`/product/${createSlug(product.name, product.id)}`} className="block relative aspect-square overflow-hidden bg-white">
                      <img src={product.images[0]} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                        <div className="flex flex-wrap gap-1">
                          {product.isShockSale ? <div className="bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase italic rounded-sm shadow-sm">XẢ KHO</div> : <div className="bg-[#ee4d2d] text-white text-[8px] font-black px-1.5 py-0.5 uppercase italic rounded-sm shadow-sm">YÊU THÍCH</div>}
                          {product.isFreeship && <div className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase italic rounded-sm shadow-sm flex items-center gap-1"><i className="fa-solid fa-truck-fast text-[7px]"></i> FREESHIP</div>}
                          {giftActive && !product.isOutOfStock && <div className="bg-[#e33a89] text-white text-[8px] font-black px-1.5 py-0.5 uppercase italic rounded-sm shadow-sm flex items-center gap-1"><i className="fa-solid fa-gift text-[7px]"></i> CÓ QUÀ</div>}
                        </div>
                        {hasDiscount && <div className="bg-yellow-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 w-fit rounded-sm shadow-sm">-{discountPercent}%</div>}
                      </div>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-1.5 right-1.5 z-30 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center transition-all"><i className={`fa-heart text-sm ${isInWishlist ? 'fa-solid text-[#ee4d2d]' : 'fa-regular text-slate-400'}`}></i></button>
                    </Link>
                    <div className="p-2.5 md:p-3 flex-grow flex flex-col justify-between space-y-1.5">
                      <div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{product.brand}</div>
                        <h3 className="text-[12px] font-bold text-slate-700 line-clamp-2 leading-tight h-8 group-hover:text-[#ee4d2d] transition-colors">{product.name}</h3>
                      </div>
                      <div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] md:text-[14px] font-black text-[#ee4d2d]">₫{pPrice.toLocaleString()}</span>
                          <CouponIncentive product={product} coupons={coupons} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <StarRating rating={product.rating} />
                          <span className="text-[9px] text-slate-400 font-bold">Bán {product.soldCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 pb-3">
                      {product.isOutOfStock ? <button onClick={(e) => { e.preventDefault(); setAlertProduct(product); }} className="w-full py-1.5 bg-blue-50 border border-blue-500 text-blue-600 text-[9px] font-black uppercase transition-all">BÁO HÀNG</button> : <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="w-full py-1.5 border border-[#ee4d2d] text-[#ee4d2d] text-[9px] font-black uppercase hover:bg-[#ee4d2d] hover:text-white transition-all">GIỎ HÀNG</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 py-6 border-t border-slate-100">
                <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); }} className="w-8 h-8 flex items-center justify-center rounded-sm bg-white border border-slate-200 text-slate-600 disabled:opacity-30"><i className="fa-solid fa-chevron-left text-[10px]"></i></button>
                {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => { setCurrentPage(i + 1); }} className={`w-8 h-8 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all ${currentPage === i + 1 ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>))}
                <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); }} className="w-8 h-8 flex items-center justify-center rounded-sm bg-white border border-slate-200 text-slate-600 disabled:opacity-30"><i className="fa-solid fa-chevron-right text-[10px]"></i></button>
              </div>
            )}
          </div>
        )}
      </div>

      {!searchQuery && !selectedBrand && activeCategory === 'Tất cả' && (
        <div className="space-y-8 py-4">
          {sortedVisibleCategories.map(conf => {
            const cat = conf.category;
            const catProducts = products
  .filter(p => !p.isHidden && p.category === cat)
  .slice(0, isMobile ? 6 : 5);
            if (catProducts.length === 0) return null;
            const theme = categoryThemes.find(t => t.category === cat) || { image: '', color: 'from-slate-600', slogan: 'Khám phá ngay', accentClass: 'text-slate-800', bgClass: 'bg-slate-50' };
            return (
              <div key={cat} className="space-y-3 animate-in fade-in duration-1000">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${theme.bgClass} flex items-center justify-center border border-slate-100 shadow-sm`}><i className={`fa-solid ${getCategoryIcon(cat)} text-lg ${theme.accentClass}`}></i></div>
                    <div><h3 className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-slate-800">{cat}</h3></div>
                  </div>
                  <button onClick={() => handleCategorySwitch(cat)} className={`text-[9px] md:text-[10px] font-black uppercase flex items-center gap-1 hover:underline ${theme.accentClass}`}>XEM TẤT CẢ <i className="fa-solid fa-chevron-right text-[7px]"></i></button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {catProducts.map(product => {
                    const isFS = product.flashSalePrice && product.flashSaleEnd && new Date(product.flashSaleEnd) > now && (!product.flashSaleStart || new Date(product.flashSaleStart) <= now);
                    let pPrice = product.isShockSale && product.shockSalePrice ? product.shockSalePrice : (isFS ? product.flashSalePrice! : product.price);
                    const giftActive = hasAnyPromo(product);
                    return (
                      <Link key={product.id} href={`/product/${createSlug(product.name, product.id)}`} className="group bg-white border border-slate-100 p-2.5 rounded-sm hover:shadow-lg transition-all duration-300 relative flex flex-col">
                         <div className="aspect-square w-full rounded-sm overflow-hidden mb-2 bg-slate-50 border border-slate-50 relative">
                           <img src={product.images[0]} className="w-full h-full object-contain p-1 group-hover:scale-105" />
                           <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
                              {product.isFreeship && <div className="bg-emerald-600 text-white text-[7px] font-black px-1 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm flex items-center gap-1"><i className="fa-solid fa-truck-fast text-[6px]"></i> FREESHIP</div>}
                              {giftActive && !product.isOutOfStock && <div className="bg-[#e33a89] text-white text-[7px] font-black px-1 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm flex items-center gap-1"><i className="fa-solid fa-gift text-[6px]"></i> CÓ QUÀ</div>}
                           </div>
                         </div>
                         <h4 className="text-[10px] md:text-[11px] font-bold text-slate-700 line-clamp-2 leading-tight h-8 mb-1.5 group-hover:text-[#ee4d2d] transition-colors">{product.name}</h4>
                         <div className="mt-auto flex flex-col gap-1">
                            <span className="text-[13px] font-black text-[#ee4d2d]">₫{pPrice.toLocaleString()}</span>
                            <CouponIncentive product={product} coupons={coupons} />
                            <div className="mt-1">
                              <StarRating rating={product.rating} />
                            </div>
                         </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeCommitment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setActiveCommitment(null)}>
           <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="p-5 md:p-6 bg-[#ee4d2d] text-white flex justify-between items-center shrink-0 shadow-lg"><div className="flex items-center gap-3"><div className="w-1 h-6 bg-yellow-400"></div><h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">{activeCommitment.title}</h3></div><button onClick={() => setActiveCommitment(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"><i className="fa-solid fa-xmark text-2xl"></i></button></div>
              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1 bg-white"><div className="rich-text-content text-slate-700 leading-relaxed prose prose-slate prose-lg max-w-none prose-p:my-4 prose-li:my-2 prose-strong:text-slate-900 prose-strong:font-black" dangerouslySetInnerHTML={{ __html: activeCommitment.content }}></div></div>
              <div className="p-6 bg-slate-50 border-t shrink-0 flex justify-center"><button onClick={() => setActiveCommitment(null)} className="px-12 py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-xl active:scale-95">TÔI ĐÃ HIỂU VÀ ĐỒNG Ý</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
