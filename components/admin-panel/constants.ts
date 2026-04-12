export type AdminTab =
  | 'products'
  | 'orders'
  | 'reviews'
  | 'blog'
  | 'customMenus'
  | 'marketing'
  | 'brands'
  | 'categories'
  | 'banners'
  | 'commitments'
  | 'app'
  | 'alerts'
  | 'popup';

export const REVIEW_TAGS = [
  'Chất lượng tốt',
  'Giao hàng nhanh',
  'Màu sắc đẹp',
  'Đóng gói cẩn thận',
  'Tư vấn nhiệt tình',
];

export const ADMIN_TABS: Array<{ id: AdminTab; label: string; icon: string }> = [
  { id: 'products', label: 'Sản phẩm', icon: 'fa-box' },
  { id: 'orders', label: 'Đơn hàng', icon: 'fa-receipt' },
  { id: 'reviews', label: 'Đánh giá', icon: 'fa-comments' },
  { id: 'blog', label: 'Tin tức/Blog', icon: 'fa-newspaper' },
  { id: 'customMenus', label: 'Menu ẩn', icon: 'fa-link' },
  { id: 'popup', label: 'Popup Ads', icon: 'fa-window-maximize' },
  { id: 'marketing', label: 'Coupons', icon: 'fa-ticket' },
  { id: 'alerts', label: 'Báo hàng', icon: 'fa-bell' },
  { id: 'brands', label: 'Thương hiệu', icon: 'fa-tags' },
  { id: 'commitments', label: 'Cam kết', icon: 'fa-shield-check' },
  { id: 'categories', label: 'Ngành hàng', icon: 'fa-list' },
  { id: 'banners', label: 'Banners', icon: 'fa-images' },
  { id: 'app', label: 'Cấu hình App', icon: 'fa-gears' },
];
