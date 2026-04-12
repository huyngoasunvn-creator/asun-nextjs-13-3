'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import Link from 'next/link';
import ReviewModal from './ReviewModal';
import { Product, Order } from '../types';
import SmartImage from './SmartImage';

// Fixed TS error by using React.FC which properly handles reserved props like 'key'
// and improved prop handling for setReviewProduct.
const OrderCard: React.FC<{ 
  order: Order; 
  onReview: (product: Product, orderId: string) => void; 
}> = ({ 
  order, 
  onReview 
}) => (
  <div className="bg-white border rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-4 bg-slate-50 border-b flex flex-wrap justify-between items-center gap-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn hàng</span>
        <span className="text-xs font-bold text-slate-800 font-mono italic">#{order.id.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-6">
         <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ngày đặt</span>
            <span className="text-xs font-bold text-slate-600">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
         </div>
         <div className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
           order.status === 'Đã giao' ? 'bg-green-50 text-green-600 border-green-200' : 
           order.status === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' :
           'bg-yellow-50 text-[#ee4d2d] border-[#ee4d2d]/20'
         }`}>
           {order.status}
         </div>
      </div>
    </div>

    <div className="p-4 bg-[#fcfcfc] border-b grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="space-y-1">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thông tin người nhận</h4>
          <p className="text-xs font-bold text-slate-800">{order.customerName}</p>
          <p className="text-[11px] text-[#ee4d2d] font-black">{order.customerPhone}</p>
          <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
       </div>
       <div className="space-y-1">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ giao hàng</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed italic">"{order.shippingAddress}"</p>
       </div>
    </div>

    <div className="p-4 space-y-4">
      {order.items.map((item, idx) => {
        const isReviewed = order.reviewedProductIds?.includes(item.id);
        const canReview = order.status === 'Đã giao';

        return (
          <div key={idx} className="space-y-2 border-b last:border-none pb-4 last:pb-0">
            <div className="flex gap-4 items-center group">
              <div className="w-16 h-16 rounded-sm object-cover border shrink-0 overflow-hidden">
                 <SmartImage src={item.images[0]} widthHint={128} heightHint={128} sizes="64px" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.name}</div>
                <div className="text-[10px] text-slate-400">Số lượng: {item.quantity}</div>
                {canReview && (
                  <div className="mt-2">
                    {isReviewed ? (
                      <span className="text-[10px] font-black uppercase text-emerald-600 italic bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-sm">
                        <i className="fa-solid fa-circle-check mr-1"></i> Đã đánh giá
                      </span>
                    ) : (
                      <button 
                        onClick={() => onReview(item, order.id)}
                        className="text-[10px] font-black uppercase text-[#ee4d2d] border border-[#ee4d2d] px-3 py-1 rounded-sm hover:bg-[#ee4d2d] hover:text-white transition-all shadow-sm"
                      >
                        Viết đánh giá
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-sm font-black text-[#ee4d2d]">₫{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>

    <div className="p-4 bg-slate-900 border-t flex justify-between items-center">
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng thanh toán</span>
       <div className="text-right">
          <span className="text-xl font-black text-[#ee4d2d]">₫{order.total.toLocaleString()}</span>
          <p className="text-[9px] text-slate-500 font-bold uppercase italic">Phương thức: COD (Khi nhận hàng)</p>
       </div>
    </div>
  </div>
);

const OrderHistory: React.FC = () => {
  const { orders } = useApp();
  const { user } = useAuth();
  
  // States cho Tra cứu thủ công (Guest)
  const [lookupOrderId, setLookupOrderId] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');

  const [reviewProduct, setReviewProduct] = useState<{product: Product, orderId: string} | null>(null);

  // Lọc đơn hàng nếu đã đăng nhập
  const myOrders = useMemo(() => {
    if (!user) return [];
    // Nếu là admin và đang ở trang lịch sử (không phải admin panel), chỉ hiện đơn của mình
    return orders.filter(o => o.userId === user.uid);
  }, [orders, user]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    const found = orders.find(o => 
      o.id.toLowerCase() === lookupOrderId.trim().toLowerCase() && 
      o.customerPhone.trim() === lookupPhone.trim()
    );

    if (found) {
      setLookupResult(found);
    } else {
      setLookupError('Không tìm thấy đơn hàng phù hợp với mã và số điện thoại này.');
    }
  };

  const handleReview = (product: Product, orderId: string) => {
    setReviewProduct({ product, orderId });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-4">
      <div className="flex items-center gap-3 bg-white p-6 rounded-sm shadow-sm border">
        <div className="w-1.5 h-8 bg-[#ee4d2d]"></div>
        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Tra cứu đơn hàng</h1>
      </div>

      {!user ? (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-white p-8 md:p-12 border rounded-sm shadow-lg text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                 <i className="fa-solid fa-magnifying-glass text-3xl"></i>
              </div>
              <div className="space-y-2">
                 <h2 className="text-xl font-black uppercase italic text-slate-800">Tra cứu bảo mật</h2>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Vui lòng cung cấp mã đơn và số điện thoại để tiếp tục</p>
              </div>

              <form onSubmit={handleLookup} className="max-w-md mx-auto space-y-4 pt-4">
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Mã đơn hàng *</label>
                    <input 
                      required
                      placeholder="VD: ord-171234..."
                      className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm font-bold focus:border-[#ee4d2d] outline-none"
                      value={lookupOrderId}
                      onChange={e => setLookupOrderId(e.target.value)}
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Số điện thoại *</label>
                    <input 
                      required
                      type="tel"
                      placeholder="Số điện thoại dùng khi đặt hàng"
                      className="w-full px-4 py-3 bg-slate-50 border rounded-sm text-sm font-bold focus:border-[#ee4d2d] outline-none"
                      value={lookupPhone}
                      onChange={e => setLookupPhone(e.target.value)}
                    />
                 </div>
                 {lookupError && (
                   <p className="text-[10px] font-bold text-red-500 uppercase italic animate-in shake duration-300">
                      <i className="fa-solid fa-circle-exclamation mr-1"></i> {lookupError}
                   </p>
                 )}
                 <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-xl active:scale-95">
                    TÌM KIẾM ĐƠN HÀNG
                 </button>
              </form>

              <div className="pt-8 border-t border-slate-50 flex flex-col items-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Hoặc đăng nhập để xem lịch sử đơn hàng</p>
                 <button className="text-[#ee4d2d] font-black uppercase text-xs hover:underline flex items-center gap-2">
                    <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập tài khoản
                 </button>
              </div>
           </div>

           {lookupResult && (
             <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 text-emerald-600">
                   <i className="fa-solid fa-circle-check"></i>
                   <span className="text-[10px] font-black uppercase">Đã tìm thấy đơn hàng của bạn</span>
                </div>
                <OrderCard order={lookupResult} onReview={handleReview} />
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-sm p-20 text-center border">
              <i className="fa-solid fa-receipt text-6xl text-slate-100 mb-4"></i>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Bạn chưa có đơn hàng nào</p>
              <Link href="/" className="text-[#ee4d2d] font-bold mt-4 inline-block hover:underline">Tiếp tục mua sắm</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myOrders.map(order => (
                <OrderCard key={order.id} order={order} onReview={handleReview} />
              ))}
            </div>
          )}
        </div>
      )}

      {reviewProduct && (
        <ReviewModal 
          product={reviewProduct.product} 
          orderId={reviewProduct.orderId}
          onClose={() => setReviewProduct(null)} 
        />
      )}
    </div>
  );
};

export default OrderHistory;
