import React from 'react';
import SmartImage from '../SmartImage';
import { AppConfig, HomePopup } from '../../types';

export function PopupSection({
  tempHomePopup,
  setTempHomePopup,
  onSave,
}: {
  tempHomePopup: HomePopup;
  setTempHomePopup: React.Dispatch<React.SetStateAction<HomePopup>>;
  onSave: () => void;
}) {
  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
      <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
        <i className="fa-solid fa-window-maximize text-[#ee4d2d]"></i> Cấu hình Popup Quảng Cáo
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-sm">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Trạng thái Popup</span>
              <span className="text-[10px] text-slate-400 font-bold">Bật/Tắt hiển thị toàn trang chủ</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={tempHomePopup.isActive} onChange={(e) => setTempHomePopup({ ...tempHomePopup, isActive: e.target.checked })} />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Link ảnh Popup *</label>
            <input className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.imageUrl} onChange={(e) => setTempHomePopup({ ...tempHomePopup, imageUrl: e.target.value })} placeholder="https://..." />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Link liên kết (Khi khách click)</label>
            <input className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.link} onChange={(e) => setTempHomePopup({ ...tempHomePopup, link: e.target.value })} placeholder="/flash-sales" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Thời gian bắt đầu</label>
              <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.startDate || ''} onChange={(e) => setTempHomePopup({ ...tempHomePopup, startDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Thời gian kết thúc</label>
              <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.endDate || ''} onChange={(e) => setTempHomePopup({ ...tempHomePopup, endDate: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Xem trước Popup</h3>
          <div className="bg-slate-100 p-8 rounded-sm border-2 border-dashed flex items-center justify-center min-h-[350px]">
            {tempHomePopup.imageUrl ? (
              <div className="relative max-w-[200px] shadow-2xl rounded-sm overflow-hidden border-2 border-white">
                <SmartImage src={tempHomePopup.imageUrl} widthHint={400} heightHint={500} sizes="200px" className="w-full h-auto" alt="Xem trước popup" />
                <div className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-[8px]"><i className="fa-solid fa-xmark"></i></div>
              </div>
            ) : (
              <span className="text-slate-400 italic text-xs uppercase font-bold">Chưa có ảnh cấu hình</span>
            )}
          </div>
        </div>
      </div>
      <button onClick={onSave} className="w-full py-5 bg-slate-900 text-white font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:bg-black transition-all">Lưu Cấu Hình Popup</button>
    </div>
  );
}

export function AppConfigSection({
  tempAppConfig,
  setTempAppConfig,
  onSave,
}: {
  tempAppConfig: AppConfig;
  setTempAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onSave: () => void;
}) {
  return (
    <div className="max-w-4xl space-y-10">
      <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
        <i className="fa-solid fa-gears text-[#ee4d2d]"></i> Cấu hình Ứng dụng & Liên hệ
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <section className="space-y-4 bg-slate-50 p-4 rounded-sm border">
            <h3 className="text-[10px] font-black uppercase text-slate-900 border-b pb-2 flex items-center gap-2">
              <i className="fa-solid fa-headset text-[#ee4d2d]"></i> Thông tin liên hệ CSKH
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Đường dẫn Zalo (https://zalo.me/...)</label>
                <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.zaloUrl || ''} onChange={(e) => setTempAppConfig({ ...tempAppConfig, zaloUrl: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Đường dẫn Messenger (https://m.me/...)</label>
                <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.messengerUrl || ''} onChange={(e) => setTempAppConfig({ ...tempAppConfig, messengerUrl: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Số Hotline</label>
                <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.hotline || ''} onChange={(e) => setTempAppConfig({ ...tempAppConfig, hotline: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Link đăng ký Bộ Công Thương</label>
                <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.bctUrl || ''} onChange={(e) => setTempAppConfig({ ...tempAppConfig, bctUrl: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="space-y-6 bg-white p-4 rounded-sm border">
            <h3 className="text-[10px] font-black uppercase text-slate-900 border-b pb-2 flex items-center gap-2">
              <i className="fa-solid fa-image text-[#ee4d2d]"></i> Tinh chỉnh Logo Navbar
            </h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">URL Logo Shop</label>
              <input className="w-full p-3 bg-slate-50 border text-sm focus:border-[#ee4d2d] outline-none" placeholder="https://..." value={tempAppConfig.logoUrl || ''} onChange={(e) => setTempAppConfig({ ...tempAppConfig, logoUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-slate-400">Kích thước Logo (To/Nhỏ)</label>
                <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoScale || 1}x</span>
              </div>
              <input type="range" min="0.5" max="3" step="0.1" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ee4d2d]" value={tempAppConfig.logoScale || 1} onChange={(e) => setTempAppConfig({ ...tempAppConfig, logoScale: parseFloat(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-slate-400">Vị trí Ngang (X)</label>
                  <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoX || 0}px</span>
                </div>
                <input type="range" min="-100" max="100" step="1" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" value={tempAppConfig.logoX || 0} onChange={(e) => setTempAppConfig({ ...tempAppConfig, logoX: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-slate-400">Vị trí Dọc (Y)</label>
                  <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoY || 0}px</span>
                </div>
                <input type="range" min="-50" max="50" step="1" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" value={tempAppConfig.logoY || 0} onChange={(e) => setTempAppConfig({ ...tempAppConfig, logoY: parseInt(e.target.value) })} />
              </div>
            </div>
          </section>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">QR Code Tải App</label>
            <input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.qrCodeUrl} onChange={(e) => setTempAppConfig({ ...tempAppConfig, qrCodeUrl: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400">iOS App Store</label><input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.appStoreUrl} onChange={(e) => setTempAppConfig({ ...tempAppConfig, appStoreUrl: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400">Android Google Play</label><input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.googlePlayUrl} onChange={(e) => setTempAppConfig({ ...tempAppConfig, googlePlayUrl: e.target.value })} /></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Xem trước hiển thị Navbar</h3>
          <div className="bg-[#ee4d2d] p-10 rounded-sm border-4 border-slate-200 flex items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-black text-white/40 uppercase">Mô phỏng Thanh Navbar thực tế</div>
            {tempAppConfig.logoUrl ? (
              <div className="h-14 flex items-center justify-center bg-white/5 border border-white/10 px-10 relative overflow-visible" style={{ width: '280px' }}>
                <SmartImage src={tempAppConfig.logoUrl} widthHint={280} heightHint={56} fit="fit" sizes="280px" className="w-auto h-full object-contain pointer-events-none" style={{ transform: `translate(${tempAppConfig.logoX || 0}px, ${tempAppConfig.logoY || 0}px) scale(${tempAppConfig.logoScale || 1})`, transformOrigin: 'center center', maxWidth: 'none' }} alt="Xem trước logo" />
              </div>
            ) : (
              <div className="text-white/40 italic text-xs font-bold uppercase tracking-widest text-center">Chưa có Logo<br />Vui lòng nhập link bên cạnh</div>
            )}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
              <div className="h-2 w-1/3 bg-white/20 rounded-full"></div>
              <div className="h-2 w-1/3 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-sm border border-orange-100">
            <p className="text-[10px] font-bold text-orange-700 italic">
              * Lưu ý: Khi chỉnh Logo "Lên/Xuống" hoặc "To/Nhỏ", hãy đảm bảo Logo không che mất các thành phần khác trên thanh Navbar thực tế của website.
            </p>
          </div>
        </div>
      </div>
      <button onClick={onSave} className="w-full py-5 bg-slate-900 text-white font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-black active:scale-[0.99] transition-all">Lưu & Cố định cấu hình</button>
    </div>
  );
}
