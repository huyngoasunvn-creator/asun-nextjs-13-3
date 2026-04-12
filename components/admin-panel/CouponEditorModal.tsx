import React from "react";
import { Category, Coupon, Product } from "../../types";
import SmartImage from "../SmartImage";

type CouponEditorModalProps = {
  open: boolean;
  editingCoupon: Partial<Coupon>;
  setEditingCoupon: React.Dispatch<React.SetStateAction<Partial<Coupon>>>;
  couponProductSearch: string;
  setCouponProductSearch: React.Dispatch<React.SetStateAction<string>>;
  couponProductSearchResults: Product[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CouponEditorModal({
  open,
  editingCoupon,
  setEditingCoupon,
  couponProductSearch,
  setCouponProductSearch,
  couponProductSearchResults,
  onClose,
  onSubmit,
}: CouponEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 my-8">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <h3 className="font-black uppercase italic tracking-tighter">Cấu hình Mã Giảm Giá Đặc Biệt</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 64px)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Mã giảm giá (CODE) *</label>
              <input
                required
                placeholder="VD: ELECTRO100"
                className="w-full p-3 bg-slate-50 border text-sm font-black uppercase focus:border-[#ee4d2d] outline-none"
                value={editingCoupon.code || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Trạng thái kích hoạt</label>
              <div className="flex items-center h-[46px] bg-slate-50 px-4 rounded-sm border">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editingCoupon.isActive ?? true}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                </label>
                <span className="ml-3 text-[10px] font-black uppercase text-slate-400">
                  {editingCoupon.isActive ? "ĐANG BẬT" : "ĐANG TẮT"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-sm border">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Hình thức giảm *</label>
              <select
                className="w-full p-3 bg-white border text-sm font-bold h-[46px]"
                value={editingCoupon.type}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value as Coupon["type"] })}
              >
                <option value="fixed">Giảm số tiền cố định (₫)</option>
                <option value="percent">Giảm theo phần trăm (%)</option>
                <option value="freeship">Miễn phí vận chuyển (Freeship)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Giá trị giảm *</label>
              <input
                type="number"
                required={editingCoupon.type !== "freeship"}
                disabled={editingCoupon.type === "freeship"}
                placeholder={
                  editingCoupon.type === "percent"
                    ? "VD: 15 (%)"
                    : editingCoupon.type === "freeship"
                      ? "Không cần nhập giá trị"
                      : "VD: 100000 (₫)"
                }
                className="w-full p-3 bg-white border text-sm font-black text-[#ee4d2d] disabled:bg-slate-100 disabled:text-slate-400"
                value={editingCoupon.type === "freeship" ? "" : editingCoupon.value || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
              />
            </div>
            {editingCoupon.type === "percent" && (
              <div className="md:col-span-2 space-y-1 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase text-blue-600">Giáº£m tá»‘i Ä‘a (â‚«) - Cháº·n má»©c giáº£m lá»›n nháº¥t</label>
                
                <input
                  type="number"
                  placeholder="VD: 200000 (Nếu để trống sẽ không giới hạn)"
                  className="w-full p-3 bg-white border border-blue-200 text-sm font-black text-blue-700"
                  value={editingCoupon.maxDiscount || ""}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Đơn hàng tối thiểu (₫) *</label>
              <input
                type="number"
                required
                placeholder="VD: 500000"
                className="w-full p-3 bg-slate-50 border text-sm"
                value={editingCoupon.minOrder || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Phạm vi áp dụng</label>
              <select
                className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]"
                value={editingCoupon.scope}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, scope: e.target.value as Coupon["scope"] })}
              >
                <option value="all">Toàn sàn (Tất cả sản phẩm)</option>
                <option value="category">Theo ngành hàng</option>
                <option value="product">Một sản phẩm cụ thể</option>
              </select>
            </div>
          </div>

          {editingCoupon.scope === "category" && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm space-y-2 animate-in fade-in">
              <label className="text-[10px] font-black uppercase text-orange-700">Chọn các ngành hàng áp dụng</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(Category).map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded-sm">
                    <input
                      type="checkbox"
                      checked={editingCoupon.applicableCategories?.includes(category)}
                      onChange={(e) => {
                        const current = editingCoupon.applicableCategories || [];
                        if (e.target.checked) {
                          setEditingCoupon({ ...editingCoupon, applicableCategories: [...current, category] });
                        } else {
                          setEditingCoupon({
                            ...editingCoupon,
                            applicableCategories: current.filter((item) => item !== category),
                          });
                        }
                      }}
                    />
                    <span className="text-[10px] font-bold text-slate-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {editingCoupon.scope === "product" && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm space-y-4 animate-in fade-in">
              <label className="text-[10px] font-black uppercase text-blue-700 italic">Tìm sản phẩm được áp dụng</label>
              <div className="relative">
                <input
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full p-3 bg-white border text-xs"
                  value={couponProductSearch}
                  onChange={(e) => setCouponProductSearch(e.target.value)}
                />
                {couponProductSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm mt-1">
                    {couponProductSearchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setEditingCoupon({ ...editingCoupon, productId: product.id });
                          setCouponProductSearch(product.name);
                        }}
                        className={`w-full text-left p-3 hover:bg-slate-50 border-b text-[10px] flex items-center gap-3 transition-colors ${editingCoupon.productId === product.id ? "bg-blue-100" : ""}`}
                      >
                        <SmartImage src={product.images[0]} widthHint={64} heightHint={64} sizes="32px" className="w-8 h-8 object-cover rounded-sm" alt={product.name} />
                        <span className="font-bold">{product.name}</span>
                        {editingCoupon.productId === product.id && <i className="fa-solid fa-check text-blue-600 ml-auto"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {editingCoupon.productId && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-sm border shadow-sm">
                  <i className="fa-solid fa-link text-blue-500"></i>
                  <span className="text-[10px] font-black text-slate-700">ID: {editingCoupon.productId}</span>
                  <button
                    type="button"
                    onClick={() => setEditingCoupon({ ...editingCoupon, productId: undefined })}
                    className="ml-auto text-red-500 text-[10px] hover:underline"
                  >
                    Hủy chọn
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-2 border-dashed rounded-sm">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                className="w-full p-3 bg-slate-50 border text-xs"
                value={editingCoupon.startDate || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ngày kết thúc (Hết hạn)</label>
              <input
                type="datetime-local"
                className="w-full p-3 bg-slate-50 border text-xs"
                value={editingCoupon.endDate || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl rounded-sm hover:bg-black transition-all"
            >
              Lưu & Kích hoạt mã
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
