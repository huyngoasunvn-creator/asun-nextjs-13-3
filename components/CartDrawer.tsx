
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../store/AppContext';
import SmartImage from './SmartImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // Access cart state and actions from AppContext
  const { cart, removeFromCart, updateCartQuantity, toggleCartItemSelection, toggleAllCartItems } = useApp();
  const router = useRouter();
  
  // Tính phí ship tổng 28k cho cả đơn hàng nếu có SP không freeship
  const selectedItems = cart.filter(item => item.selected);
  const hasNonFreeship = selectedItems.some(item => !item.isFreeship);
  const shippingTotal = hasNonFreeship ? 28000 : 0;

  const subtotal = cart.reduce((acc, item) => {
    if (!item.selected) return acc;
    const now = new Date();
    const isFS = item.flashSalePrice && item.flashSaleEnd && new Date(item.flashSaleEnd) > now;
    let price = item.price;
    if (item.isShockSale && item.shockSalePrice) {
      price = item.shockSalePrice;
    } else if (isFS) {
      price = item.flashSalePrice!;
    }
    return acc + (price * item.quantity);
  }, 0);

  const total = subtotal + shippingTotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Semi-transparent backdrop overlay with blur effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      {/* Side Drawer Panel sliding from right */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
             <i className="fa-solid fa-cart-shopping text-xl text-[#ee4d2d]"></i>
             <h2 className="text-lg font-black uppercase italic tracking-tighter">Giỏ hàng ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-all">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <i className="fa-solid fa-cart-arrow-down text-6xl text-slate-100"></i>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Giỏ hàng đang trống</p>
              <button onClick={onClose} className="text-[#ee4d2d] font-black uppercase text-[10px] hover:underline">Quay lại mua sắm ngay</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b pb-3">
                <button 
                  onClick={() => toggleAllCartItems(!cart.every(i => i.selected))}
                  className="text-[10px] font-black text-slate-400 uppercase hover:text-[#ee4d2d] transition-colors"
                >
                  {cart.every(i => i.selected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              <div className="space-y-4">
                {cart.map((item, idx) => {
                  const now = new Date();
                  const isFS = item.flashSalePrice && item.flashSaleEnd && new Date(item.flashSaleEnd) > now;
                  let displayPrice = item.price;
                  if (item.isShockSale && item.shockSalePrice) {
                    displayPrice = item.shockSalePrice;
                  } else if (isFS) {
                    displayPrice = item.flashSalePrice!;
                  }

                  return (
                    <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 bg-slate-50 border rounded-sm group relative">
                      <div className="flex flex-col items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={item.selected} 
                          onChange={() => toggleCartItemSelection(item.id)}
                          className="w-4 h-4 accent-[#ee4d2d] cursor-pointer"
                        />
                      </div>
                      <div className="w-20 h-20 bg-white border rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                        <SmartImage src={item.images[0]} widthHint={160} heightHint={160} fit="fit" sizes="80px" className="max-w-full max-h-full object-contain p-1" alt={item.name} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">{item.name}</h4>
                        {/* Display selected variations (color, size, etc.) */}
                        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                          <div className="flex flex-wrap gap-2 pb-1">
                            {Object.entries(item.selectedVariants).map(([label, value]) => (
                              <span key={label} className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200">
                                {label}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-black text-[#ee4d2d]">₫{displayPrice.toLocaleString()}</span>
                           {item.originalPrice && item.originalPrice > displayPrice && (
                             <span className="text-[10px] text-slate-300 line-through">₫{item.originalPrice.toLocaleString()}</span>
                           )}
                        </div>
                        {/* Hiển thị phí ship của từng sản phẩm - Chỉ hiện khi Freeship */}
                        <div className="flex items-center gap-1.5 pt-1">
                           {item.isFreeship && (
                             <>
                               <i className="fa-solid fa-truck-fast text-blue-600 text-[10px]"></i>
                               <span className="text-[10px] font-black uppercase text-blue-600">Miễn phí vận chuyển</span>
                             </>
                           )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border bg-white rounded-sm overflow-hidden shadow-sm">
                             <button onClick={() => updateCartQuantity(item.id, -1)} className="px-2 py-1 hover:bg-slate-100 text-[10px]"><i className="fa-solid fa-minus"></i></button>
                             <span className="px-3 py-1 text-xs font-black border-x w-8 text-center">{item.quantity}</span>
                             <button onClick={() => updateCartQuantity(item.id, 1)} className="px-2 py-1 hover:bg-slate-100 text-[10px]"><i className="fa-solid fa-plus"></i></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-slate-400 uppercase hover:text-red-500 transition-colors">
                            <i className="fa-solid fa-trash-can mr-1"></i> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer with summary and checkout action */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-900 border-t space-y-4 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white/60">
                 <span className="text-[10px] font-black uppercase tracking-[0.1em]">Tiền hàng ({cart.filter(i => i.selected).length} món)</span>
                 <span className="text-sm font-bold">₫{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                 <span className="text-[10px] font-black uppercase tracking-[0.1em]">Phí vận chuyển</span>
                 <span className="text-sm font-bold">{shippingTotal > 0 ? `₫${shippingTotal.toLocaleString()}` : 'Miễn phí'}</span>
              </div>
              <div className="flex items-center justify-between text-white pt-2 border-t border-white/10">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">TỔNG CỘNG</span>
                 <div className="text-right">
                   <span className="text-xl font-black text-[#ee4d2d]">₫{total.toLocaleString()}</span>
                   <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 italic">Chưa bao gồm giảm giá Voucher</p>
                 </div>
              </div>
            </div>
            <button 
              onClick={() => { onClose(); router.push('/checkout'); }}
              disabled={!cart.some(i => i.selected)}
              className="w-full py-5 bg-[#ee4d2d] text-white font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-[#d73211] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
            >
              TIẾN HÀNH THANH TOÁN
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-white/5 text-white/40 font-black uppercase text-[9px] tracking-[0.2em] hover:text-white transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
