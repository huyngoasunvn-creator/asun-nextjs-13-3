import React from 'react';
import SmartImage from '../SmartImage';
import { Order } from '../../types';

type OrderDetailModalProps = {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8 flex flex-col">
        <div className="p-5 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Hồ sơ đơn hàng chi tiết</h2>
            <span className="text-[10px] font-mono opacity-60">ID: #{order.id.toUpperCase()}</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-all">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50 flex-1" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 rounded-sm border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'Đã giao' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    <i className="fa-solid fa-truck-ramp-box text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Trạng thái hiện tại</p>
                    <span className="text-sm font-black text-slate-800 uppercase italic">{order.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-[10px] font-black text-slate-400 uppercase hidden sm:block">Cập nhật nhanh:</label>
                  <select value={order.status} onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])} className="flex-1 sm:flex-none p-2 bg-slate-50 border rounded-sm text-[11px] font-black uppercase outline-none focus:border-[#ee4d2d]">
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-sm border shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-900/5 border-b">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase italic tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-boxes-stacked text-[#ee4d2d]"></i> Danh sách sản phẩm cần soạn
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
                      <tr>
                        <th className="px-4 py-3">Sản phẩm & Phân loại</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map((item, index) => (
                        <tr key={index} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-4">
                              <SmartImage src={item.images[0]} widthHint={112} heightHint={112} sizes="56px" className="w-14 h-14 object-cover rounded-sm border bg-white shrink-0" alt={item.name} />
                              <div className="space-y-1 min-w-0">
                                <div className="text-[11px] font-black text-slate-800 uppercase leading-tight group-hover:text-[#ee4d2d] transition-colors">{item.name}</div>
                                {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {Object.entries(item.selectedVariants).map(([label, value]) => (
                                      <span key={label} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-black rounded-sm border border-orange-200 uppercase">
                                        {label}: {value}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-300 uppercase italic">Không có phân loại</span>
                                )}
                                {item.calculatedGifts && item.calculatedGifts.length > 0 && (
                                  <div className="pt-2 space-y-1">
                                    {item.calculatedGifts.map((gift, giftIndex) => (
                                      <div key={giftIndex} className="flex items-center gap-1.5 text-pink-600">
                                        <i className="fa-solid fa-gift text-[9px]"></i>
                                        <span className="text-[10px] font-black uppercase italic">Tặng kèm: {gift.quantity} {gift.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-black text-slate-700 text-sm">{item.quantity}</td>
                          <td className="px-4 py-4 text-right font-black text-[#ee4d2d] text-sm">₫{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-user text-blue-500"></i> Thông tin khách nhận
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Người nhận</span>
                    <span className="text-sm font-bold text-slate-800">{order.customerName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Điện thoại</span>
                    <span className="text-sm font-black text-[#ee4d2d]">{order.customerPhone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Email</span>
                    <span className="text-xs font-bold text-slate-500">{order.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-map-location-dot text-emerald-500"></i> Địa chỉ nhận hàng
                </h4>
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{order.shippingAddress}"</p>
                {order.note && (
                  <div className="pt-3 border-t border-dashed">
                    <span className="text-[8px] font-black text-orange-400 uppercase block mb-1">Ghi chú từ khách:</span>
                    <p className="text-[11px] font-bold text-slate-500 leading-normal">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {order.invoiceRequest ? (
                <div className="bg-white p-5 rounded-sm border border-blue-100 shadow-md space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-file-invoice"></i> Thông tin hóa đơn VAT
                  </h4>
                  <div className="space-y-4">
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full w-fit uppercase">
                      {order.invoiceRequest.type === 'personal' ? 'Hóa đơn Cá nhân' : 'Hóa đơn Doanh nghiệp'}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Tên đơn vị/Cá nhân</span>
                        <span className="text-xs font-bold text-slate-700 uppercase leading-tight block">{order.invoiceRequest.name}</span>
                      </div>
                      {order.invoiceRequest.taxCode && (
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase block">Mã số thuế</span>
                          <span className="text-xs font-black text-slate-800 tracking-wider">{order.invoiceRequest.taxCode}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Email nhận HĐ</span>
                        <span className="text-xs font-bold text-blue-600 underline">{order.invoiceRequest.email}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Địa chỉ</span>
                        <span className="text-[11px] font-medium text-slate-500 leading-snug block">{order.invoiceRequest.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-sm border border-dashed border-slate-200 text-center space-y-2 opacity-60">
                  <i className="fa-solid fa-file-invoice text-slate-200 text-2xl"></i>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Không yêu cầu hóa đơn VAT</p>
                </div>
              )}

              <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/10 pb-3 italic">Tóm tắt thanh toán</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Tạm tính hàng hóa:</span>
                    <span className="font-bold">₫{(order.total + (order.discountAmount || 0) - (order.shippingFee || 0)).toLocaleString()}</span>
                  </div>
                  {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-yellow-400 font-bold">
                      <span>Giảm giá Voucher ({order.couponCode || 'Promo'}):</span>
                      <span>-₫{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-emerald-400 font-bold">
                    <span>Phí vận chuyển:</span>
                    <span className="uppercase italic">{order.shippingFee > 0 ? `₫${order.shippingFee.toLocaleString()}` : 'Miễn phí'}</span>
                  </div>
                </div>
                <div className="pt-5 border-t border-white/20 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white/40 uppercase mb-1">TỔNG THANH TOÁN (COD)</span>
                  <span className="text-3xl font-black text-[#ee4d2d] drop-shadow-lg">₫{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Ghi chú soạn hàng (Internal)</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[11px] text-slate-500"><input type="checkbox" className="rounded-sm accent-[#ee4d2d]" /><span>Kiểm tra ngoại quan sản phẩm</span></li>
                  <li className="flex items-center gap-2 text-[11px] text-slate-500"><input type="checkbox" className="rounded-sm accent-[#ee4d2d]" /><span>Dán tem bảo hành 12-24 tháng</span></li>
                  <li className="flex items-center gap-2 text-[11px] text-slate-500"><input type="checkbox" className="rounded-sm accent-[#ee4d2d]" /><span>Đóng gói chống sốc 3 lớp</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-white border-t flex justify-center md:justify-end gap-3 shrink-0 shadow-inner">
          <button onClick={onClose} className="px-8 py-3 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-slate-200 transition-colors">Đóng lại</button>
          <button onClick={() => window.print()} className="px-10 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg">
            <i className="fa-solid fa-print"></i> In đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
