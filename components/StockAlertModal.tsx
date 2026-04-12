
'use client';

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import SmartImage from './SmartImage';

const StockAlertModal: React.FC = () => {
  const { alertProduct, setAlertProduct, addStockAlert } = useApp();
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!alertProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    
    setIsSubmitting(true);
    // Giả lập gửi lên server
    setTimeout(() => {
      addStockAlert(alertProduct.id, alertProduct.name, contact);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Đóng modal sau khi hiển thị thành công
      setTimeout(() => {
        setAlertProduct(null);
        setIsSuccess(false);
        setContact('');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <div 
        className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 md:p-6 bg-blue-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-bell-concierge text-xl"></i>
            <h3 className="text-lg font-black uppercase italic tracking-tighter">Báo khi có hàng</h3>
          </div>
          <button onClick={() => setAlertProduct(null)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {isSuccess ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <i className="fa-solid fa-check text-2xl"></i>
               </div>
               <div className="space-y-2">
                 <h4 className="text-lg font-black text-slate-900 uppercase italic">Đã ghi nhận!</h4>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Chúng tôi sẽ gửi thông báo ngay lập tức qua <span className="text-blue-600 font-bold">{contact}</span> khi <span className="font-bold text-slate-700">{alertProduct.name}</span> có hàng trở lại.
                 </p>
               </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 items-start bg-slate-50 p-3 border rounded-sm">
                <SmartImage src={alertProduct.images[0]} widthHint={112} heightHint={112} sizes="56px" className="w-14 h-14 object-cover rounded-sm border bg-white" alt={alertProduct.name} />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{alertProduct.name}</h4>
                  <span className="text-[10px] font-black text-[#ee4d2d] uppercase italic">₫{alertProduct.price.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email hoặc Số điện thoại *</label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope-open absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                    <input 
                      required
                      type="text" 
                      placeholder="Địa chỉ email hoặc SĐT để nhận tin..." 
                      className="w-full pl-9 pr-4 py-3 bg-white border rounded-sm text-sm focus:border-blue-500 outline-none transition-all shadow-inner"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-relaxed italic">
                  * Hệ thống sẽ tự động quét kho hàng 24/7 và gửi thông báo ưu tiên cho những khách hàng đã đăng ký trước.
                </p>

                <button 
                  disabled={isSubmitting || !contact.trim()}
                  type="submit" 
                  className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-paper-plane"></i>
                  )}
                  {isSubmitting ? 'ĐANG ĐĂNG KÝ...' : 'XÁC NHẬN NHẬN TIN'}
                </button>
              </form>
            </>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t text-center">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ElectroHub Pro - Cam kết dịch vụ tận tâm</p>
        </div>
      </div>
    </div>
  );
};

export default StockAlertModal;
