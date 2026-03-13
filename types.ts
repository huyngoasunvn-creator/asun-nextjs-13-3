
export enum Category {
  SMARTPHONES = 'Điện thoại',
  LAPTOPS = 'Máy tính xách tay',
  AUDIO = 'Thiết thiết bị âm thanh',
  HOME_APPLIANCES = 'Đồ gia dụng',
  WEARABLES = 'Đồng hồ thông minh',
  WATER_PURIFIER = 'Lọc nước',
  ELECTRONICS = 'Điện máy',
  GROCERY = 'Bách hóa',
  FASHION = 'Thời trang',
  BEAUTY = 'Sức khỏe & Sắc đẹp',
  TOYS = 'Đồ chơi',
  HOME_LIFE = 'Nhà cửa - Đời sống',
  OTHERS = 'Ngành hàng khác'
}

export interface CustomMenu {
  id: string;
  title: string;
  url: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  tags: string[];
  images: string[];
  createdAt: string;
  isManual?: boolean; // Flag cho đánh giá admin thêm thủ công
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  videoUrl?: string; // Bổ sung link video cho blog
  author: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
  relatedProductIds: string[];
  views: number;
}

export interface CategoryConfig {
  category: Category;
  order: number;
}

export interface CategoryTheme {
  category: Category;
  image: string;
  color: string;
  slogan: string;
  accentClass: string;
  bgClass: string;
}

export interface HomePopup {
  imageUrl: string;
  link: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AppConfig {
  qrCodeUrl: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  logoUrl?: string;
  logoScale?: number;
  logoX?: number;
  logoY?: number;
  zaloUrl?: string;
  messengerUrl?: string;
  hotline?: string;
  bctUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  link: string;
  isActive: boolean;
  position: 'main' | 'side';
}

export interface Commitment {
  id: string;
  icon: string;
  title: string;
  desc: string;
  highlight?: string;
  detail: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  label: string;
  options: string[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percent' | 'freeship';
  value: number;
  maxDiscount?: number; // Số tiền giảm tối đa cho mã %
  minOrder: number;
  expiryDate: string; // Used as fallback or legacy
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  scope: 'all' | 'category' | 'product';
  applicableCategories?: string[]; // Support multiple categories
  productId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'cart' | 'price_drop' | 'system' | 'promotion';
  link: string;
  isRead: boolean;
  createdAt: string;
  image?: string;
}

export interface InvoiceData {
  type: 'personal' | 'company';
  name: string;
  address: string;
  email: string;
  taxCode?: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: Category;
  images: string[];
  videoUrl?: string; // Giữ lại để tương thích ngược
  videoUrls?: string[]; // Hỗ trợ nhiều video
  stock: number;
  soldCount: number;
  createdAt: string;
  rating: number;
  specs: ProductSpec[];
  variants?: ProductVariant[];
  warrantyMonths: number;
  hideWarranty?: boolean; // Thuộc tính mới để tắt hiển thị bảo hành
  isFreeship?: boolean;    // Bật tắt freeship
  shippingFee?: number;   // Phí ship nếu không freeship
  isFeatured?: boolean;
  giftName?: string;
  giftImage?: string;
  giftStartDate?: string; 
  giftEndDate?: string;   
  seoTitle?: string;
  seoDescription?: string;
  flashSalePrice?: number;
  flashSaleStart?: string;
  flashSaleEnd?: string;
  isShockSale?: boolean;
  shockSalePrice?: number;
  isHidden?: boolean;
  isOutOfStock?: boolean;
  showCommitments?: boolean; // Bật tắt cam kết trong trang chi tiết
  // New fields for Buy X Get Y
  promoBuyQty?: number;
  promoGetQty?: number;
  promoGiftName?: string;
  promoGiftImage?: string; // Hình ảnh quà tặng tùy chỉnh bằng link
  promoGiftProductId?: string; // ID của sản phẩm quà tặng nếu có sẵn trên kệ
  promoStartDate?: string;
  promoEndDate?: string;
}

export interface OrderGiftItem {
  name: string;
  quantity: number;
  isMainProductAsGift: boolean;
  productId?: string;
}

export interface CartItem extends Product {
  quantity: number;
  calculatedGifts?: OrderGiftItem[];
  selected?: boolean; // Quản lý việc tick chọn
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shippingFee: number; // Lưu phí ship của đơn hàng
  status: 'Chờ xử lý' | 'Đang xử lý' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
  date: string;
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note?: string;
  discountAmount?: number;
  couponCode?: string;
  invoiceRequest?: InvoiceData;
  reviewedProductIds?: string[]; // IDs of products in this order that have been reviewed
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  contact: string; // Email or Phone
  status: 'pending' | 'notified';
  createdAt: string;
}
