'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Category } from '../types';
import AuthModal from './AuthModal';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { 
    cart, wishlist, searchQuery, setSearchQuery, 
    recentSearches, addRecentSearch, notifications, markNotificationAsRead, clearNotifications,
    setActiveCategory, setSelectedBrand, appConfig, products, customMenus, visibleCategories
  } = useApp();
  
  const { user, isAdmin, logout } = useAuth();
  
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileCats, setShowMobileCats] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileCatRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const hasShockSales = products.some(p => p.isShockSale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(event.target as Node)) {
        setShowNotifPanel(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileCatRef.current && !mobileCatRef.current.contains(event.target as Node)) {
        setShowMobileCats(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) addRecentSearch(searchQuery);
    if (pathname !== '/') router.push('/');
  };

  const resetHome = () => {
    setActiveCategory('Tất cả');
    setSelectedBrand(null);
    setSearchQuery('');
    router.push('/');
  };

  const getCategoryIcon = (category: string) => {
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

  const BrandLogo = () => {
    if (appConfig.logoUrl) {
      return (
        <div className="h-10 md:h-14 flex items-center relative z-10">
          <img src={appConfig.logoUrl} className="h-full object-contain" style={{
              transform: `translate(${appConfig.logoX || 0}px, ${appConfig.logoY || 0}px) scale(${appConfig.logoScale || 1})`,
              transformOrigin: 'center center',
              maxWidth: 'none'
            }} alt="App Logo" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 group">
        <div className="bg-white text-[#ee4d2d] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl shadow-lg">
          <i className="fa-solid fa-bolt-lightning text-xl md:text-2xl"></i>
        </div>
        <div className="flex flex-col -space-y-1.5 text-white text-left">
           <span className="text-lg md:text-2xl font-black tracking-tighter italic uppercase leading-none">Asun<span className="text-yellow-300"> Việt Nam</span></span>
           <span className="text-[7px] md:text-[8px] font-black tracking-[0.3em] opacity-80 uppercase">Hệ Thống Điện Máy Cao Cấp</span>
        </div>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-xl">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* 1. TOP BAR */}
      <div className="bg-[#ee4d2d] text-white py-1.5 md:py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] md:text-[11px] font-medium uppercase tracking-wider">
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center gap-1.5 font-bold">
              <a href={appConfig.appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">Tải ứng dụng</a>
              <span className="opacity-50 mx-0.5">|</span>
              <span>Kết nối</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-facebook cursor-pointer hover:text-white transition-colors"></i>
              <i className="fa-brands fa-instagram cursor-pointer hover:text-white transition-colors"></i>
            </div>
          </div>
          <div className="flex-1 md:flex-none flex gap-3 md:gap-5 items-center justify-between md:justify-end">
            <div className="flex gap-3 md:gap-5 items-center">
              {/* MOBILE ONLY: NÚT TẢI APP KHUYẾN KHÍCH */}
              <a 
                href={appConfig.appStoreUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="md:hidden flex items-center gap-1 bg-yellow-400 text-slate-900 px-2.5 py-1 rounded-full font-black text-[9px] animate-pulse shadow-lg border border-yellow-500"
              >
                <i className="fa-solid fa-mobile-screen-button"></i> TẢI APP NHẬN QUÀ
              </a>

              <div className="relative" ref={notifPanelRef}>
                <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity relative">
                  <i className={`fa-regular fa-bell ${unreadCount > 0 ? 'animate-bounce' : ''}`}></i> Thông báo
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1.5 bg-yellow-400 text-slate-900 text-[8px] font-black w-3 h-3 flex items-center justify-center rounded-full border border-[#ee4d2d]">{unreadCount}</span>}
                </button>
                {showNotifPanel && (
                  <div className="fixed md:absolute top-20 md:top-full inset-x-4 md:inset-x-auto md:right-0 mt-3 md:w-80 bg-white shadow-2xl rounded-sm border overflow-hidden text-slate-800 z-[260] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400">Thông báo mới</span>
                      <button onClick={clearNotifications} className="text-[9px] font-black text-[#ee4d2d] uppercase hover:underline">Xóa tất cả</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? <div className="p-10 text-center space-y-2 opacity-40"><i className="fa-solid fa-bell-slash text-2xl"></i><p className="text-[10px] font-bold uppercase">Không có thông báo</p></div> : notifications.map(n => (<div key={n.id} onClick={() => {markNotificationAsRead(n.id); router.push(n.link); setShowNotifPanel(false);}} className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-b last:border-none ${!n.isRead ? 'bg-orange-50/50' : ''}`}>{n.image ? <img src={n.image} className="w-12 h-12 object-cover rounded-sm" /> : <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-tag"></i></div>}<div className="space-y-1"><h4 className="text-xs font-black leading-tight">{n.title}</h4><p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p></div></div>))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nút Hỗ trợ đã được xóa và thay thế bằng logic Tải App trên mobile */}
            </div>
            
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 font-black uppercase hover:opacity-80 transition-opacity">
                   <div className="w-5 h-5 rounded-full bg-white text-[#ee4d2d] flex items-center justify-center text-[10px]">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                   </div>
                   <span className="max-w-[80px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
                </button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1.5 font-black uppercase hover:text-yellow-300 transition-colors">
                  <i className="fa-regular fa-user"></i> {pathname === '/checkout' ? 'Đăng nhập' : 'Đăng nhập / Đăng ký'}
                </button>
              )}

              {showUserMenu && user && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white shadow-2xl rounded-sm border overflow-hidden text-slate-800 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b bg-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Tài khoản của</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{user.displayName || user.email}</p>
                  </div>
                  <div className="py-2">
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase text-[#ee4d2d] hover:bg-slate-50">
                        <i className="fa-solid fa-user-shield"></i> Trang Quản trị
                      </Link>
                    )}
                    <Link href="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50">
                      <i className="fa-solid fa-box-open"></i> Đơn hàng của tôi
                    </Link>
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 border-t mt-2">
                      <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#ee4d2d] text-white py-3 md:pt-4 md:pb-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-12">
          <Link href="/" onClick={resetHome} className="shrink-0 hidden md:block">
            <BrandLogo />
          </Link>

          <div className="flex-1 max-w-3xl flex items-center gap-2">
            <div className="md:hidden relative shrink-0" ref={mobileCatRef}>
              <button 
                onClick={() => setShowMobileCats(!showMobileCats)}
                className={`w-10 h-10 flex items-center justify-center rounded-sm border-2 transition-all ${showMobileCats ? 'bg-white text-[#ee4d2d] border-white' : 'bg-transparent text-white border-white/20 active:scale-95'}`}
              >
                <i className="fa-solid fa-bars text-lg"></i>
              </button>
              {showMobileCats && (
                <div className="absolute top-full left-0 mt-4 w-64 bg-white shadow-2xl rounded-sm border overflow-hidden text-slate-800 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Danh mục ngành hàng</span>
                    <i className="fa-solid fa-chevron-down text-[8px] animate-bounce"></i>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {Object.values(Category)
                      .filter(cat => visibleCategories.includes(cat))
                      .map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => { setActiveCategory(cat); setSelectedBrand(null); setShowMobileCats(false); if(pathname !== '/') router.push('/'); }}
                          className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50 border-b last:border-none transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#ee4d2d] shrink-0 border border-slate-100">
                            <i className={`fa-solid ${getCategoryIcon(cat)} text-sm`}></i>
                          </div>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{cat}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-white rounded-sm p-0.5 md:p-1 shadow-inner border-2 border-transparent focus-within:border-yellow-400">
              <div className="relative flex-1 flex items-center">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Bạn muốn mua gì hôm nay?..." className="w-full pl-3 md:pl-4 pr-10 py-1.5 md:py-2.5 bg-transparent text-slate-800 font-medium focus:outline-none text-base md:text-sm placeholder:text-slate-400" />
                {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2 text-slate-300 hover:text-[#ee4d2d] p-1"><i className="fa-solid fa-circle-xmark text-sm"></i></button>}
              </div>
              <button type="submit" className="bg-[#ee4d2d] px-4 md:px-6 py-1.5 md:py-2.5 rounded-sm transition-all shadow-md shrink-0"><i className="fa-solid fa-magnifying-glass text-white font-bold text-xs md:text-base"></i></button>
            </form>
          </div>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link href="/wishlist" className="relative p-2 group text-white"><i className="fa-solid fa-heart text-2xl md:text-3xl group-hover:scale-110 transition-transform"></i>{wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-[#ee4d2d] shadow-lg">{wishlistCount}</span>}</Link>
            <button onClick={onCartClick} className="relative p-2 group text-white"><i className="fa-solid fa-cart-shopping text-2xl md:text-3xl group-hover:scale-110 transition-transform"></i>{cartCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-[#ee4d2d] shadow-lg">{cartCount}</span>}</button>
          </div>
        </div>
      </div>

      <div className="bg-[#ee4d2d] text-white border-t border-white/10 block overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-10 md:h-12 flex-nowrap whitespace-nowrap">
          <Link href="/" onClick={resetHome} className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-black/5 shrink-0 ${pathname === '/' && !searchQuery ? 'underline decoration-2 underline-offset-4' : ''}`}>TRANG CHỦ</Link>
          <Link href="/flash-sales" className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-black/5 flex items-center gap-1.5 md:gap-2 shrink-0 ${pathname === '/flash-sales' ? 'underline decoration-2 underline-offset-4' : ''}`}><i className="fa-solid fa-bolt-lightning text-yellow-300"></i> FLASH SALE</Link>
          <Link href="/promotions" className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-black/5 flex items-center gap-1.5 md:gap-2 shrink-0 ${pathname === '/promotions' ? 'underline decoration-2 underline-offset-4' : ''}`}><i className="fa-solid fa-gift text-yellow-300"></i> KHUYẾN MÃI</Link>
          <Link href="/blog" className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-black/5 flex items-center gap-1.5 md:gap-2 shrink-0 ${pathname.startsWith('/blog') ? 'underline decoration-2 underline-offset-4' : ''}`}><i className="fa-solid fa-newspaper text-yellow-300"></i> TIN TỨC</Link>
          
          {customMenus.filter(m => m.isActive).map(menu => (
            <Link 
              key={menu.id} 
              href={`/p/${menu.slug}`} 
              className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-black/5 shrink-0 ${pathname === `/p/${menu.slug}` ? 'underline decoration-2 underline-offset-4' : ''}`}
            >
              {menu.title}
            </Link>
          ))}

          {hasShockSales && <Link href="/shock-sales" className={`h-full flex items-center px-4 md:px-6 text-[10px] md:text-sm font-black uppercase italic tracking-tighter transition-all hover:bg-purple-900 flex items-center gap-1.5 md:gap-2 shrink-0 ${pathname === '/shock-sales' ? 'bg-purple-800' : ''}`}><i className="fa-solid fa-bolt-lightning text-yellow-400"></i> XẢ HÀNG</Link>}
        </div>
      </div>
      
      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around h-16 pb-1 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)]">
        <button onClick={resetHome} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/' ? 'text-[#ee4d2d]' : 'text-slate-400'}`}><i className="fa-solid fa-house text-lg"></i><span className="text-[9px] font-bold uppercase">Trang chủ</span></button>
        <button onClick={() => router.push('/blog')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname.startsWith('/blog') ? 'text-[#ee4d2d]' : 'text-slate-400'}`}><i className="fa-solid fa-newspaper text-lg"></i><span className="text-[9px] font-bold uppercase">Tin tức</span></button>
        <button onClick={() => router.push('/wishlist')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/wishlist' ? 'text-[#ee4d2d]' : 'text-slate-400'}`}><i className="fa-solid fa-heart text-lg"></i><span className="text-[9px] font-bold uppercase">Yêu thích</span></button>
        <button onClick={() => router.push('/orders')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/orders' ? 'text-[#ee4d2d]' : 'text-slate-400'}`}><i className="fa-solid fa-receipt text-lg"></i><span className="text-[9px] font-bold uppercase">Đơn hàng</span></button>
        {user ? (
          <button onClick={() => setShowUserMenu(true)} className="flex flex-col items-center justify-center w-full h-full gap-1 text-[#ee4d2d]"><div className="w-5 h-5 rounded-full bg-[#ee4d2d] text-white flex items-center justify-center text-[10px] font-bold">{user.displayName ? user.displayName.charAt(0) : 'U'}</div><span className="text-[9px] font-bold uppercase">Tôi</span></button>
        ) : (
          <button onClick={() => setIsAuthModalOpen(true)} className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400"><i className="fa-solid fa-user text-lg"></i><span className="text-[9px] font-bold uppercase">Đăng nhập</span></button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
