import React from "react";
import SmartImage from "../SmartImage";
import { Product } from "../../types";

type ProductManagementSectionProps = {
  products: Product[];
  currentItems: Product[];
  adminProductSearch: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onCopy: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onQuickUpdateSoldCount: (product: Product, value: string) => void;
  onQuickToggleHidden: (product: Product) => void;
  onQuickToggleOutOfStock: (product: Product) => void;
};

export default function ProductManagementSection({
  products,
  currentItems,
  adminProductSearch,
  currentPage,
  totalPages,
  onSearchChange,
  onPageChange,
  onCreate,
  onCopy,
  onEdit,
  onDelete,
  onQuickUpdateSoldCount,
  onQuickToggleHidden,
  onQuickToggleOutOfStock,
}: ProductManagementSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <h2 className="text-xl font-black uppercase italic shrink-0">Sản phẩm ({products.length})</h2>
          <div className="relative w-full md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Tìm theo tên, thương hiệu..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-sm text-xs outline-none focus:border-[#ee4d2d] transition-all"
              value={adminProductSearch}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={onCreate}
          className="w-full md:w-auto bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black transition-all"
        >
          Thêm mới sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4 text-center">Lượt bán</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác nhanh</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-slate-50 transition-colors ${product.isHidden ? "bg-slate-50/50" : ""}`}
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <SmartImage
                    src={product.images[0]}
                    widthHint={80}
                    heightHint={80}
                    sizes="40px"
                    className={`w-10 h-10 object-cover rounded-sm border ${product.isHidden ? "opacity-30 grayscale" : ""}`}
                    alt={product.name}
                  />
                  <div>
                    <div className={`font-bold ${product.isHidden ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {product.name}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">
                      {product.category} | {product.brand}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                      Số lượt bán
                    </label>
                    <input
                      type="number"
                      className="w-16 p-1.5 border rounded-sm text-center text-xs font-black text-blue-600 focus:border-blue-400 outline-none shadow-sm"
                      defaultValue={product.soldCount}
                      onBlur={(e) => onQuickUpdateSoldCount(product, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                </td>
                <td className={`px-6 py-4 font-black ${product.isHidden ? "text-slate-300" : "text-[#ee4d2d]"}`}>
                  ₫{product.price.toLocaleString()}
                  
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {product.isHidden && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-black rounded-sm uppercase tracking-widest">
                        <i className="fa-solid fa-eye-slash mr-1"></i> ĐÃ ẨN
                      </span>
                    )}
                    {product.isOutOfStock && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black rounded-sm uppercase tracking-widest">
                        <i className="fa-solid fa-box-archive mr-1"></i> HẾT HÀNG
                      </span>
                    )}
                    {!product.isHidden && !product.isOutOfStock && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-sm uppercase tracking-widest">
                        ĐANG BÁN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => onQuickToggleHidden(product)}
                      title={product.isHidden ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${product.isHidden ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                    >
                      <i className={`fa-solid ${product.isHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                    <button
                      onClick={() => onQuickToggleOutOfStock(product)}
                      title={product.isOutOfStock ? "Báo còn hàng" : "Báo hết hàng"}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${product.isOutOfStock ? "bg-red-600 text-white shadow-md" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    >
                      <i className={`fa-solid ${product.isOutOfStock ? "fa-box-archive" : "fa-box"}`}></i>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onCopy(product)}
                    className="text-emerald-600 font-black text-[10px] uppercase mr-4 hover:underline flex-inline items-center gap-1"
                  >
                    <i className="fa-solid fa-copy text-[9px]"></i> Copy
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 font-black text-[10px] uppercase mr-4 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 font-black text-[10px] uppercase hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentItems.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs">Không tìm thấy sản phẩm nào</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pt-8 flex flex-wrap justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all ${currentPage === index + 1 ? "bg-[#ee4d2d] text-white border-[#ee4d2d]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
          >
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>

          <span className="ml-4 text-[10px] font-black uppercase text-slate-400 italic">
            Trang {currentPage} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
