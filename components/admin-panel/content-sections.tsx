import React from 'react';
import SmartImage from '../SmartImage';
import { BlogPost, Coupon, CustomMenu, Order, Review } from '../../types';

type CustomMenusSectionProps = {
  customMenus: CustomMenu[];
  onCreate: () => void;
  onEdit: (menu: CustomMenu) => void;
  onDelete: (menuId: string) => void;
};

export function CustomMenusSection({
  customMenus,
  onCreate,
  onEdit,
  onDelete,
}: CustomMenusSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Quản lý Menu ẩn (Trang nhúng)</h2>
        <button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black transition-all">Thêm Menu mới</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr>
              <th className="px-6 py-4">Tên Menu</th>
              <th className="px-6 py-4">URL nguồn</th>
              <th className="px-6 py-4">Đường dẫn Asun</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customMenus.map((menu) => (
              <tr key={menu.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800 uppercase">{menu.title}</td>
                <td className="px-6 py-4 text-xs text-blue-500 truncate max-w-xs">{menu.url}</td>
                <td className="px-6 py-4 text-xs font-mono">/p/{menu.slug}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${menu.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {menu.isActive ? 'Đang hiện' : 'Đang ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button onClick={() => onEdit(menu)} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa</button>
                  <button onClick={() => onDelete(menu.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customMenus.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có menu ẩn nào được tạo</div>
        )}
      </div>
    </div>
  );
}

type OrdersSectionProps = {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
};

export function OrdersSection({ orders, onViewOrder, onUpdateStatus }: OrdersSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase italic tracking-tighter">Đơn hàng hiện tại ({orders.length})</h2>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Tổng cộng</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-xs uppercase text-[#ee4d2d]">#{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-xs">{order.customerName}</div>
                  <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                </td>
                <td className="px-6 py-4 font-black text-slate-900">₫{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                    className={`text-[9px] font-black border rounded p-1.5 outline-none uppercase transition-colors ${
                      order.status === 'Đã giao'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : order.status === 'Đã hủy'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}
                  >
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onViewOrder(order)} className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-sm hover:bg-black transition-all shadow-sm">
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có đơn hàng nào phát sinh</div>
        )}
      </div>
    </div>
  );
}

type ReviewsSectionProps = {
  reviews: Review[];
  currentReviews: Review[];
  currentReviewPage: number;
  totalReviewPages: number;
  products: { id: string; name: string; images: string[] }[];
  onCreateReview: () => void;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  onPageChange: (page: number) => void;
};

export function ReviewsSection({
  reviews,
  currentReviews,
  currentReviewPage,
  totalReviewPages,
  products,
  onCreateReview,
  onEditReview,
  onDeleteReview,
  onPageChange,
}: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-black uppercase italic shrink-0">Quản lý Đánh giá ({reviews.length})</h2>
        <button onClick={onCreateReview} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black transition-all">
          Thêm đánh giá thủ công
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Đánh giá</th>
              <th className="px-6 py-4">Thời gian tạo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentReviews.map((review) => {
              const product = products.find((item) => item.id === review.productId);
              return (
                <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <SmartImage src={product?.images[0] || ''} widthHint={64} heightHint={64} sizes="32px" className="w-8 h-8 object-cover rounded-sm border" alt={product?.name || 'Sản phẩm'} />
                      <div className="font-bold text-xs truncate max-w-[200px]">{product?.name || 'Sản phẩm đã xóa'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-xs text-slate-800">{review.userName}</div>
                    {review.isManual && <span className="text-[8px] font-black text-blue-600 uppercase italic">(Admin thêm)</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-400 mb-1">
                      {[...Array(5)].map((_, index) => <i key={index} className={`fa-star ${index < review.rating ? 'fa-solid' : 'fa-regular'}`}></i>)}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{review.comment}"</p>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(review.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button onClick={() => onEditReview(review)} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa</button>
                    <button onClick={() => onDeleteReview(review.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có đánh giá nào</div>
        )}
      </div>

      {totalReviewPages > 1 && (
        <div className="pt-8 flex flex-wrap justify-center items-center gap-2">
          <button disabled={currentReviewPage === 1} onClick={() => onPageChange(Math.max(1, currentReviewPage - 1))} className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200">
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </button>
          {[...Array(totalReviewPages)].map((_, index) => (
            <button key={index} onClick={() => onPageChange(index + 1)} className={`w-8 h-8 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all ${currentReviewPage === index + 1 ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentReviewPage === totalReviewPages} onClick={() => onPageChange(Math.min(totalReviewPages, currentReviewPage + 1))} className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200">
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
          <span className="ml-4 text-[10px] font-black uppercase text-slate-400 italic">Trang {currentReviewPage} / {totalReviewPages}</span>
        </div>
      )}
    </div>
  );
}

type BlogSectionProps = {
  blogPosts: BlogPost[];
  onCreate: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
};

export function BlogSection({ blogPosts, onCreate, onEdit, onDelete }: BlogSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Quản lý Bài viết Blog ({blogPosts.length})</h2>
        <button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black">Viết bài mới</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white border rounded-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all shadow-sm">
            <SmartImage src={post.image} widthHint={720} heightHint={405} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-video w-full object-cover" alt={post.title} />
            <div className="p-5 flex-grow space-y-3">
              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase italic">
                <span>{post.category}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <h3 className="text-sm font-black text-slate-800 line-clamp-2 uppercase italic tracking-tighter group-hover:text-[#ee4d2d]">{post.title}</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                <span><i className="fa-solid fa-eye mr-1"></i> {post.views}</span>
                <span><i className="fa-solid fa-link mr-1"></i> {post.relatedProductIds?.length || 0} SP liên kết</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-between gap-4">
              <button onClick={() => onEdit(post)} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa bài</button>
              <button onClick={() => onDelete(post.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      {blogPosts.length === 0 && (
        <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có bài viết nào</div>
      )}
    </div>
  );
}

type MarketingSectionProps = {
  coupons: Coupon[];
  onCreate: () => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (couponId: string) => void;
};

export function MarketingSection({ coupons, onCreate, onEdit, onDelete }: MarketingSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic">Quản lý Mã giảm giá</h2>
        <button onClick={onCreate} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Tạo mã mới</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isFreeship = coupon.type === 'freeship';
          return (
            <div key={coupon.id} className={`bg-white border-2 border-dashed p-6 rounded-sm relative flex flex-col justify-between hover:shadow-lg transition-all group ${isFreeship ? 'border-emerald-200' : 'border-slate-200'}`}>
              <div>
                <div className="flex justify-between items-start">
                  <div className={`text-2xl font-black mb-1 group-hover:scale-105 transition-transform flex items-center gap-2 ${isFreeship ? 'text-emerald-600' : 'text-[#ee4d2d]'}`}>
                    <i className={`fa-solid ${isFreeship ? 'fa-truck-fast' : 'fa-tag'} text-base opacity-70`}></i>
                    {coupon.code}
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${coupon.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {coupon.isActive ? 'Đang chạy' : 'Dừng'}
                  </span>
                </div>
                <div className={`text-sm font-bold ${isFreeship ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {isFreeship ? 'Miễn phí vận chuyển' : (coupon.type === 'fixed' ? `Giảm ₫${coupon.value.toLocaleString()}` : `Giảm ${coupon.value}%`)}
                  {coupon.type === 'percent' && coupon.maxDiscount && (
                    <span className="text-[10px] text-slate-400 block font-normal">(Giảm tối đa ₫{coupon.maxDiscount.toLocaleString()})</span>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${isFreeship ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>PHẠM VI</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {coupon.scope === 'all' ? 'Toàn sàn' : coupon.scope === 'category' ? `Ngành hàng (${coupon.applicableCategories?.join(', ')})` : 'Một sản phẩm cụ thể'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${isFreeship ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>ĐIỀU KIỆN</span>
                    <span className="text-[10px] font-bold text-slate-500">Đơn từ ₫{coupon.minOrder.toLocaleString()}</span>
                  </div>
                  {(coupon.startDate || coupon.endDate) && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-sm uppercase tracking-tighter">THỜI GIAN</span>
                      <span className="text-[10px] font-bold text-orange-500 italic">
                        {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : '...'} - {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : '...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-4 text-[10px] font-black border-t pt-4">
                <button onClick={() => onEdit(coupon)} className="text-blue-600 uppercase hover:underline">Sửa mã</button>
                <button onClick={() => onDelete(coupon.id)} className="text-red-500 uppercase hover:underline">Xóa</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
