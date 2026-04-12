import React from "react";
import { BlogPost, Product } from "../../types";
import ImageUploadButton from "./ImageUploadButton";
import SmartImage from "../SmartImage";

type BlogEditorModalProps = {
  open: boolean;
  editingBlog: Partial<BlogPost>;
  setEditingBlog: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  products: Product[];
  blogProductSearch: string;
  setBlogProductSearch: React.Dispatch<React.SetStateAction<string>>;
  showBlogProductResults: boolean;
  setShowBlogProductResults: React.Dispatch<React.SetStateAction<boolean>>;
  blogProductSearchResults: Product[];
  blogEditorRef: React.RefObject<HTMLDivElement | null>;
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateAI: () => void;
  execCommand: (cmd: string, val?: string) => void;
  insertLink: () => void;
  insertImageFromUrl: () => void;
  uploadContentImage: () => void;
};

export default function BlogEditorModal({
  open,
  editingBlog,
  setEditingBlog,
  products,
  blogProductSearch,
  setBlogProductSearch,
  showBlogProductResults,
  setShowBlogProductResults,
  blogProductSearchResults,
  blogEditorRef,
  isGenerating,
  onClose,
  onSubmit,
  onGenerateAI,
  execCommand,
  insertLink,
  insertImageFromUrl,
  uploadContentImage,
}: BlogEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative my-8">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Biên tập bài viết Blog</h3>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Tiêu đề bài viết *</label>
              <input required placeholder="Nhập tiêu đề hấp dẫn..." className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingBlog.title || ""} onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Chuyên mục</label>
                <input placeholder="VD: Mẹo vặt, Tin tức..." className="w-full p-3 bg-slate-50 border text-sm" value={editingBlog.category || ""} onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Tác giả</label>
                <input placeholder="VD: Admin" className="w-full p-3 bg-slate-50 border text-sm" value={editingBlog.author || ""} onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ảnh đại diện (URL) *</label>
              <div className="flex gap-2">
                <input required placeholder="https://..." className="flex-1 p-3 bg-slate-50 border text-sm" value={editingBlog.image || ""} onChange={e => setEditingBlog({ ...editingBlog, image: e.target.value })} />
                <ImageUploadButton
                  folder="blogs"
                  label="Tải ảnh"
                  onUploaded={url => setEditingBlog({ ...editingBlog, image: url })}
                  className="inline-flex items-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-3 py-3 text-[10px] font-black uppercase text-blue-600"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Link Video (YouTube/Drive)</label>
              <input placeholder="https://www.youtube.com/watch?v=..." className="w-full p-3 bg-slate-50 border text-sm italic" value={editingBlog.videoUrl || ""} onChange={e => setEditingBlog({ ...editingBlog, videoUrl: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Mô tả ngắn (Excerpt)</label>
              <textarea rows={3} placeholder="Tóm tắt nội dung bài viết..." className="w-full p-3 bg-slate-50 border text-sm resize-none" value={editingBlog.excerpt || ""} onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-blue-700">Liên kết sản phẩm liên quan</label>
                <span className="text-[9px] font-bold text-blue-400">({editingBlog.relatedProductIds?.length || 0} đã chọn)</span>
              </div>
              <div className="relative">
                <input
                  placeholder="Tìm sản phẩm để gắn vào bài..."
                  className="w-full p-3 bg-white border text-xs"
                  value={blogProductSearch}
                  onFocus={() => setShowBlogProductResults(true)}
                  onChange={e => setBlogProductSearch(e.target.value)}
                />
                {showBlogProductResults && blogProductSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm mt-1">
                    {blogProductSearchResults.map(product => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          const current = editingBlog.relatedProductIds || [];
                          if (!current.includes(product.id)) {
                            setEditingBlog({ ...editingBlog, relatedProductIds: [...current, product.id] });
                          }
                          setBlogProductSearch("");
                          setShowBlogProductResults(false);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-50 border-b text-[10px] flex items-center gap-3"
                      >
                        <SmartImage src={product.images[0]} widthHint={64} heightHint={64} sizes="32px" className="w-8 h-8 object-cover rounded-sm" alt={product.name} />
                        <span className="font-bold">{product.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {editingBlog.relatedProductIds?.map(productId => {
                  const product = products.find(prod => prod.id === productId);
                  return (
                    <div key={productId} className="flex items-center gap-2 bg-white border px-2 py-1 rounded-full">
                      <span className="text-[9px] font-bold text-slate-600 truncate max-w-[100px]">{product?.name || productId}</span>
                      <button type="button" onClick={() => setEditingBlog({ ...editingBlog, relatedProductIds: editingBlog.relatedProductIds?.filter(id => id !== productId) })} className="text-red-500">
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Nội dung bài viết</h3>
              <button type="button" onClick={onGenerateAI} className="bg-blue-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase flex items-center gap-2">
                <i className={`fa-solid ${isGenerating ? "fa-spinner animate-spin" : "fa-wand-magic-sparkles"}`}></i> AI viết bài
              </button>
            </div>
            <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
              <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                <button type="button" onClick={() => execCommand("bold")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold" title="In đậm">B</button>
                <button type="button" onClick={() => execCommand("italic")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic" title="In nghiêng">I</button>
                <button type="button" onClick={() => execCommand("insertUnorderedList")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs" title="Danh sách"><i className="fa-solid fa-list-ul"></i></button>
                <button type="button" onClick={insertLink} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-blue-600" title="Gắn liên kết"><i className="fa-solid fa-link"></i></button>
                <button type="button" onClick={() => execCommand("unlink")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-red-400" title="Bỏ liên kết"><i className="fa-solid fa-link-slash"></i></button>
                <button type="button" onClick={insertImageFromUrl} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-blue-600" title="Chèn ảnh bằng URL"><i className="fa-solid fa-image"></i></button>
                <button type="button" onClick={uploadContentImage} className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 rounded text-blue-600 text-xs" title="Tải ảnh từ máy"><i className="fa-solid fa-cloud-arrow-up"></i></button>
              </div>
              <div ref={blogEditorRef} contentEditable className="p-5 min-h-[30rem] max-h-[40rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white" spellCheck={false}></div>
            </div>
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy</button>
              <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">Lưu Bài Viết</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
