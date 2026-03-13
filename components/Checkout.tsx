'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { InvoiceData, Coupon, Product } from '../types';

const Checkout: React.FC = () => {
  const { cart, products, placeOrder, coupons, appConfig, userSavedCouponCodes } = useApp();
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });
  
  const [requestInvoice, setRequestInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'personal' | 'company'>('personal');
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({
    name: '',
    address: '',
    email: '',
    taxCode: '',
    note: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountCoupon, setAppliedDiscountCoupon] = useState<Coupon | null>(null);
  const [appliedFreeshipCoupon, setAppliedFreeshipCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedItems = cart.filter(item => item.selected);
  const subTotal = selectedItems.reduce((acc, item) => {
    const isFlashSale = item.flashSalePrice && item.flashSaleEnd && new Date(item.flashSaleEnd) > new Date();
    let price = item.price;
    if (item.isShockSale && item.shockSalePrice) price = item.shockSalePrice;
    else if (isFlashSale) price = item.flashSalePrice!;
    return acc + (price * item.quantity);
  }, 0);

  const hasNonFreeship = selectedItems.some(item => !item.isFreeship);
  const baseShippingFee = hasNonFreeship ? 28000 : 0;

  // Kiểm tra Voucher có phù hợp với danh sách sản phẩm hiện tại không
  const isCouponRelevant = (c: Coupon) => {
    if (c.scope === 'all') return true;
    if (c.scope === 'category' && c.applicableCategories) {
      return selectedItems.some(item => c.applicableCategories?.includes(item.category));
    }
    if (c.scope === 'product' && c.productId) {
      return selectedItems.some(item => item.id === c.productId);
    }
    return false;
  };

  // Danh sách Voucher KHẢ DỤNG (Đủ điều kiện áp dụng ngay)
  const availableVouchers = useMemo(() => {
    const now = new Date();
    return coupons.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      if (subTotal < c.minOrder) return false;
      return isCouponRelevant(c);
    }).sort((a, b) => {
      const scoreA = (a.type === 'freeship' ? 100 : 0) + (userSavedCouponCodes.includes(a.code) ? 50 : 0);
      const scoreB = (b.type === 'freeship' ? 100 : 0) + (userSavedCouponCodes.includes(b.code) ? 50 : 0);
      return scoreB - scoreA;
    });
  }, [coupons, subTotal, selectedItems, userSavedCouponCodes]);

  // Danh sách Voucher NHẮC NHỞ (Hợp lệ về sản phẩm nhưng chưa đủ tiền)
  const upcomingVouchers = useMemo(() => {
    const now = new Date();
    return coupons.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      
      // Chỉ nhắc nhở nếu: 1. Chưa đủ tiền, 2. Sản phẩm phù hợp, 3. Cần mua thêm < 60% giá trị voucher
      const isPriceClose = subTotal < c.minOrder && subTotal >= c.minOrder * 0.4;
      return isPriceClose && isCouponRelevant(c);
    }).sort((a, b) => a.minOrder - b.minOrder).slice(0, 2);
  }, [coupons, subTotal, selectedItems]);

  const handleApplyCoupon = (codeOrCoupon: string | Coupon) => {
    setCouponError('');
    let coupon: Coupon | undefined;
    
    if (typeof codeOrCoupon === 'string') {
      const targetCode = codeOrCoupon.trim().toUpperCase();
      coupon = coupons.find(c => c.code.toUpperCase() === targetCode);
    } else {
      coupon = codeOrCoupon;
    }
    
    if (!coupon || !coupon.isActive) {
      setCouponError('Mã ưu đãi không khả dụng.');
      return;
    }

    if (!isCouponRelevant(coupon)) {
      setCouponError('Mã này không áp dụng cho các sản phẩm trong giỏ.');
      return;
    }

    if (subTotal < coupon.minOrder) {
      setCouponError(`Mua thêm ₫${(coupon.minOrder - subTotal).toLocaleString()} để sử dụng mã này.`);
      return;
    }

    if (coupon.type === 'freeship') {
      setAppliedFreeshipCoupon(appliedFreeshipCoupon?.id === coupon.id ? null : coupon);
    } else {
      setAppliedDiscountCoupon(appliedDiscountCoupon?.id === coupon.id ? null : coupon);
    }
    setCouponCode('');
  };

  const calculateDiscount = () => {
    if (!appliedDiscountCoupon) return 0; 
    let baseAmount = subTotal;
    if (appliedDiscountCoupon.scope === 'category' && appliedDiscountCoupon.applicableCategories) {
      baseAmount = selectedItems
        .filter(item => appliedDiscountCoupon.applicableCategories?.includes(item.category))
        .reduce((acc, item) => {
          const isFS = item.flashSalePrice && item.flashSaleEnd && new Date(item.flashSaleEnd) > new Date();
          const p = (item.isShockSale && item.shockSalePrice) ? item.shockSalePrice : (isFS ? item.flashSalePrice! : item.price);
          return acc + (p * item.quantity);
        }, 0);
    }
    if (appliedDiscountCoupon.scope === 'product' && appliedDiscountCoupon.productId) {
      baseAmount = selectedItems
        .filter(item => item.id === appliedDiscountCoupon.productId)
        .reduce((acc, item) => {
          const isFS = item.flashSalePrice && item.flashSaleEnd && new Date(item.flashSaleEnd) > new Date();
          const p = (item.isShockSale && item.shockSalePrice) ? item.shockSalePrice : (isFS ? item.flashSalePrice! : item.price);
          return acc + (p * item.quantity);
        }, 0);
    }
    let discount = (appliedDiscountCoupon.type === 'fixed') ? appliedDiscountCoupon.value : (baseAmount * appliedDiscountCoupon.value / 100);
    if (appliedDiscountCoupon.maxDiscount && discount > appliedDiscountCoupon.maxDiscount) discount = appliedDiscountCoupon.maxDiscount;
    return Math.min(discount, subTotal); 
  };

  const discountAmount = calculateDiscount();
  const freeshipAmount = appliedFreeshipCoupon ? baseShippingFee : 0;
  const total = Math.max(0, subTotal + baseShippingFee - discountAmount - freeshipAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      placeOrder({
        ...formData,
        userId: user?.uid || 'guest',
        total: total,
        shippingFee: baseShippingFee - freeshipAmount,
        discountAmount: discountAmount,
        couponCode: [appliedDiscountCoupon?.code, appliedFreeshipCoupon?.code].filter(Boolean).join(', '),
        invoiceRequest: requestInvoice ? { ...invoiceData, type: invoiceType } as InvoiceData : undefined
      });
      setLoading(false);
      router.push('/orders');
    }, 1500);
  };

  if (selectedItems.length === 0) return (
    <div className="text-center py-20 bg-white border rounded-sm">
      <i className="fa-solid fa-cart-shopping text-6xl text-slate-100 mb-4"></i>
      <h2 className="text-xl font-bold text-slate-800">Bạn chưa chọn sản phẩm nào để thanh toán</h2>
      <button onClick={() => router.push('/')} className="mt-4 text-[#ee4d2d] font-bold hover:underline uppercase tracking-widest text-sm">Quay lại mua sắm</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-[#ee4d2d]"></div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Thông tin nhận hàng</h1>
        </div>
        
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded-sm shadow-sm">
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên *</label>
                <input required name="name" placeholder="Nhập họ tên" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm focus:border-[#ee4d2d] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại *</label>
                <input required name="phone" type="tel" placeholder="Nhập số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm focus:border-[#ee4d2d] outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ email</label>
              <input name="email" type="email" placeholder="Nhập email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm focus:border-[#ee4d2d] outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ nhận hàng *</label>
              <input required name="address" placeholder="Số nhà, tên đường..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm focus:border-[#ee4d2d] outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú đơn hàng</label>
              <textarea name="note" rows={2} placeholder="Ghi chú thêm..." value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm focus:border-[#ee4d2d] outline-none resize-none" />
            </div>
          </section>

          <section className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <i className="fa-solid fa-file-invoice text-[#ee4d2d]"></i>
                 <span className="text-sm font-black text-slate-800 uppercase italic">Yêu cầu hóa đơn VAT</span>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={requestInvoice} onChange={() => setRequestInvoice(!requestInvoice)} />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
               </label>
            </div>
            {requestInvoice && (
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                <div className="flex border-b border-slate-200">
                  <button type="button" onClick={() => setInvoiceType('personal')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${invoiceType === 'personal' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-slate-400'}`}>Cá nhân</button>
                  <button type="button" onClick={() => setInvoiceType('company')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${invoiceType === 'company' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-slate-400'}`}>Doanh nghiệp</button>
                </div>
                <div className="space-y-3 pt-2">
                  <input required placeholder={invoiceType === 'personal' ? 'Nhập họ tên' : 'Nhập tên công ty'} value={invoiceData.name || ''} onChange={(e) => setInvoiceData({...invoiceData, name: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-sm text-xs outline-none focus:border-[#ee4d2d]" />
                  {invoiceType === 'company' && <input required placeholder="Nhập MST" value={invoiceData.taxCode || ''} onChange={(e) => setInvoiceData({...invoiceData, taxCode: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-sm text-xs outline-none focus:border-[#ee4d2d]" />}
                  <input required placeholder="Địa chỉ đăng ký" value={invoiceData.address || ''} onChange={(e) => setInvoiceData({...invoiceData, address: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-sm text-xs outline-none focus:border-[#ee4d2d]" />
                  <input required type="email" placeholder="Email nhận hóa đơn" value={invoiceData.email || ''} onChange={(e) => setInvoiceData({...invoiceData, email: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-sm text-xs outline-none focus:border-[#ee4d2d]" />
                </div>
              </div>
            )}
          </section>

          <div className="pt-4">
             <button disabled={loading} className="w-full py-4 bg-[#ee4d2d] text-white rounded-sm font-black uppercase tracking-widest text-sm shadow-xl hover:bg-[#d73211] active:scale-[0.98] transition-all disabled:opacity-50">
               {loading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : 'XÁC NHẬN ĐẶT HÀNG (COD)'}
             </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-44 space-y-6">
          
          <div className="bg-white p-6 rounded-sm border shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ee4d2d]/5 rounded-bl-full"></div>
            
            {/* HIỂN THỊ CHI TIẾT SẢN PHẨM & QUÀ TẶNG */}
            <div className="space-y-4">
               <h3 className="text-lg font-black text-slate-800 uppercase italic border-b pb-4 flex items-center gap-2">
                 <i className="fa-solid fa-cart-flatbed text-[#ee4d2d]"></i> Giỏ hàng & Quà tặng
               </h3>
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b last:border-none border-slate-50">
                       <div className="flex gap-3">
                          <img src={item.images[0]} className="w-14 h-14 object-cover border rounded-sm shrink-0" />
                          <div className="flex-1 min-w-0">
                             <h4 className="text-[11px] font-black text-slate-800 uppercase leading-tight truncate">{item.name}</h4>
                             <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-slate-400 font-bold">x{item.quantity}</span>
                                <span className="text-xs font-black text-slate-900">₫{(item.price * item.quantity).toLocaleString()}</span>
                             </div>
                             {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                               <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {Object.entries(item.selectedVariants).map(([k, v]) => (
                                    <span key={k} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black rounded-sm border uppercase">{k}: {v}</span>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>
                       
                       {/* HIỂN THỊ QUÀ TẶNG CỦA SẢN PHẨM */}
                       {(item.giftName || (item.promoBuyQty && item.promoGetQty)) && (
                         <div className="ml-14 space-y-1.5">
                            {item.promoBuyQty && (
                              <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-sm border border-pink-100">
                                 <i className="fa-solid fa-gift text-pink-500 text-[9px]"></i>
                                 <span className="text-[9px] font-black text-pink-600 uppercase italic">
                                   Ưu đãi: Mua {item.promoBuyQty} Tặng {item.promoGetQty} {item.promoGiftName || item.name}
                                 </span>
                              </div>
                            )}
                            {item.giftName && (
                              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-sm border border-blue-100">
                                 <i className="fa-solid fa-gift text-blue-500 text-[9px]"></i>
                                 <span className="text-[9px] font-black text-blue-600 uppercase italic">
                                   Quà tặng: {item.giftName}
                                 </span>
                              </div>
                            )}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* KHỐI ƯU ĐÃI THÔNG MINH */}
            <div className="space-y-6 pt-4 border-t border-dashed">
              <h3 className="text-lg font-black text-slate-800 uppercase italic flex items-center gap-2">
                <i className="fa-solid fa-tags text-[#ee4d2d]"></i> Ưu đãi dành cho bạn
              </h3>
              
              {/* NHẮC NHỞ MUA THÊM - CHỈ HIỆN MÃ PHÙ HỢP VỚI SP TRONG GIỎ */}
              {upcomingVouchers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gợi ý dành riêng cho bạn:</p>
                  {upcomingVouchers.map(uv => (
                    <div key={uv.id} className="p-3 bg-orange-50 border border-dashed border-orange-200 rounded-sm flex items-center justify-between group animate-pulse hover:animate-none">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                            <i className={`fa-solid ${uv.type === 'freeship' ? 'fa-truck-fast' : 'fa-hand-holding-dollar'} text-xs`}></i>
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-orange-700 uppercase leading-none">Mã {uv.code}</p>
                            <p className="text-[10px] font-bold text-orange-600/70 italic mt-0.5 leading-tight">
                              Mua thêm ₫{(uv.minOrder - subTotal).toLocaleString()} để {uv.type === 'freeship' ? 'được Freeship' : `giảm thêm ${uv.type === 'percent' ? uv.value+'%' : '₫'+uv.value.toLocaleString()}`}
                            </p>
                          </div>
                       </div>
                       <button onClick={() => router.push('/')} className="text-[9px] font-black text-white bg-orange-600 px-2 py-1 rounded-sm shadow-sm hover:bg-black transition-colors shrink-0">MUA THÊM</button>
                    </div>
                  ))}
                </div>
              )}

              {/* DANH SÁCH MÃ ƯU ĐÃI KHẢ DỤNG - CHỈ HIỆN MÃ PHÙ HỢP VỚI SP TRONG GIỎ */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                 {availableVouchers.length === 0 ? (
                   <p className="text-[10px] text-slate-400 italic">Chưa có mã ưu đãi phù hợp cho đơn hàng này.</p>
                 ) : (
                   availableVouchers.map(v => {
                     const isFreeship = v.type === 'freeship';
                     const isActive = appliedDiscountCoupon?.id === v.id || appliedFreeshipCoupon?.id === v.id;
                     const isSaved = userSavedCouponCodes.includes(v.code);
                     return (
                       <div 
                          key={v.id} 
                          onClick={() => handleApplyCoupon(v)}
                          className={`p-3 border rounded-sm cursor-pointer transition-all flex items-center justify-between group ${isActive ? 'bg-orange-50 border-[#ee4d2d]' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}
                       >
                          <div className="flex items-center gap-3 min-w-0">
                             <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${isFreeship ? 'bg-emerald-100 text-emerald-600' : 'bg-[#ee4d2d]/10 text-[#ee4d2d]'}`}>
                                <i className={`fa-solid ${isFreeship ? 'fa-truck-fast' : 'fa-ticket'} text-sm`}></i>
                             </div>
                             <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black uppercase text-slate-800">{v.code}</span>
                                  {isSaved && <span className="text-[7px] font-black px-1 py-0.5 bg-blue-100 text-blue-600 rounded-sm uppercase tracking-tighter">Đã lưu</span>}
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase truncate">
                                  {isFreeship ? 'Miễn phí vận chuyển' : (v.type === 'fixed' ? `Giảm ₫${v.value.toLocaleString()}` : `Giảm ${v.value}%`)}
                                </p>
                             </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-[#ee4d2d] border-[#ee4d2d]' : 'bg-white border-slate-300'}`}>
                             {isActive && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                          </div>
                       </div>
                     );
                   })
                 )}
              </div>

              {/* NHẬP MÃ THỦ CÔNG */}
              <div className="pt-6 border-t border-dashed space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoặc nhập mã khác</label>
                   <div className="flex gap-2">
                     <input type="text" placeholder="Nhập mã ưu đãi" className="flex-1 px-4 py-2 bg-slate-50 border rounded-sm text-xs font-black uppercase outline-none focus:border-[#ee4d2d]" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                     <button type="button" onClick={() => handleApplyCoupon(couponCode)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-sm hover:bg-black transition-all">ÁP DỤNG</button>
                   </div>
                   {couponError && <p className="text-[10px] font-bold text-red-500 animate-in shake duration-300">{couponError}</p>}
                </div>

                {/* TỔNG KẾT THANH TOÁN */}
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Tạm tính ({selectedItems.length} món):</span>
                    <span className="text-slate-800">₫{subTotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscountCoupon && (
                    <div className="flex justify-between text-xs font-bold text-emerald-600 animate-in slide-in-from-right-2">
                      <span className="flex items-center gap-2"><i className="fa-solid fa-tag"></i> Voucher ({appliedDiscountCoupon.code}):</span>
                      <span>-₫{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Phí vận chuyển:</span>
                    <span className={`text-slate-800 ${appliedFreeshipCoupon ? 'line-through opacity-50' : ''}`}>
                      {baseShippingFee > 0 ? `₫${baseShippingFee.toLocaleString()}` : 'Miễn phí'}
                    </span>
                  </div>
                  
                  {appliedFreeshipCoupon && (
                     <div className="flex justify-between text-xs font-black text-emerald-600 italic animate-in slide-in-from-right-2">
                        <span className="flex items-center gap-2"><i className="fa-solid fa-truck-fast"></i> Miễn phí vận chuyển ({appliedFreeshipCoupon.code}):</span>
                        <span>-₫{baseShippingFee.toLocaleString()}</span>
                     </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Tổng cộng:</span>
                    <span className="text-2xl font-black text-[#ee4d2d]">₫{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
