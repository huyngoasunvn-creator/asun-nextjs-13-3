import React from 'react';
import SmartImage from '../SmartImage';
import {
  AppConfig,
  Banner,
  Brand,
  Category,
  CategoryTheme,
  Commitment,
  HomePopup,
  StockAlert,
} from '../../types';

export function AlertsSection({
  stockAlerts,
  onDelete,
}: {
  stockAlerts: StockAlert[];
  onDelete: (alertId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
        <i className="fa-solid fa-bell text-[#ee4d2d]"></i> Yêu cầu báo hàng ({stockAlerts.length})
      </h2>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Thông tin liên hệ</th>
              <th className="px-6 py-4">Thời gian đăng ký</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stockAlerts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-xs text-slate-800">{alert.productName}</div>
                    <div className="text-[9px] text-slate-400 uppercase font-mono">ID: {alert.productId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-xs text-[#ee4d2d]">{alert.contact}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(alert.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${alert.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {alert.status === 'pending' ? 'Chờ báo hàng' : 'Đã thông báo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(alert.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa yêu cầu</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {stockAlerts.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có yêu cầu báo hàng nào</div>
        )}
      </div>
    </div>
  );
}

export function BrandsSection({
  brands,
  onCreate,
  onEdit,
  onDelete,
}: {
  brands: Brand[];
  onCreate: () => void;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic">Thương hiệu đối tác</h2>
        <button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Thương Hiệu</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="border p-4 rounded-sm flex flex-col items-center gap-3">
            <SmartImage src={brand.logoUrl} widthHint={120} heightHint={40} fit="fit" sizes="80px" className="h-10 object-contain" alt={brand.name} />
            <div className="font-bold text-xs uppercase">{brand.name}</div>
            <div className="flex gap-4 text-[9px] font-black">
              <button onClick={() => onEdit(brand)} className="text-blue-600">SỬA</button>
              <button onClick={() => onDelete(brand.id)} className="text-red-500">XÓA</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoriesSection({
  categories,
  categoryConfigs,
  visibleCategories,
  categoryThemes,
  onOrderChange,
  onToggleVisibility,
  onEditTheme,
  onCreateTheme,
}: {
  categories: Category[];
  categoryConfigs: Array<{ category: Category; order: number }>;
  visibleCategories: Category[];
  categoryThemes: CategoryTheme[];
  onOrderChange: (category: Category, value: string) => void;
  onToggleVisibility: (category: Category) => void;
  onEditTheme: (theme: CategoryTheme) => void;
  onCreateTheme: (category: Category) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase italic mb-8 border-b pb-4 flex items-center gap-3"><i className="fa-solid fa-list text-[#ee4d2d]"></i> Hiển thị & Thứ tự ngành hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const config = categoryConfigs.find((item) => item.category === category) || { category, order: 99 };
          const isVisible = visibleCategories.includes(category);
          const theme = categoryThemes.find((item) => item.category === category);

          return (
            <div key={category} className={`p-4 border rounded-sm flex flex-col gap-4 transition-all shadow-sm ${isVisible ? 'bg-white border-slate-200' : 'bg-slate-50 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-slate-400">Thứ tự</label>
                    <input type="number" min="1" className="w-14 p-1.5 border rounded-sm text-[11px] font-black text-center focus:border-[#ee4d2d] outline-none" value={config.order} onChange={(e) => onOrderChange(category, e.target.value)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">{category}</span>
                    <span className={`text-[8px] font-bold uppercase ${isVisible ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>
                </div>
                <button onClick={() => onToggleVisibility(category)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVisible ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <i className={`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>

              {theme ? (
                <div className="pt-2 border-t flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <SmartImage src={theme.image} widthHint={96} heightHint={64} sizes="48px" className="w-12 h-8 object-cover rounded-sm border" alt={theme.category} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black text-slate-400 uppercase truncate">Banner: {theme.image}</p>
                      <p className="text-[9px] font-bold text-slate-600 italic truncate">"{theme.slogan}"</p>
                    </div>
                  </div>
                  <button onClick={() => onEditTheme(theme)} className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase rounded-sm hover:bg-[#ee4d2d] transition-colors shrink-0">Sửa Banner</button>
                </div>
              ) : (
                <div className="pt-2 border-t flex justify-end">
                  <button onClick={() => onCreateTheme(category)} className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-sm hover:bg-[#ee4d2d] transition-colors">+ Thêm Banner</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CommitmentsSection({
  commitments,
  onCreate,
  onEdit,
  onDelete,
}: {
  commitments: Commitment[];
  onCreate: () => void;
  onEdit: (commitment: Commitment) => void;
  onDelete: (commitmentId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-xl font-black uppercase italic">Cam kết dịch vụ</h2><button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Cam Kết</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{commitments.map((commitment) => (<div key={commitment.id} className="border p-6 rounded-sm space-y-4"><div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border text-blue-600"><i className={`fa-solid ${commitment.icon} text-xl`}></i></div><div><h3 className="font-black text-sm uppercase">{commitment.title}</h3><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{commitment.desc}</p></div><div className="flex gap-4 text-[9px] font-black"><button onClick={() => onEdit(commitment)} className="text-blue-600">SỬA</button><button onClick={() => onDelete(commitment.id)} className="text-red-500">XÓA</button></div></div>))}</div>
    </div>
  );
}

export function BannersSection({
  banners,
  onCreate,
  onEdit,
  onDelete,
}: {
  banners: Banner[];
  onCreate: () => void;
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic">Quản lý Banners</h2>
        <button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Banner</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className={`border rounded-sm overflow-hidden ${!banner.isActive ? 'opacity-50 grayscale' : ''}`}>
            <SmartImage src={banner.imageUrl} widthHint={640} heightHint={320} sizes="(max-width: 768px) 100vw, 50vw" className="h-40 w-full object-cover" alt={banner.title || 'Banner'} />
            <div className="p-4 flex justify-between items-center bg-slate-50">
              <div>
                <div className="font-black text-xs uppercase">{banner.title || 'Banner không tiêu đề'}</div>
                <div className="text-[9px] font-bold text-slate-400 italic">
                  Loại: {banner.position === 'main' ? 'Slide Ngang (Băng tải chính)' : 'Slide Dọc (Cạnh Slide chính)'} | {banner.isActive ? 'Đang hiện' : 'Đang ẩn'}
                </div>
              </div>
              <div className="flex gap-4 text-[9px] font-black">
                <button onClick={() => onEdit(banner)} className="text-blue-600 uppercase">Sửa</button>
                <button onClick={() => onDelete(banner.id)} className="text-red-500 uppercase">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
