import React from "react";
import { CustomMenu } from "../../types";

type CustomMenuModalProps = {
  open: boolean;
  editingMenu: Partial<CustomMenu>;
  setEditingMenu: React.Dispatch<React.SetStateAction<Partial<CustomMenu>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CustomMenuModal({
  open,
  editingMenu,
  setEditingMenu,
  onClose,
  onSubmit,
}: CustomMenuModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Cấu hình Menu ẩn (Trang nhúng)</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Tên Menu hiển thị *</label>
            <input
              required
              placeholder="VD: Bảng giá đối tác..."
              className="w-full p-3 bg-slate-50 border text-sm font-black"
              value={editingMenu.title || ""}
              onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">URL trang web nhúng (Link ẩn) *</label>
            <input
              required
              type="url"
              placeholder="https://..."
              className="w-full p-3 bg-slate-50 border text-sm italic"
              value={editingMenu.url || ""}
              onChange={(e) => setEditingMenu({ ...editingMenu, url: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-sm">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Trạng thái Menu</span>
              <span className="text-[10px] text-slate-400 font-bold">Bật/Tắt hiển thị trên thanh điều hướng</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={editingMenu.isActive ?? true}
                onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.checked })}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm"
            >
              Lưu & Hiển thị Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
