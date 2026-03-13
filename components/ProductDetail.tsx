'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../store/AppContext';
import { Product, Commitment } from '../types';
import { createSlug, getIdFromSlug } from '../utils/seo';

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

const ProductDetail: React.FC<{ initialProduct: Product }> = ({ initialProduct }) => {
  
  const params = useParams();
  const slug = params?.slug as string;
  
  const id = getIdFromSlug(slug);
  const router = useRouter();
  const { products, addToCart, wishlist, toggleWishlist, commitments, setSelectedBrand, setActiveCategory, setSearchQuery, setAlertProduct, reviews } = useApp();
  
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageOverride, setLightboxImageOverride] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'video' | 'reviews'>('desc');
  
  const REVIEWS_PER_PAGE = 5;
  const [reviewPage, setReviewPage] = useState(1);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  const descRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const product = initialProduct || products.find(p => p.id === id) || null;
  const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang chủ",
      item: "https://asun.vn"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Sản phẩm",
      item: "https://asun.vn/product"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: product?.name || "",
      item: `https://asun.vn/product/${slug}`
    }
  ]
};

  // --- LOGIC SEO & STRUCTURED DATA ---
  const now = useMemo(() => new Date(), []);
  
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    const isFlashSale = product.flashSalePrice && product.flashSaleEnd && new Date(product.flashSaleEnd) > now && (!product.flashSaleStart || new Date(product.flashSaleStart) <= now);
    if (product.isShockSale && product.shockSalePrice) return product.shockSalePrice;
    if (isFlashSale) return product.flashSalePrice!;
    return product.price;
  }, [product, now]);

  const seoTitle = useMemo(() => 
    product?.seoTitle || `${product?.name} - ${product?.brand} chính hãng | Asun.vn`, 
  [product]);

  const seoDesc = useMemo(() => 
    product?.seoDescription || `Mua ${product?.name} tại Asun.vn. Giá cực tốt: ${currentPrice.toLocaleString()}đ. Bảo hành ${product?.warrantyMonths} tháng, cam kết chính hãng 100%.`,
  [product, currentPrice]);

  const schemaData = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description.replace(/<[^>]*>?/gm, '').substring(0, 200),
      "brand": { "@type": "Brand", "name": product.brand },
      "sku": product.id,
      "mpn": product.id,
      "offers": {
        "@type": "Offer",
        "url": typeof window !== "undefined" ? window.location.href : "",
        "priceCurrency": "VND",
        "price": currentPrice,
        "priceValidUntil": "2026-12-31",
        "availability": product.isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": reviews.filter(r => r.productId === product.id).length || 1
      }
    };
  }, [product, reviews, currentPrice]);

  // --- LOGIC EFFECT GỐC ---
  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setIsDescExpanded(false);
      const initial: Record<string, string> = {};
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
          if (v.options.length > 0) initial[v.label] = v.options[0];
        });
      }
      setSelectedVariants(initial);
    }
  }, [product]);

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeThumb = container.children[selectedImageIdx] as HTMLElement;
      if (activeThumb) {
        const scrollLeft = activeThumb.offsetLeft - (container.offsetWidth / 2) + (activeThumb.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedImageIdx]);

  useEffect(() => {
    if (descRef.current && activeTab === 'desc') {
      if (descRef.current.scrollHeight > 450) setShowSeeMore(true);
      else setShowSeeMore(false);
    }
  }, [product?.description, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxImageOverride(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImageIdx]);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!product) return;
    if (lightboxImageOverride) return; 
    setSelectedImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!product) return;
    if (lightboxImageOverride) return;
    setSelectedImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === id);
  }, [reviews, id]);

  const ratingStats = useMemo(() => {
    const stats = [0, 0, 0, 0, 0];
    productReviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) stats[r.rating - 1]++;
    });
    return stats.reverse();
  }, [productReviews]);

  const filteredReviews = useMemo(() => {
    let res = [...productReviews];
    if (selectedTagFilter) {
      res = res.filter(r => r.tags?.includes(selectedTagFilter));
    }
    return res;
  }, [productReviews, selectedTagFilter]);

  const paginatedReviews = useMemo(() => {
    return filteredReviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
  }, [filteredReviews, reviewPage]);

  if (!product) return <div className="text-center py-20 font-bold uppercase text-slate-400 italic">Sản phẩm không tồn tại</div>;

  const isInWishlist = wishlist.includes(product.id);
  const giftProduct = product.promoGiftProductId ? products.find(p => p.id === product.promoGiftProductId) : null;
  
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

  const buyXGetY = isBuyXGetYActive(product);
  const giftActive = isGiftActive(product);

  const handleBrandClick = (brandName: string) => {
    setActiveCategory('Tất cả');
    setSearchQuery('');
    setSelectedBrand(brandName);
    router.push('/');
  };

  const handleCategoryClick = (category: any) => {
    setSelectedBrand(null);
    setSearchQuery('');
    setActiveCategory(category);
    router.push('/');
  };

  const handleVariantSelect = (label: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [label]: option }));
  };

  const openGiftLightbox = (imageUrl: string) => {
    setLightboxImageOverride(imageUrl);
    setIsLightboxOpen(true);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0].split('/')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }
    } catch (e) {}
    return url;
  };

  const allVideoUrls = useMemo(() => {
    const urls = product.videoUrls ? [...product.videoUrls] : [];
    if (product.videoUrl && !urls.includes(product.videoUrl)) {
      urls.unshift(product.videoUrl);
    }
    return urls.map(url => getEmbedUrl(url)).filter(url => url !== '');
  }, [product.videoUrls, product.videoUrl]);

  return (
    <>
  {schemaData && (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  )}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(breadcrumbSchema)
    }}
  />

  
    <div className="max-w-7xl mx-auto space-y-6 pb-24 px-4 md:px-0">
      <nav className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 py-4 border-b border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/" onClick={() => {setSelectedBrand(null); setActiveCategory('Tất cả'); setSearchQuery('');}} className="hover:text-[#ee4d2d] transition-colors">Trang chủ</Link>
        <i className="fa-solid fa-chevron-right text-[8px] opacity-50"></i>
        <span onClick={() => handleCategoryClick(product.category)} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">{product.category}</span>
        <i className="fa-solid fa-chevron-right text-[8px] opacity-50"></i>
        <span onClick={() => handleBrandClick(product.brand)} className="hover:text-[#ee4d2d] cursor-pointer transition-colors">{product.brand}</span>
        <i className="fa-solid fa-chevron-right text-[8px] opacity-50"></i>
        <span className="text-slate-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
      </nav>

      <div className="bg-white p-4 md:p-8 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-5 gap-8 border">
        <div className="md:col-span-2 space-y-4">
          <div 
            className="group relative aspect-square rounded-sm overflow-hidden border bg-slate-50 flex items-center justify-center cursor-zoom-in" 
            onClick={() => setIsLightboxOpen(true)}
          >
            <img src={product.images[selectedImageIdx]} className={`max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${product.isOutOfStock ? 'grayscale opacity-50' : ''}`} alt={product.name} />
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white"><i className="fa-solid fa-chevron-left"></i></button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white"><i className="fa-solid fa-chevron-right"></i></button>
              </>
            )}
            {product.isOutOfStock && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="bg-slate-900/90 text-white text-xs md:text-sm font-black px-6 py-3 uppercase tracking-[0.3em] italic shadow-2xl transform -rotate-12 border-2 border-white/20">HẾT HÀNG</span></div>}
          </div>
          <div className="relative group/thumbs-area">
            <div ref={thumbnailContainerRef} className="flex gap-2 overflow-x-auto pb-4 thumbnail-slider-custom snap-x scroll-smooth">
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setSelectedImageIdx(i)} className={`w-16 h-16 md:w-24 md:h-24 shrink-0 border cursor-pointer overflow-hidden transition-all snap-start rounded-sm relative ${selectedImageIdx === i ? 'border-[#ee4d2d] ring-2 ring-[#ee4d2d]/20 p-0.5 shadow-md z-10 scale-95' : 'border-slate-100 opacity-60 hover:opacity-100'}`}><img src={img} className={`w-full h-full object-cover ${product.isOutOfStock ? 'grayscale' : ''}`} alt={product.name} /></div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-3 space-y-6">
           <div className="flex items-center flex-wrap gap-3">
              {product.isShockSale ? <span className="px-2 py-1 bg-purple-600 text-white text-[9px] font-black rounded-sm uppercase tracking-tighter">XẢ KHO SIÊU SỐC</span> : <span className="px-2 py-1 bg-[#ee4d2d] text-white text-[9px] font-black rounded-sm uppercase tracking-tighter">YÊU THÍCH</span>}
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thương hiệu: <button onClick={() => handleBrandClick(product.brand)} className="text-[#ee4d2d] hover:underline font-black">{product.brand}</button></span>
              
              {!product.hideWarranty && (
                <span className={`px-2 py-1 text-[9px] font-black rounded-sm uppercase tracking-tighter border flex items-center gap-1 ${product.warrantyMonths > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                   <i className={`fa-solid ${product.warrantyMonths > 0 ? 'fa-shield-check' : 'fa-shield-xmark'}`}></i> 
                   {product.warrantyMonths > 0 ? `Bảo hành ${product.warrantyMonths} tháng` : 'Sản phẩm không bảo hành'}
                </span>
              )}
              {product.isFreeship && (
                <span className="px-2 py-1 text-[9px] font-black rounded-sm uppercase tracking-tighter border flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-100">
                   <i className="fa-solid fa-truck-fast"></i> 
                   Miễn phí vận chuyển
                </span>
              )}
           </div>
           <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{product.name}</h1>
           <div className="flex items-baseline gap-4 py-4 border-y border-slate-50">
              <div className={`text-3xl md:text-4xl font-black ${product.isOutOfStock ? 'text-slate-400' : (product.isShockSale ? 'text-purple-600' : 'text-[#ee4d2d]')}`}>₫{currentPrice.toLocaleString()}</div>
              {product.originalPrice && (product.originalPrice > currentPrice) && <div className="text-slate-400 line-through text-lg font-medium opacity-60">₫{product.originalPrice.toLocaleString()}</div>}
           </div>
           <div className="pb-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <StarRating rating={product.rating} />
                 <span className="text-[10px] text-slate-400 font-black uppercase">({productReviews.length} Đánh giá)</span>
              </div>
           </div>

           {(giftActive || buyXGetY) && !product.isOutOfStock && (
             <div className="p-4 bg-pink-50 border border-pink-100 rounded-sm space-y-3 animate-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-2 text-pink-600">
                   <i className="fa-solid fa-gift"></i>
                   <span className="text-xs font-black uppercase italic tracking-tighter">Ưu đãi đặc biệt từ Asun</span>
                </div>
                <div className="space-y-2">
                   {buyXGetY && (
                     <div className="flex items-center gap-3 bg-white p-2.5 rounded-sm border border-pink-100 shadow-sm group" onClick={() => openGiftLightbox(giftProduct ? giftProduct.images[0] : (product.promoGiftImage || ''))}>
                        <div className="w-10 h-10 bg-pink-50 rounded-sm flex items-center justify-center shrink-0 border border-pink-50 overflow-hidden cursor-zoom-in">
                           {giftProduct ? <img src={giftProduct.images[0]} className="w-full h-full object-cover" alt="gift" /> : product.promoGiftImage ? <img src={product.promoGiftImage} className="w-full h-full object-cover" alt="gift" /> : <i className="fa-solid fa-boxes-stacked text-pink-400 text-sm"></i>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">CHƯƠNG TRÌNH MUA {product.promoBuyQty} TẶNG {product.promoGetQty}</p>
                           <p className="text-[10px] text-pink-600 font-bold italic truncate">Quà tặng: {giftProduct?.name || product.promoGiftName || product.name}</p>
                        </div>
                     </div>
                   )}
                   {giftActive && (
                     <div className="flex items-center gap-3 bg-white p-2.5 rounded-sm border border-pink-100 shadow-sm" onClick={() => openGiftLightbox(product.giftImage || '')}>
                        <div className="w-10 h-10 bg-pink-50 rounded-sm flex items-center justify-center shrink-0 border border-pink-50 overflow-hidden cursor-zoom-in">
                           {product.giftImage ? <img src={product.giftImage} className="w-full h-full object-cover" alt="gift" /> : <i className="fa-solid fa-gift text-pink-400 text-sm"></i>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">QUÀ TẶNG KÈM TRỰC TIẾP</p>
                           <p className="text-[10px] text-pink-600 font-bold italic truncate">{product.giftName}</p>
                        </div>
                     </div>
                   )}
                </div>
                {(product.promoEndDate || product.giftEndDate) && (
                   <p className="text-[9px] text-slate-400 font-bold uppercase italic text-right">
                      * Áp dụng đến hết {new Date(product.promoEndDate || product.giftEndDate || '').toLocaleDateString('vi-VN')}
                   </p>
                )}
             </div>
           )}

           {product.variants && product.variants.length > 0 && (
             <div className="space-y-4 py-2">{product.variants.map((v, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.label}</label>
                    <div className="flex flex-wrap gap-2">{v.options.map(opt => (<button key={opt} onClick={() => handleVariantSelect(v.label, opt)} className={`px-4 py-2 border rounded-sm text-xs font-bold transition-all ${selectedVariants[v.label] === opt ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d] shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>{opt}</button>))}</div>
                  </div>
                ))}</div>
           )}
           <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <div className="flex flex-1 gap-2">
               {product.isOutOfStock ? (
                 <button onClick={() => setAlertProduct(product)} className="flex-1 py-4 border-2 border-blue-600 text-blue-600 font-black uppercase text-xs tracking-widest transition-all shadow-sm bg-blue-50 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2">
                   <i className="fa-solid fa-bell"></i> Báo khi có hàng
                 </button>
               ) : (
                 <button onClick={() => addToCart(product, selectedVariants)} className={`flex-1 py-4 border-2 font-black uppercase text-xs tracking-widest transition-all shadow-sm ${product.isShockSale ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white' : 'border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white'}`}>
                   Thêm Giỏ Hàng
                 </button>
               )}
               <button onClick={() => toggleWishlist(product.id)} className={`px-6 border-2 transition-all shadow-sm ${isInWishlist ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white' : 'border-slate-200 text-slate-400 hover:border-[#ee4d2d] hover:text-[#ee4d2d]'}`}>
                 <i className={`fa-heart ${isInWishlist ? 'fa-solid' : 'fa-regular'} text-xl`}></i>
               </button>
             </div>
             {!product.isOutOfStock && (
               <button onClick={() => { addToCart(product, selectedVariants); router.push('/checkout'); }} className={`flex-1 py-4 font-black uppercase text-xs tracking-widest shadow-xl transition-all text-white active:scale-95 ${product.isShockSale ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#ee4d2d] hover:bg-[#d73211]'}`}>
                 Mua Ngay
               </button>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col">
              <div className="flex border-b overflow-x-auto no-scrollbar bg-slate-50">
                 <button 
                  onClick={() => setActiveTab('desc')}
                  className={`flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'desc' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    MÔ TẢ CHI TIẾT
                    {activeTab === 'desc' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"></div>}
                 </button>
                 {allVideoUrls.length > 0 && (
                   <button 
                    onClick={() => setActiveTab('video')}
                    className={`flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'video' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                      VIDEO THỰC TẾ ({allVideoUrls.length})
                      {activeTab === 'video' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"></div>}
                   </button>
                 )}
                 <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    ĐÁNH GIÁ ({productReviews.length})
                    {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"></div>}
                 </button>
              </div>

              <div className="p-4 md:p-8 min-h-[400px]">
                 {activeTab === 'desc' && (
                    <div className="animate-in fade-in duration-500 relative">
                       <h2 className="sr-only">Thông tin chi tiết {product.name}</h2>
                       <div ref={descRef} className={`text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line prose max-w-none transition-all duration-500 overflow-hidden relative rich-text-display ${!isDescExpanded && showSeeMore ? 'max-h-[450px]' : 'max-h-none'}`} dangerouslySetInnerHTML={{ __html: product.description || "Nội dung sản phẩm đang được cập nhật..." }}></div>
                       {showSeeMore && (
                          <div className={`mt-4 flex justify-center pt-6 ${!isDescExpanded ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-4' : 'border-t border-slate-50'}`}>
                             <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="flex items-center gap-2 px-8 py-2.5 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95">
                                {isDescExpanded ? 'THU GỌN' : 'XEM THÊM'}
                             </button>
                          </div>
                       )}
                    </div>
                 )}

                 {activeTab === 'video' && allVideoUrls.length > 0 && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                       {allVideoUrls.map((url, index) => (
                         <div key={index} className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 italic">Clip giới thiệu #{index + 1}</h4>
                            <div className="aspect-video w-full rounded-sm overflow-hidden bg-slate-900 shadow-md border border-slate-100">
                               <iframe 
                                  src={url} 
                                  className="w-full h-full" 
                                  title={`Video review ${product.name} part ${index+1}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen
                               ></iframe>
                            </div>
                         </div>
                       ))}
                    </div>
                 )}

                 {activeTab === 'reviews' && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-50">
                          <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-sm border">
                             <span className="text-5xl font-black text-[#ee4d2d]">{product.rating}</span>
                             <div className="my-2"><StarRating rating={product.rating} /></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase">{productReviews.length} đánh giá thực tế</span>
                          </div>
                          <div className="md:col-span-2 space-y-2">
                             {ratingStats.map((count, i) => {
                               const star = 5 - i;
                               const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                               return (
                                 <div key={star} className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-500 w-4">{star}</span>
                                    <i className="fa-solid fa-star text-[8px] text-yellow-400"></i>
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 w-8">{percentage.toFixed(0)}%</span>
                                 </div>
                               );
                             })}
                          </div>
                       </div>
                       
                       <div className="space-y-8">
                          {paginatedReviews.length === 0 ? (
                            <div className="py-12 text-center opacity-40">
                               <i className="fa-solid fa-comments text-4xl mb-4"></i>
                               <p className="text-[10px] font-black uppercase">Chưa có đánh giá nào {selectedTagFilter ? 'với từ khóa này' : ''}</p>
                            </div>
                          ) : (
                            <div className="space-y-8">
                              {paginatedReviews.map(review => (
                                <div key={review.id} className="space-y-4 animate-in fade-in duration-500 pb-8 border-b last:border-none">
                                   <div className="flex justify-between items-start">
                                      <div className="flex gap-3">
                                         <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black">{review.userName.charAt(0)}</div>
                                         <div>
                                            <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-2">{review.userName} <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] rounded-sm flex items-center gap-1 border border-emerald-100"><i className="fa-solid fa-circle-check"></i> Đã mua hàng</span></h4>
                                            <div className="mt-1 flex items-center gap-2">
                                              <StarRating rating={review.rating} />
                                              {review.tags?.map(t => (
                                                <span key={t} className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-1 rounded-sm">{t}</span>
                                              ))}
                                            </div>
                                         </div>
                                      </div>
                                      <span className="text-[9px] text-slate-300 font-bold uppercase">
                                         {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                      </span>
                                   </div>
                                   <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment || 'Khách hàng không để lại nội dung.'}"</p>
                                </div>
                              ))}
                            </div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 border rounded-sm shadow-sm">
            <h2 className="text-lg font-black uppercase italic border-b pb-5 tracking-tighter mb-6 flex items-center gap-3 text-slate-800">
               <i className="fa-solid fa-gears text-[#ee4d2d]"></i> THÔNG SỐ KỸ THUẬT
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thương hiệu</span>
                <span className="text-xs font-black text-slate-700 uppercase">{product.brand}</span>
              </div>
              {product.specs && product.specs.length > 0 ? (
                product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-none">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-0.5">{spec.label}</span>
                    <span className="text-xs font-bold text-slate-600 text-right max-w-[60%]">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">Đang cập nhật...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => { setIsLightboxOpen(false); setLightboxImageOverride(null); }}>
          <button className="absolute top-6 right-6 text-white text-4xl hover:text-[#ee4d2d] transition-colors"><i className="fa-solid fa-xmark"></i></button>
          {!lightboxImageOverride && product.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white hover:bg-[#ee4d2d] transition-all flex items-center justify-center shadow-lg"><i className="fa-solid fa-chevron-left text-2xl"></i></button>
              <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white hover:bg-[#ee4d2d] transition-all flex items-center justify-center shadow-lg"><i className="fa-solid fa-chevron-right text-2xl"></i></button>
            </>
          )}
          <img src={lightboxImageOverride || product.images[selectedImageIdx]} className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-500 shadow-2xl rounded-sm" onClick={e => e.stopPropagation()} alt="Zoomed view" />
        </div>
      )}
    </div>
    </>
  );
};

export default ProductDetail;
