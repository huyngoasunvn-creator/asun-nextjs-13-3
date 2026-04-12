import Link from "next/link";
import React from "react";
import { Brand, Category, Product, ProductSpec } from "../../types";
import ImageUploadButton from "./ImageUploadButton";
import SmartImage from "../SmartImage";

type ProductEditorModalProps = {
  open: boolean;
  editingProduct: Partial<Product>;
  setEditingProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  duplicateProduct: Product | null;
  duplicateNameWarning: string | null;
  brandSearchRef: React.RefObject<HTMLDivElement | null>;
  showBrandResults: boolean;
  setShowBrandResults: React.Dispatch<React.SetStateAction<boolean>>;
  brandSearchResults: Brand[];
  giftSearchQuery: string;
  setGiftSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showGiftResults: boolean;
  setShowGiftResults: React.Dispatch<React.SetStateAction<boolean>>;
  giftSearchResults: Product[];
  descriptionEditorRef: React.RefObject<HTMLDivElement | null>;
  isGenerating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onNameChange: (name: string) => void;
  onCheckDuplicateName: (name: string) => void;
  onGenerateAIDescription: () => void;
  createSlug: (text: string) => string;
  execCommand: (cmd: string, val?: string) => void;
  insertImageFromUrl: () => void;
  uploadEditorImage: () => void;
  addImageField: () => void;
  updateImageField: (index: number, value: string) => void;
  removeImageField: (index: number) => void;
  addVideoField: () => void;
  updateVideoField: (index: number, value: string) => void;
  removeVideoField: (index: number) => void;
  addSpecField: () => void;
  updateSpecField: (index: number, field: keyof ProductSpec, value: string) => void;
  removeSpecField: (index: number) => void;
  addVariantField: () => void;
  updateVariantLabel: (index: number, value: string) => void;
  updateVariantOptions: (index: number, value: string) => void;
  removeVariantField: (index: number) => void;
};

export default function ProductEditorModal({
  open,
  editingProduct,
  setEditingProduct,
  duplicateProduct,
  duplicateNameWarning,
  brandSearchRef,
  showBrandResults,
  setShowBrandResults,
  brandSearchResults,
  giftSearchQuery,
  setGiftSearchQuery,
  showGiftResults,
  setShowGiftResults,
  giftSearchResults,
  descriptionEditorRef,
  isGenerating,
  onClose,
  onSubmit,
  onNameChange,
  onCheckDuplicateName,
  onGenerateAIDescription,
  createSlug,
  execCommand,
  insertImageFromUrl,
  uploadEditorImage,
  addImageField,
  updateImageField,
  removeImageField,
  addVideoField,
  updateVideoField,
  removeVideoField,
  addSpecField,
  updateSpecField,
  removeSpecField,
  addVariantField,
  updateVariantLabel,
  updateVariantOptions,
  removeVariantField,
}: ProductEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
        <div className="p-4 md:p-6 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
          <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Cấu hình sản phẩm chính</h2>
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-[11px] font-black uppercase text-[#ee4d2d] border-b pb-2">Thông tin bán hàng</h3>
              <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Tên sản phẩm *</label>
                <input
                  required
                  placeholder="Tên sản phẩm *"
                  className="w-full p-3 bg-slate-50 border text-sm font-bold"
                  value={editingProduct.name || ""}
                  onChange={e => onNameChange(e.target.value)}
                  onBlur={e => onCheckDuplicateName(e.target.value)}
                />
                {duplicateProduct && (
                  <div style={{ color: "red", marginTop: 5 }}>
                    Sản phẩm trùng:{" "}
                    <Link href={`/product/${createSlug(duplicateProduct.name)}-${duplicateProduct.id}`} target="_blank" style={{ textDecoration: "underline", fontWeight: 600 }}>
                      {duplicateProduct.name}
                    </Link>
                  </div>
                )}
                {duplicateNameWarning && <p className="text-red-500 text-xs mt-1">{duplicateNameWarning}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative" ref={brandSearchRef}>
                  <label className="text-[9px] font-black text-slate-400 uppercase">Thương hiệu *</label>
                  <input
                    required
                    placeholder="Tìm thương hiệu..."
                    className="w-full p-3 bg-slate-50 border text-sm font-bold"
                    value={editingProduct.brand || ""}
                    onFocus={() => setShowBrandResults(true)}
                    onChange={e => {
                      setEditingProduct({ ...editingProduct, brand: e.target.value });
                      setShowBrandResults(true);
                    }}
                  />
                  {showBrandResults && brandSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm border-slate-200">
                      {brandSearchResults.map(brand => (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => {
                            setEditingProduct({ ...editingProduct, brand: brand.name });
                            setShowBrandResults(false);
                          }}
                          className="w-full text-left p-3 hover:bg-slate-50 border-b last:border-none text-xs flex items-center gap-3 transition-colors"
                        >
                          <SmartImage src={brand.logoUrl} widthHint={48} heightHint={48} fit="fit" sizes="24px" className="w-6 h-6 object-contain grayscale opacity-60" alt={brand.name} />
                          <span className="font-bold text-slate-700">{brand.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Ngành hàng</label>
                  <select className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}>
                    {Object.values(Category).map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Giá bán (₫) *</label>
                  <input type="number" required placeholder="₫" className="w-full p-3 bg-white border-2 border-[#ee4d2d]/20 text-sm font-black text-[#ee4d2d]" value={editingProduct.price || ""} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Giá gốc (Gạch chân)</label>
                  <input type="number" placeholder="₫" className="w-full p-3 bg-slate-50 border text-sm opacity-60" value={editingProduct.originalPrice || ""} onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Tồn kho</label>
                  <input type="number" placeholder="Kho" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.stock || ""} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng đã bán</label>
                  <input type="number" placeholder="Đã bán" className="w-full p-3 bg-slate-50 border text-sm font-bold text-blue-600" value={editingProduct.soldCount || ""} onChange={e => setEditingProduct({ ...editingProduct, soldCount: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Sao (1-5)</label>
                  <input type="number" placeholder="Đánh giá" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.rating || ""} onChange={e => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Bảo hành (Tháng)</label>
                  <input type="number" placeholder="BH" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.warrantyMonths || ""} onChange={e => setEditingProduct({ ...editingProduct, warrantyMonths: Number(e.target.value) })} />
                </div>
              </div>
            </section>

            <section className="p-4 bg-slate-50 border rounded-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-[11px] font-black uppercase text-slate-900">Ảnh & Video sản phẩm</h3>
                <button type="button" onClick={addImageField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm ảnh</button>
              </div>
              <div className="space-y-2">
                {editingProduct.images?.map((image, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-10 h-10 border bg-white shrink-0">
                      {image ? <SmartImage src={image} widthHint={80} heightHint={80} sizes="40px" className="w-full h-full object-cover" alt={`Ảnh sản phẩm ${index + 1}`} /> : <div className="w-full h-full bg-slate-100" />}
                    </div>
                    <input placeholder="Link ảnh (https://...)" className="flex-1 p-2 bg-white border text-[11px]" value={image} onChange={e => updateImageField(index, e.target.value)} />
                    <ImageUploadButton
                      folder="products"
                      label="Tải"
                      onUploaded={url => updateImageField(index, url)}
                      className="inline-flex items-center gap-1 rounded-sm border border-blue-200 bg-blue-50 px-2 py-2 text-[10px] font-black uppercase text-blue-600"
                    />
                    <button type="button" onClick={() => removeImageField(index)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                ))}

                <div className="pt-4 border-t mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Danh sách Video (YouTube/Drive)</label>
                    <button type="button" onClick={addVideoField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm video</button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.videoUrls?.map((video, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="w-10 h-10 border bg-white shrink-0 flex items-center justify-center">
                          <i className="fa-brands fa-youtube text-red-600 text-lg"></i>
                        </div>
                        <input placeholder="Link video nhúng..." className="flex-1 p-2 bg-white border text-[11px]" value={video} onChange={e => updateVideoField(index, e.target.value)} />
                        <button type="button" onClick={() => removeVideoField(index)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="p-4 bg-slate-50 border rounded-sm space-y-4">
              <h3 className="text-[11px] font-black uppercase text-slate-900 border-b pb-2">Trạng thái kho hàng & Vận chuyển</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Ẩn sản phẩm</span>
                    <span className="text-[8px] text-slate-400 font-bold">Không hiển thị trên shop</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editingProduct.isHidden || false} onChange={e => setEditingProduct({ ...editingProduct, isHidden: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Hết hàng</span>
                    <span className="text-[8px] text-slate-400 font-bold">Hiển nhãn "HẾT HÀNG"</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editingProduct.isOutOfStock || false} onChange={e => setEditingProduct({ ...editingProduct, isOutOfStock: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">Ẩn bảo hành</span>
                    <span className="text-[8px] text-slate-400 font-bold">Tắt thông tin BH</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editingProduct.hideWarranty || false} onChange={e => setEditingProduct({ ...editingProduct, hideWarranty: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#ee4d2d] uppercase tracking-tighter">Hiện Cam Kết</span>
                    <span className="text-[8px] text-slate-400 font-bold">Hiển thị ở mục gợi ý</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editingProduct.showCommitments || false} onChange={e => setEditingProduct({ ...editingProduct, showCommitments: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Miễn phí ship</span>
                    <span className="text-[8px] text-slate-400 font-bold">Freeship SP</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editingProduct.isFreeship || false} onChange={e => setEditingProduct({ ...editingProduct, isFreeship: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              {!editingProduct.isFreeship && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Phí vận chuyển cho SP này (₫) *</label>
                  <input type="number" placeholder="Nhập phí ship" className="w-full p-3 bg-white border text-sm font-bold focus:border-blue-400 outline-none" value={editingProduct.shippingFee || ""} onChange={e => setEditingProduct({ ...editingProduct, shippingFee: Number(e.target.value) })} />
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Thông số kỹ thuật</h3>
                <button type="button" onClick={addSpecField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm dòng</button>
              </div>
              <div className="space-y-2">
                {editingProduct.specs?.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input placeholder="Nhãn" className="w-1/3 p-2 bg-slate-50 border text-[11px] font-bold" value={spec.label} onChange={e => updateSpecField(index, "label", e.target.value)} />
                    <input placeholder="Giá trị" className="w-full p-2 bg-slate-50 border text-[11px]" value={spec.value} onChange={e => updateSpecField(index, "value", e.target.value)} />
                    <button type="button" onClick={() => removeSpecField(index)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="p-4 bg-orange-50 border border-orange-100 rounded-sm space-y-4">
              <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                <h3 className="text-[11px] font-black uppercase text-orange-700 italic flex items-center gap-2">
                  <i className="fa-solid fa-layer-group"></i> Phân loại sản phẩm (Variants)
                </h3>
                <button type="button" onClick={addVariantField} className="text-[9px] font-black text-orange-600 uppercase">+ Thêm phân loại</button>
              </div>
              <div className="space-y-4">
                {editingProduct.variants?.map((variant, index) => (
                  <div key={index} className="p-3 bg-white border rounded-sm space-y-3 relative group">
                    <button type="button" onClick={() => removeVariantField(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400">Tên phân loại (VD: Màu sắc, Dung lượng)</label>
                      <input placeholder="Nhãn phân loại" className="w-full p-2 bg-slate-50 border text-[11px] font-bold" value={variant.label} onChange={e => updateVariantLabel(index, e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400">Các tùy chọn (Phân cách bằng dấu phẩy)</label>
                      <input placeholder="Đen, Trắng, Vàng..." className="w-full p-2 bg-slate-50 border text-[11px]" value={variant.options.join(",")} onChange={e => updateVariantOptions(index, e.target.value)} />
                    </div>
                  </div>
                ))}
                {(!editingProduct.variants || editingProduct.variants.length === 0) && (
                  <p className="text-[10px] text-orange-400 italic text-center py-2">Sản phẩm chưa có phân loại (Ví dụ: Màu sắc, Size...)</p>
                )}
              </div>
            </section>

            <section className="p-4 bg-blue-50 border border-blue-100 rounded-sm space-y-4">
              <h3 className="text-[11px] font-black uppercase text-blue-700 italic border-b border-blue-200 pb-2 flex items-center gap-2">
                <i className="fa-solid fa-gift"></i> Chương trình Mua X Tặng Y
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng mua (X)</label>
                  <input type="number" placeholder="VD: 2" className="w-full p-3 bg-white border text-sm" value={editingProduct.promoBuyQty || ""} onChange={e => setEditingProduct({ ...editingProduct, promoBuyQty: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng tặng (Y)</label>
                  <input type="number" placeholder="VD: 1" className="w-full p-3 bg-white border text-sm" value={editingProduct.promoGetQty || ""} onChange={e => setEditingProduct({ ...editingProduct, promoGetQty: Number(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[9px] font-black text-slate-400 uppercase">Chọn sản phẩm quà tặng trên kệ</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      placeholder="Gõ tên sản phẩm cần tặng..."
                      className="w-full p-3 bg-white border text-xs"
                      value={giftSearchQuery}
                      onChange={e => {
                        setGiftSearchQuery(e.target.value);
                        setShowGiftResults(true);
                      }}
                    />
                    {showGiftResults && giftSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border shadow-xl z-[150] max-h-48 overflow-y-auto rounded-sm">
                        {giftSearchResults.map(product => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setEditingProduct({ ...editingProduct, promoGiftProductId: product.id, promoGiftName: product.name });
                              setGiftSearchQuery(product.name);
                              setShowGiftResults(false);
                            }}
                            className="w-full text-left p-3 hover:bg-blue-50 border-b text-xs flex items-center gap-2 transition-colors"
                          >
                            <SmartImage src={product.images[0]} widthHint={48} heightHint={48} sizes="24px" className="w-6 h-6 object-cover rounded-sm" alt={product.name} />
                            <span className="truncate font-medium">{product.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({ ...editingProduct, promoGiftProductId: undefined, promoGiftName: "" });
                      setGiftSearchQuery("");
                    }}
                    className="px-3 bg-slate-100 text-slate-400 hover:text-red-500 rounded-sm"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase">Hoặc nhập tên quà tặng thủ công</label>
                <input
                  disabled={!!editingProduct.promoGiftProductId}
                  placeholder="VD: Bao da cao cấp..."
                  className="w-full p-3 bg-white border text-sm disabled:bg-slate-50 disabled:opacity-50"
                  value={editingProduct.promoGiftName || ""}
                  onChange={e => setEditingProduct({ ...editingProduct, promoGiftName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-pink-600 uppercase italic">Bắt đầu tặng</label>
                  <input type="datetime-local" className="w-full p-2.5 bg-white border text-[10px]" value={editingProduct.giftStartDate || ""} onChange={e => setEditingProduct({ ...editingProduct, giftStartDate: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-pink-600 uppercase italic">Kết thúc tặng</label>
                  <input type="datetime-local" className="w-full p-2.5 bg-white border text-[10px]" value={editingProduct.giftEndDate || ""} onChange={e => setEditingProduct({ ...editingProduct, giftEndDate: e.target.value })} />
                </div>
              </div>
            </section>

            <section className="p-4 bg-purple-50 border border-purple-100 rounded-sm space-y-4">
              <div className="flex justify-between items-center border-b border-purple-200 pb-2">
                <h3 className="text-[11px] font-black uppercase text-purple-700 italic flex items-center gap-2">
                  <i className="fa-solid fa-bolt-lightning text-yellow-500"></i> XẢ HÀNG SIÊU SỐC
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={editingProduct.isShockSale || false} onChange={e => setEditingProduct({ ...editingProduct, isShockSale: e.target.checked })} />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              {editingProduct.isShockSale && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[9px] font-black text-purple-500 uppercase">Giá Xả Kho Siêu Sốc (₫) *</label>
                  <input type="number" required placeholder="Nhập giá xả kho cực rẻ" className="w-full p-3 bg-white border-2 border-purple-300 text-sm font-black text-purple-700" value={editingProduct.shockSalePrice || ""} onChange={e => setEditingProduct({ ...editingProduct, shockSalePrice: Number(e.target.value) })} />
                </div>
              )}
            </section>

            <section className="p-4 bg-pink-50 border border-pink-100 rounded-sm space-y-3">
              <h3 className="text-[11px] font-black uppercase text-pink-700 italic border-b border-pink-200 pb-2">Quà tặng đặc quyền</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">Tên quà tặng</label>
                  <input placeholder="Tên quà" className="w-full p-3 bg-white border border-pink-200 text-sm font-black" value={editingProduct.giftName || ""} onChange={e => setEditingProduct({ ...editingProduct, giftName: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">URL Ảnh Quà</label>
                  <input placeholder="URL Ảnh Quà" className="w-full p-3 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftImage || ""} onChange={e => setEditingProduct({ ...editingProduct, giftImage: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-pink-600 uppercase italic">Bắt đầu tặng</label>
                    <input type="datetime-local" className="w-full p-2.5 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftStartDate || ""} onChange={e => setEditingProduct({ ...editingProduct, giftStartDate: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-pink-600 uppercase italic">Kết thúc tặng</label>
                    <input type="datetime-local" className="w-full p-2.5 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftEndDate || ""} onChange={e => setEditingProduct({ ...editingProduct, giftEndDate: e.target.value })} />
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Mô tả chi tiết sản phẩm</h3>
                <button type="button" onClick={onGenerateAIDescription} className="bg-blue-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase flex items-center gap-2 hover:bg-blue-700">
                  <i className={`fa-solid ${isGenerating ? "fa-spinner animate-spin" : "fa-wand-magic-sparkles"}`}></i>
                  {isGenerating ? "AI đang viết..." : "AI mô tả"}
                </button>
              </div>

              <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
                <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                  <button type="button" onClick={() => execCommand("bold")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold">B</button>
                  <button type="button" onClick={() => execCommand("italic")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic">I</button>
                  <button type="button" onClick={() => execCommand("underline")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs underline">U</button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={() => execCommand("insertUnorderedList")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-list-ul"></i></button>
                  <button type="button" onClick={() => execCommand("insertOrderedList")} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-list-ol"></i></button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button type="button" title="Chèn ảnh bằng URL" onClick={insertImageFromUrl} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-blue-600"><i className="fa-solid fa-image"></i></button>
                  <button type="button" title="Tải ảnh từ máy" onClick={uploadEditorImage} className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-blue-600 text-xs"><i className="fa-solid fa-cloud-arrow-up"></i></button>
                </div>
                <div ref={descriptionEditorRef} contentEditable className="p-5 min-h-[15rem] max-h-[30rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white" spellCheck={false}></div>
              </div>
            </section>

            <div className="pt-4 sticky bottom-0 bg-white pb-2 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-slate-200 transition-colors">Đóng</button>
              <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs shadow-xl tracking-widest rounded-sm hover:bg-[#d73211] transition-colors">Lưu Sản Phẩm</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

