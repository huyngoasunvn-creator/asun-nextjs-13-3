import React from "react";
import { Banner } from "../../types";

type BannerEditorModalProps = {
  open: boolean;
  editingBanner: Partial<Banner>;
  setEditingBanner: React.Dispatch<React.SetStateAction<Partial<Banner>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function BannerEditorModal({
  open,
  editingBanner,
  setEditingBanner,
  onClose,
  onSubmit,
}: BannerEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-black uppercase italic tracking-tighter">Cấu hình Banner</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Loại hiển thị *</label>
            <select
              className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]"
              value={editingBanner.position || "main"}
              onChange={(e) => setEditingBanner({ ...editingBanner, position: e.target.value as Banner["position"] })}
            >
              <option value="main">Slide Ngang (Băng tải chính)</option>
              <option value="side">Slide Dọc (Cạnh Slide chính)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Ảnh Banner (URL) *</label>
            <input
              required
              placeholder="https://..."
              className="w-full p-3 bg-slate-50 border text-sm"
              value={editingBanner.imageUrl || ""}
              onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Nội dung / Tiêu đề (Nếu có)</label>
            <input
              placeholder="VD: GIẢM GIÁ 50% SMARTPHONE"
              className="w-full p-3 bg-slate-50 border text-sm font-black uppercase"
              value={editingBanner.title || ""}
              onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Link liên kết (Nếu có)</label>
            <input
              placeholder="VD: /flash-sales hoặc https://..."
              className="w-full p-3 bg-slate-50 border text-sm"
              value={editingBanner.link || ""}
              onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Văn bản nút bấm</label>
              <input
                placeholder="XEM NGAY"
                className="w-full p-3 bg-white border text-sm font-bold"
                value={editingBanner.buttonText || ""}
                onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Hoạt động</label>
              <div className="flex items-center h-[46px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editingBanner.isActive ?? true}
                    onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px]">
              Hủy
            </button>
            <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl">
              Lưu Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
