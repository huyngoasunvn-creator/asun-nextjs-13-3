import React from "react";
import { Commitment } from "../../types";

type CommitmentEditorModalProps = {
  open: boolean;
  editingCommitment: Partial<Commitment>;
  setEditingCommitment: React.Dispatch<React.SetStateAction<Partial<Commitment>>>;
  commitmentEditorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onApplyTemplate: (type: "GENUINE" | "SUPPORT" | "RETURNS") => void;
  execCommand: (cmd: string, val?: string) => void;
};

export default function CommitmentEditorModal({
  open,
  editingCommitment,
  setEditingCommitment,
  commitmentEditorRef,
  onClose,
  onSubmit,
  onApplyTemplate,
  execCommand,
}: CommitmentEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
        <div className="p-4 md:p-5 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Cấu hình Cam kết dịch vụ</h2>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 64px)" }}>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-sm">
            <h4 className="text-[10px] font-black uppercase text-orange-700 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Gợi ý nội dung mẫu
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onApplyTemplate("GENUINE")}
                className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all"
              >
                Mẫu: Hoàn tiền 90 ngày
              </button>
              <button
                type="button"
                onClick={() => onApplyTemplate("SUPPORT")}
                className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all"
              >
                Mẫu: Hỗ trợ 24/7
              </button>
              <button
                type="button"
                onClick={() => onApplyTemplate("RETURNS")}
                className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all"
              >
                Mẫu: Đổi trả 15 ngày
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Icon (FontAwesome)</label>
              <input
                required
                placeholder="VD: fa-shield-halved"
                className="w-full p-3 bg-slate-50 border text-sm"
                value={editingCommitment.icon || ""}
                onChange={(e) => setEditingCommitment({ ...editingCommitment, icon: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Tiêu đề chính</label>
              <input
                required
                placeholder="VD: CAM KẾT CHÍNH HÃNG"
                className="w-full p-3 bg-slate-50 border text-sm font-black uppercase"
                value={editingCommitment.title || ""}
                onChange={(e) => setEditingCommitment({ ...editingCommitment, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Dòng mô tả ngắn (Highlight)</label>
            <input
              placeholder="VD: HOÀN TIỀN TRONG 90 NGÀY..."
              className="w-full p-3 bg-slate-50 border text-sm font-bold text-[#ee4d2d] uppercase"
              value={editingCommitment.desc || ""}
              onChange={(e) => setEditingCommitment({ ...editingCommitment, desc: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Nội dung chi tiết chính sách</label>
            <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
              <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                <button type="button" onClick={() => execCommand("bold")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold">
                  B
                </button>
                <button type="button" onClick={() => execCommand("italic")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic">
                  I
                </button>
                <button type="button" onClick={() => execCommand("insertUnorderedList")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs">
                  <i className="fa-solid fa-list-ul"></i>
                </button>
                <button type="button" onClick={() => execCommand("justifyFull")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs">
                  <i className="fa-solid fa-align-justify"></i>
                </button>
              </div>
              <div
                ref={commitmentEditorRef}
                contentEditable
                className="p-5 min-h-[15rem] max-h-[30rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white"
                spellCheck={false}
              ></div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">
              Hủy
            </button>
            <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">
              Lưu Cam Kết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
