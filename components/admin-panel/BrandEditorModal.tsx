import React from "react";
import { Brand } from "../../types";

type BrandEditorModalProps = {
  open: boolean;
  editingBrand: Partial<Brand>;
  setEditingBrand: React.Dispatch<React.SetStateAction<Partial<Brand>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function BrandEditorModal({
  open,
  editingBrand,
  setEditingBrand,
  onClose,
  onSubmit,
}: BrandEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-md rounded-sm shadow-2xl overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-black uppercase italic">Thương Hiệu Đối Tác</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <input
            required
            placeholder="Tên thương hiệu"
            className="w-full p-3 bg-slate-50 border text-sm font-black"
            value={editingBrand.name || ""}
            onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
          />
          <input
            required
            placeholder="Logo URL"
            className="w-full p-3 bg-slate-50 border text-sm"
            value={editingBrand.logoUrl || ""}
            onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
          />
          <button type="submit" className="w-full py-3 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest">
            Lưu Thương Hiệu
          </button>
        </form>
      </div>
    </div>
  );
}
