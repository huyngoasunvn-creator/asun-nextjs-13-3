import React from "react";
import { CategoryTheme } from "../../types";

type ThemeEditorModalProps = {
  open: boolean;
  editingTheme: Partial<CategoryTheme>;
  setEditingTheme: React.Dispatch<React.SetStateAction<Partial<CategoryTheme>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ThemeEditorModal({
  open,
  editingTheme,
  setEditingTheme,
  onClose,
  onSubmit,
}: ThemeEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-black uppercase italic tracking-tighter">Sửa Giao diện Ngành: {editingTheme.category}</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Link Ảnh Banner (1200x400)</label>
            <input
              required
              placeholder="https://..."
              className="w-full p-3 bg-slate-50 border text-xs"
              value={editingTheme.image || ""}
              onChange={(e) => setEditingTheme({ ...editingTheme, image: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Slogan ngành hàng</label>
            <input
              required
              placeholder="Nhập câu slogan..."
              className="w-full p-3 bg-slate-50 border text-xs font-bold"
              value={editingTheme.slogan || ""}
              onChange={(e) => setEditingTheme({ ...editingTheme, slogan: e.target.value })}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-500 font-black uppercase text-[10px]">
              Hủy
            </button>
            <button type="submit" className="flex-[2] py-3 bg-[#ee4d2d] text-white font-black uppercase text-[10px] shadow-lg">
              Cập nhật giao diện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
