import React from "react";
import { Review, Product } from "../../types";
import ImageUploadButton from "./ImageUploadButton";
import SmartImage from "../SmartImage";

type ReviewEditorModalProps = {
  open: boolean;
  editingReview: Partial<Review>;
  setPartialReview: React.Dispatch<React.SetStateAction<Partial<Review>>>;
  reviewProductSearch: string;
  setReviewProductSearch: React.Dispatch<React.SetStateAction<string>>;
  showReviewProductResults: boolean;
  setShowReviewProductResults: React.Dispatch<React.SetStateAction<boolean>>;
  reviewProductSearchResults: Product[];
  reviewTags: string[];
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleTag: (tag: string) => void;
  onAddImageLink: () => void;
  onUpdateImageLink: (index: number, value: string) => void;
  onRemoveImageLink: (index: number) => void;
};

export default function ReviewEditorModal({
  open,
  editingReview,
  setPartialReview,
  reviewProductSearch,
  setReviewProductSearch,
  showReviewProductResults,
  setShowReviewProductResults,
  reviewProductSearchResults,
  reviewTags,
  isGenerating,
  onClose,
  onSubmit,
  onToggleTag,
  onAddImageLink,
  onUpdateImageLink,
  onRemoveImageLink,
}: ReviewEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative my-8">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-black uppercase italic tracking-tighter">
            {editingReview.id ? "Cập nhật đánh giá" : "Thêm đánh giá thủ công (Admin)"}
          </h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase text-[#ee4d2d] border-b pb-2">Liên kết Sản phẩm</h4>
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Tìm sản phẩm *</label>
              <input
                required
                placeholder="Nhập tên sản phẩm cần thêm đánh giá..."
                className="w-full p-3 bg-slate-50 border text-sm font-bold focus:border-[#ee4d2d] outline-none"
                value={reviewProductSearch}
                onFocus={() => setShowReviewProductResults(true)}
                onChange={e => {
                  setReviewProductSearch(e.target.value);
                  setShowReviewProductResults(true);
                }}
              />
              {showReviewProductResults && reviewProductSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm">
                  {reviewProductSearchResults.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        setPartialReview({ ...editingReview, productId: product.id });
                        setReviewProductSearch(product.name);
                        setShowReviewProductResults(false);
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 border-b text-[11px] flex items-center gap-3"
                    >
                      <SmartImage src={product.images[0]} widthHint={64} heightHint={64} sizes="32px" className="w-8 h-8 object-cover rounded-sm" alt={product.name} />
                      <span className="font-bold">{product.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Tên người đánh giá *</label>
              <input required placeholder="VD: Anh Minh, Chị Lan..." className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingReview.userName || ""} onChange={e => setPartialReview({ ...editingReview, userName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ngày & Giờ tạo *</label>
              <input type="datetime-local" required className="w-full p-3 bg-slate-50 border text-sm" value={editingReview.createdAt || ""} onChange={e => setPartialReview({ ...editingReview, createdAt: e.target.value })} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 block text-center">Mức độ hài lòng (Số sao)</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setPartialReview({ ...editingReview, rating: star })} className={`text-2xl transition-all ${editingReview.rating! >= star ? "text-yellow-400 scale-125" : "text-slate-200"}`}>
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Chọn tags đánh giá nhanh</label>
            <div className="flex flex-wrap gap-2">
              {reviewTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${editingReview.tags?.includes(tag) ? "bg-emerald-50 text-white border-emerald-500 shadow-md" : "bg-white text-slate-500 border-slate-200 hover:border-[#ee4d2d]/50"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Nội dung bình luận</label>
            <textarea
              placeholder="Nhập nội dung chia sẻ..."
              className="w-full p-4 bg-slate-50 border rounded-sm text-sm min-h-[100px] outline-none focus:border-[#ee4d2d] resize-none"
              value={editingReview.comment || ""}
              onChange={e => setPartialReview({ ...editingReview, comment: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-slate-400">Hình ảnh thực tế (Link)</label>
              <button type="button" onClick={onAddImageLink} className="text-[10px] font-black text-blue-600 uppercase hover:underline">+ Thêm link ảnh</button>
            </div>
            <div className="space-y-2">
              {editingReview.images?.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="w-10 h-10 border bg-white shrink-0">
                    {url ? <SmartImage src={url} widthHint={80} heightHint={80} sizes="40px" className="w-full h-full object-cover" alt={`Ảnh đánh giá ${index + 1}`} /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><i className="fa-solid fa-image text-xs text-slate-300"></i></div>}
                  </div>
                  <input placeholder="https://..." className="flex-1 p-2 bg-slate-50 border text-[11px]" value={url} onChange={e => onUpdateImageLink(index, e.target.value)} />
                  <ImageUploadButton
                    folder="reviews"
                    label="Tải"
                    onUploaded={uploadedUrl => onUpdateImageLink(index, uploadedUrl)}
                    className="inline-flex items-center gap-1 rounded-sm border border-blue-200 bg-blue-50 px-2 py-2 text-[10px] font-black uppercase text-blue-600"
                  />
                  <button type="button" onClick={() => onRemoveImageLink(index)} className="text-red-500 px-1">
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy bỏ</button>
            <button type="submit" disabled={isGenerating} className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">
              {isGenerating ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : (editingReview.id ? "CẬP NHẬT" : "LƯU ĐÁNH GIÁ")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
