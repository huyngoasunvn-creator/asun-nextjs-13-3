
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Product, Category, Banner, AppConfig, Brand, Coupon, Commitment, ProductSpec, Order, CategoryTheme, StockAlert, HomePopup, ProductVariant, Review, BlogPost, CustomMenu } from '../types';
import { generateProductDescription, generateBlogArticle } from '../services/gemini';
import { uploadImageFile } from '../services/cloudinary';
import { ADMIN_TABS as ADMIN_PANEL_TABS, AdminTab, REVIEW_TAGS as ADMIN_REVIEW_TAGS } from './admin-panel/constants';
import { DEFAULT_PRODUCT_CATEGORY as DEFAULT_ADMIN_PRODUCT_CATEGORY } from './admin-panel/utils';
import { BlogSection, CustomMenusSection, MarketingSection, OrdersSection, ReviewsSection } from './admin-panel/content-sections';
import { AlertsSection, BannersSection, BrandsSection, CategoriesSection, CommitmentsSection } from './admin-panel/settings-sections';
import { AppConfigSection, PopupSection } from './admin-panel/config-sections';
import OrderDetailModal from './admin-panel/OrderDetailModal';
import ProductManagementSection from './admin-panel/ProductManagementSection';
import CustomMenuModal from './admin-panel/CustomMenuModal';
import BrandEditorModal from './admin-panel/BrandEditorModal';
import BannerEditorModal from './admin-panel/BannerEditorModal';
import CouponEditorModal from './admin-panel/CouponEditorModal';
import ThemeEditorModal from './admin-panel/ThemeEditorModal';
import CommitmentEditorModal from './admin-panel/CommitmentEditorModal';
import BlogEditorModal from './admin-panel/BlogEditorModal';
import ReviewEditorModal from './admin-panel/ReviewEditorModal';
import ProductEditorModal from './admin-panel/ProductEditorModal';



// Ham lay chuoi datetime-local hien tai (YYYY-MM-DDTHH:mm) theo gio dia phuong
const getLocalDatetimeString = (date?: string | Date) => {
  const d = date ? new Date(date) : new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

// Ham chuan hoa tieng Viet: Chuyen co dau thanh khong dau
const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D')
    .toLowerCase();
};

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const REVIEW_TAGS = [
  'Chất lượng tốt',
  'Giao hàng nhanh',
  'Màu sắc đẹp',
  'Đóng gói cẩn thận',
  'Tư vấn nhiệt tình'
];

const AdminPanel: React.FC = () => {
  const { 
    products, orders, banners, visibleCategories, appConfig, homePopup, brands, coupons, commitments, categoryConfigs, categoryThemes, stockAlerts, reviews, blogPosts, customMenus,
    saveProduct, deleteProduct, updateOrderStatus, 
    saveBanner, deleteBanner, toggleCategoryVisibility,
    updateAppConfig, updateHomePopup, saveBrand, deleteBrand, saveCoupon, deleteCoupon,
    saveCommitment, deleteCommitment, saveCategoryConfig, saveCategoryTheme, deleteStockAlert, saveReview, deleteReview, saveBlogPost, deleteBlogPost,
    saveCustomMenu, deleteCustomMenu
  } = useApp();
  
  const { user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('products');
  
  // States for Modals
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({ images: [''], videoUrls: [''], specs: [], variants: [], videoUrl: '' });
  const duplicateNameWarning: string | null = null;
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom Menu states
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Partial<CustomMenu>>({ isActive: true });

  // Blog states
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost>>({ relatedProductIds: [], isPublished: true, views: 0 });
  const [blogProductSearch, setBlogProductSearch] = useState('');
  const [showBlogProductResults, setShowBlogProductResults] = useState(false);
  const blogEditorRef = useRef<HTMLDivElement>(null);

  // States for Manual Reviews
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReview, setPartialReview] = useState<Partial<Review>>({ 
    rating: 5, 
    tags: [], 
    images: [''], 
    createdAt: getLocalDatetimeString() 
  });
  const [reviewProductSearch, setReviewProductSearch] = useState('');
  const [showReviewProductResults, setShowReviewProductResults] = useState(false);

  // Pagination for Reviews
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const REVIEWS_PER_PAGE_ADMIN = 10;

  // State for search queries in Admin UI
  const [giftSearchQuery, setGiftSearchQuery] = useState('');
  const [showGiftResults, setShowGiftResults] = useState(false);
  
  // Brand search for product modal
  const [showBrandResults, setShowBrandResults] = useState(false);
  const brandSearchRef = useRef<HTMLDivElement>(null);

  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner>>({});

  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand>>({});

  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon>>({ 
    scope: 'all', 
    applicableCategories: [],
    type: 'fixed',
    isActive: true 
  });
  const [couponProductSearch, setCouponProductSearch] = useState('');

  const [isEditingCommitment, setIsEditingCommitment] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<Partial<Commitment>>({});

  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Partial<CategoryTheme>>({});

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [tempAppConfig, setTempAppConfig] = useState<AppConfig>(appConfig);
  const [tempHomePopup, setTempHomePopup] = useState<HomePopup>(homePopup);
  
  // States cho tim kiem & phan trang san pham
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const commitmentEditorRef = useRef<HTMLDivElement>(null);
  const descriptionEditorRef = useRef<HTMLDivElement>(null);

  const [duplicateProduct, setDuplicateProduct] = useState<Product | null>(null); 

  // Sync content cho blog editor
  useEffect(() => {
    if (isEditingBlog && blogEditorRef.current) {
      blogEditorRef.current.innerHTML = editingBlog.content || '';
    }
  }, [isEditingBlog, editingBlog.id]);

  // Dong bo tempAppConfig khi appConfig tu context thay doi
  useEffect(() => {
    setTempAppConfig(appConfig);
  }, [appConfig]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandSearchRef.current && !brandSearchRef.current.contains(event.target as Node)) {
        setShowBrandResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync content cho editor cam ket
  useEffect(() => {
    if (isEditingCommitment && commitmentEditorRef.current) {
      commitmentEditorRef.current.innerHTML = editingCommitment.detail || '';
    }
  }, [isEditingCommitment, editingCommitment.id]);

  // Sync content cho editor mo ta san pham
  useEffect(() => {
    if (isEditing && descriptionEditorRef.current) {
      descriptionEditorRef.current.innerHTML = editingProduct.description || '';
    }
  }, [isEditing, editingProduct.id]);

  const handleAIDescription = async () => {
    if (!editingProduct.name) {
      alert("Vui lòng nhập Tên sản phẩm để AI viết mô tả.");
      return;
    }
    setIsGenerating(true);
    try {
      const description = await generateProductDescription(
        editingProduct.name || '',
        editingProduct.brand || 'TechNova',
        editingProduct.category || Category.ELECTRONICS
      );
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.innerHTML = description;
      }
      setEditingProduct(prev => ({ ...prev, description }));
    } catch (error) {
      alert("Lỗi khi tạo mô tả bằng AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIBlog = async () => {
    if (!editingBlog.title) {
      alert("Vui lòng nhập Tiêu đề bài viết để AI viết nội dung.");
      return;
    }
    setIsGenerating(true);
    try {
      const { content, excerpt } = await generateBlogArticle(editingBlog.title, [
        editingBlog.category || "Điện máy",
        "Kỹ thuật",
        "Mẹo vặt",
      ]);
      if (blogEditorRef.current) {
        blogEditorRef.current.innerHTML = content;
      }
      setEditingBlog(prev => ({ ...prev, content, excerpt }));
    } catch (error) {
      alert("Lỗi khi tạo nội dung bài viết bằng AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCommitmentTemplate = (type: 'GENUINE' | 'SUPPORT' | 'RETURNS') => {
    const templates = {
      GENUINE: {
        icon: 'fa-shield-check',
        title: "CAM KẾT 100% CHÍNH HÃNG",
        desc: "HOÀN TIỀN TRONG 90 NGÀY VỚI MỌI LÝ DO",
        detail: `<strong>CHÍNH SÁCH CAM KẾT CHÍNH HÃNG & HOÀN TIỀN</strong><br/>
                 <ul>
                    <li>Chúng tôi cam kết mọi sản phẩm bán ra đều là hàng chính hãng 100%.</li>
                    <li>Phát hiện hàng giả, hàng nhái bồi thường 200% giá trị đơn hàng.</li>
                    <li><strong>Đặc quyền:</strong> Hoàn tiền 100% trong vòng 90 ngày nếu khách hàng không hài lòng với bất kỳ lý do gì (sản phẩm còn nguyên tem mác).</li>
                 </ul>`,
      },
      SUPPORT: {
        icon: 'fa-headset',
        title: "TƯ VẤN & CHĂM SÓC 1:1",
        desc: "HỖ TRỢ 24/7 TỪ NGƯỜI HƯỚNG DẪN",
        detail: `<strong>CHÍNH SÁCH CHĂM SÓC KHÁCH HÀNG</strong><br/>
                 <ul>
                    <li>Hỗ trợ trực tuyến 24/7 qua Zalo/Messenger.</li>
                    <li>Tư vấn kỹ thuật chuyên sâu về các thiết bị lọc nước và gia dụng.</li>
                    <li>Phản hồi yêu cầu trong vòng 15 phút.</li>
                 </ul>`,
      },
      RETURNS: {
        icon: 'fa-arrows-rotate',
        title: "CHÍNH SÁCH ĐỔI TRẢ 1-1",
        desc: "LỖI NHÀ SẢN XUẤT ĐỔI MỚI TRONG 7 NGÀY",
        detail: `<strong>CHÍNH SÁCH ĐỔI TRẢ VÀ BẢO HÀNH</strong><br/>
                 <ul>
                    <li>Miễn phí đổi mới trong vòng 7 ngày đầu nếu có lỗi kỹ thuật.</li>
                    <li>Thủ tục tinh gọn, hỗ trợ nhận hàng đổi trả tại nhà.</li>
                    <li>Bảo hành chính hãng theo tiêu chuẩn của từng thương hiệu.</li>
                 </ul>`,
      },
    };
    
    const template = templates[type];
    setEditingCommitment(prev => ({
      ...prev,
      icon: template.icon,
      title: template.title,
      desc: template.desc,
      detail: template.detail
    }));
    
    if (commitmentEditorRef.current) {
      commitmentEditorRef.current.innerHTML = template.detail;
    }
  };

  const addImageField = () => {
    setEditingProduct(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...(editingProduct.images || [])];
    newImages[index] = value;
    setEditingProduct(prev => ({ ...prev, images: newImages }));
  };

  const removeImageField = (index: number) => {
    const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
    newImages.length > 0 ? setEditingProduct(prev => ({ ...prev, images: newImages })) : setEditingProduct(prev => ({ ...prev, images: [''] }));
  };

  const addVideoField = () => {
    setEditingProduct(prev => ({ ...prev, videoUrls: [...(prev.videoUrls || []), ''] }));
  };

  const updateVideoField = (index: number, value: string) => {
    const newVideos = [...(editingProduct.videoUrls || [])];
    newVideos[index] = value;
    setEditingProduct(prev => ({ ...prev, videoUrls: newVideos }));
  };

  const removeVideoField = (index: number) => {
    const newVideos = (editingProduct.videoUrls || []).filter((_, i) => i !== index);
    setEditingProduct(prev => ({ ...prev, videoUrls: newVideos.length > 0 ? newVideos : [''] }));
  };

  const addSpecField = () => {
    setEditingProduct(prev => ({ ...prev, specs: [...(prev.specs || []), { label: '', value: '' }] }));
  };

  const updateSpecField = (index: number, field: keyof ProductSpec, value: string) => {
    const newSpecs = [...(editingProduct.specs || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setEditingProduct(prev => ({ ...prev, specs: newSpecs }));
  };

  const removeSpecField = (index: number) => {
    setEditingProduct(prev => ({ ...prev, specs: prev.specs?.filter((_, i) => i !== index) }));
  };

  const addVariantField = () => {
    setEditingProduct(prev => ({ ...prev, variants: [...(prev.variants || []), { label: '', options: [] }] }));
  };

  const updateVariantLabel = (index: number, value: string) => {
    const newVariants = [...(editingProduct.variants || [])];
    newVariants[index] = { ...newVariants[index], label: value };
    setEditingProduct(prev => ({ ...prev, variants: newVariants }));
  };

  const updateVariantOptions = (index: number, value: string) => {
    const newVariants = [...(editingProduct.variants || [])];
    const options = value.split(',');
    newVariants[index] = { ...newVariants[index], options };
    setEditingProduct(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariantField = (index: number) => {
    setEditingProduct(prev => ({ ...prev, variants: prev.variants?.filter((_, i) => i !== index) }));
  };

  const handleCopyProduct = (p: Product) => {
    const copy: Partial<Product> = {
      ...p,
      id: undefined, 
        name: `${p.name} (Bản sao)`,
      createdAt: new Date().toISOString(), 
      soldCount: 0,
      stock: p.stock
    };
    setEditingProduct(copy);
    setIsEditing(true);
  };

  const checkDuplicateProductName = (name: string) => {
  if (!name) return;

  const duplicate = products.find(
    (p: Product) =>
      p.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      p.id !== editingProduct?.id
  );

  if (duplicate) {
    setDuplicateProduct(duplicate);
  } else {
    setDuplicateProduct(null);
  }
};
  const handleSaveProduct = (e: React.FormEvent) => {
  e.preventDefault();

  const finalDescription = descriptionEditorRef.current?.innerHTML || '';
  

  const finalProduct = {
    ...editingProduct,
    id: editingProduct.id || `p-${Date.now()}`,
    name: editingProduct.name!,
        brand: editingProduct.brand || 'Chưa xác định',
    price: Number(editingProduct.price),
    originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
    category: editingProduct.category || DEFAULT_ADMIN_PRODUCT_CATEGORY,
    images: editingProduct.images?.filter(img => img.trim() !== '') || ['https://placehold.co/600'],
    videoUrl: editingProduct.videoUrls?.[0] || '',
    videoUrls: editingProduct.videoUrls?.filter(v => v.trim() !== '') || [],
    specs: editingProduct.specs?.filter(s => s.label !== '') || [],
    variants: editingProduct.variants?.map(v => ({
      ...v,
      options: v.options.map(opt => opt.trim()).filter(opt => opt !== '')
    })).filter(v => v.label !== '' && v.options.length > 0) || [],
    stock: Number(editingProduct.stock || 0),
    soldCount: Number(editingProduct.soldCount || 0),
    createdAt: editingProduct.createdAt || new Date().toISOString(),
    rating: Number(editingProduct.rating || 5),
    warrantyMonths: editingProduct.warrantyMonths !== undefined ? Number(editingProduct.warrantyMonths) : 0,
    hideWarranty: editingProduct.hideWarranty || false,
    isFreeship: editingProduct.isFreeship || false,
    shippingFee: editingProduct.isFreeship ? 0 : Number(editingProduct.shippingFee || 0),
    flashSalePrice: editingProduct.flashSalePrice ? Number(editingProduct.flashSalePrice) : undefined,
    flashSaleStart: editingProduct.flashSaleStart,
    flashSaleEnd: editingProduct.flashSaleEnd,
    isShockSale: editingProduct.isShockSale || false,
    shockSalePrice: editingProduct.shockSalePrice ? Number(editingProduct.shockSalePrice) : undefined,
    giftName: editingProduct.giftName,
    giftImage: editingProduct.giftImage,
    giftStartDate: editingProduct.giftStartDate,
    giftEndDate: editingProduct.giftEndDate,
    description: finalDescription,
    seoTitle: editingProduct.seoTitle,
    seoDescription: editingProduct.seoDescription,
    isHidden: editingProduct.isHidden || false,
    isOutOfStock: editingProduct.isOutOfStock || false,
    showCommitments: editingProduct.showCommitments || false,
    promoBuyQty: editingProduct.promoBuyQty ? Number(editingProduct.promoBuyQty) : undefined,
    promoGetQty: editingProduct.promoGetQty ? Number(editingProduct.promoGetQty) : undefined,
    promoGiftName: editingProduct.promoGiftName,
    promoGiftImage: editingProduct.promoGiftImage,
    promoGiftProductId: editingProduct.promoGiftProductId,
    promoStartDate: editingProduct.promoStartDate,
    promoEndDate: editingProduct.promoEndDate
  } as Product;

    // Kiem tra trung ten
const isDuplicate = products.some(
  p => p.name.toLowerCase().trim() === finalProduct.name.toLowerCase().trim()
  && p.id !== finalProduct.id
);

if (isDuplicate) {
  const confirmSave = confirm(
    "⚠️ Sản phẩm này đã tồn tại.\n\nBạn có muốn vẫn lưu sản phẩm không?"
  );

  if (!confirmSave) {
    return; // Khong luu, quay lai form
  }
}

saveProduct(finalProduct);
setIsEditing(false);
setCurrentPage(1);
};

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = blogEditorRef.current?.innerHTML || '';
    const post: BlogPost = {
      ...editingBlog,
      id: editingBlog.id || `blog-${Date.now()}`,
      title: editingBlog.title!,
      slug: createSlug(editingBlog.title!),
      excerpt: editingBlog.excerpt || "",
      content: finalContent,
      image: editingBlog.image || "https://placehold.co/800x450",
      videoUrl: editingBlog.videoUrl || "",
      author: editingBlog.author || user?.displayName || "Ban biên tập Asun",
      category: editingBlog.category || "Tin tức",
      createdAt: editingBlog.createdAt || new Date().toISOString(),
      isPublished: editingBlog.isPublished ?? true,
      relatedProductIds: editingBlog.relatedProductIds || [],
      views: editingBlog.views || 0
    } as BlogPost;

    await saveBlogPost(post);
    setIsEditingBlog(false);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const menu: CustomMenu = {
      id: editingMenu.id || `menu-${Date.now()}`,
      title: editingMenu.title!,
      url: editingMenu.url!,
      slug: createSlug(editingMenu.title!),
      isActive: editingMenu.isActive ?? true,
      createdAt: editingMenu.createdAt || new Date().toISOString()
    };
    await saveCustomMenu(menu);
    setIsEditingMenu(false);
  };

  const handleQuickToggleHidden = (p: Product) => {
    saveProduct({ ...p, isHidden: !p.isHidden });
  };

  const handleQuickToggleOutOfStock = (p: Product) => {
    saveProduct({ ...p, isOutOfStock: !p.isOutOfStock });
  };

  const handleQuickUpdateSoldCount = (p: Product, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      saveProduct({ ...p, soldCount: num });
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    saveBanner({
      id: editingBanner.id || `b-${Date.now()}`,
      imageUrl: editingBanner.imageUrl!,
      title: editingBanner.title || '',
      buttonText: editingBanner.buttonText || 'XEM NGAY',
      link: editingBanner.link || '/',
      isActive: editingBanner.isActive ?? true,
      position: editingBanner.position || 'main'
    } as Banner);
    setIsEditingBanner(false);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = editingBrand.name?.trim().toLowerCase();
    const isDuplicate = brands.some(b => 
      b.name.trim().toLowerCase() === normalizedName && b.id !== editingBrand.id
    );
    if (isDuplicate) {
      alert(`Thương hiệu "${editingBrand.name}" đã tồn tại trên hệ thống. Vui lòng kiểm tra lại!`);
      return;
    }
    saveBrand({
      id: editingBrand.id || `br-${Date.now()}`,
      name: editingBrand.name!,
      logoUrl: editingBrand.logoUrl!
    });
    setIsEditingBrand(false);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    saveCoupon({
      ...editingCoupon,
      id: editingCoupon.id || `c-${Date.now()}`,
      code: editingCoupon.code!,
      value: editingCoupon.type === 'freeship' ? 0 : Number(editingCoupon.value),
      maxDiscount: editingCoupon.maxDiscount ? Number(editingCoupon.maxDiscount) : undefined,
      type: editingCoupon.type || 'fixed',
      minOrder: Number(editingCoupon.minOrder || 0),
      expiryDate: editingCoupon.endDate || editingCoupon.expiryDate || '2025-12-31',
      isActive: editingCoupon.isActive ?? true,
      scope: editingCoupon.scope || 'all',
      applicableCategories: editingCoupon.applicableCategories || [],
      productId: editingCoupon.scope === 'product' ? editingCoupon.productId : undefined
    } as Coupon);
    setIsEditingCoupon(false);
  };

  const handleSaveCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDetail = commitmentEditorRef.current?.innerHTML || '';
    saveCommitment({
      id: editingCommitment.id || `commit-${Date.now()}`,
      icon: editingCommitment.icon!,
      title: editingCommitment.title!,
      desc: editingCommitment.desc || '',
      highlight: editingCommitment.highlight || '',
      detail: finalDetail
    } as Commitment);
    setIsEditingCommitment(false);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme.category) return;
    saveCategoryTheme(editingTheme as CategoryTheme);
    setIsEditingTheme(false);
  };

  const handleSaveManualReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview.productId) {
      alert('Vui lòng chọn sản phẩm để đánh giá.');
      return;
    }
    setIsGenerating(true);
    try {
      const review: Review = {
        ...editingReview,
        id: editingReview.id || `rev-admin-${Date.now()}`,
        userId: editingReview.userId || user?.uid || 'admin-system', 
        userName: editingReview.userName || 'Khách hàng ẩn danh',
        productId: editingReview.productId!,
        orderId: editingReview.orderId || '', 
        rating: editingReview.rating || 5,
        comment: editingReview.comment || '',
        tags: editingReview.tags || [],
        images: editingReview.images?.filter(img => img.trim() !== '') || [],
        createdAt: editingReview.createdAt || getLocalDatetimeString(),
        isManual: true
      } as Review;
      await saveReview(review);
      setIsEditingReview(false);
      setCurrentReviewPage(1);
    } catch (err: any) {
      console.error("Manual review save error:", err);
      alert(`Lỗi khi lưu đánh giá: ${err.message || 'Thiếu quyền truy cập Firestore'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditReview = (rev: Review) => {
    const prod = products.find(p => p.id === rev.productId);
    setPartialReview({
      ...rev,
      createdAt: getLocalDatetimeString(rev.createdAt)
    });
    setReviewProductSearch(prod?.name || '');
    setIsEditingReview(true);
  };

  const toggleReviewTag = (tag: string) => {
    setPartialReview(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const updateReviewImageLink = (index: number, val: string) => {
    const imgs = [...(editingReview.images || [])];
    imgs[index] = val;
    setPartialReview({ ...editingReview, images: imgs });
  };

  const addReviewImageLink = () => {
    setPartialReview({ ...editingReview, images: [...(editingReview.images || []), ''] });
  };

  const removeReviewImageLink = (index: number) => {
    const imgs = (editingReview.images || []).filter((_, i) => i !== index);
    setPartialReview({ ...editingReview, images: imgs.length > 0 ? imgs : [''] });
  };

  const execCommand = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
  };

  const insertImageFromUrl = () => {
    const url = prompt('Nhập URL hình ảnh (ví dụ: https://...):');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const pickImageFromDevice = () =>
    new Promise<File | null>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => resolve(input.files?.[0] || null);
      input.click();
    });

  const uploadEditorImage = async (folder: string) => {
    const file = await pickImageFromDevice();

    if (!file) return;

    try {
      const result = await uploadImageFile(file, { folder });
      document.execCommand('insertImage', false, result.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tải ảnh lên Cloudinary.';
      alert(message);
    }
  };

  const insertLink = () => {
    const url = prompt('Nhập URL liên kết (ví dụ: https://asun.vn):');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  // Logic xu ly danh sach san pham
  const filteredAndSortedProducts = useMemo(() => {
    const normalizedQuery = removeAccents(adminProductSearch);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    
    return products
      .filter(p => {
        const normalizedPName = removeAccents(p.name);
        const normalizedPBrand = removeAccents(p.brand);
        return queryWords.length === 0 || queryWords.every(word => 
          normalizedPName.includes(word) || normalizedPBrand.includes(word)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, adminProductSearch]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Logic xu ly danh gia (phan trang)
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE_ADMIN);
  const currentReviews = useMemo(() => {
    return reviews.slice(
      (currentReviewPage - 1) * REVIEWS_PER_PAGE_ADMIN,
      currentReviewPage * REVIEWS_PER_PAGE_ADMIN
    );
  }, [reviews, currentReviewPage]);

  const reviewProductSearchResults = useMemo(() => {
    if (!reviewProductSearch.trim()) return [];
    const normalized = removeAccents(reviewProductSearch);
    return products.filter(p => removeAccents(p.name).includes(normalized)).slice(0, 5);
  }, [products, reviewProductSearch]);

  const blogProductSearchResults = useMemo(() => {
    if (!blogProductSearch.trim()) return [];
    const normalized = removeAccents(blogProductSearch);
    return products.filter(p => removeAccents(p.name).includes(normalized)).slice(0, 5);
  }, [products, blogProductSearch]);

  const giftSearchResults = useMemo(() => {
    if (!giftSearchQuery.trim()) return [];
    const normalized = removeAccents(giftSearchQuery);
    return products.filter(p => removeAccents(p.name).includes(normalized)).slice(0, 5);
  }, [products, giftSearchQuery]);

  const brandSearchResults = useMemo(() => {
    const query = editingProduct.brand || '';
    if (!query.trim()) return brands;
    const normalized = removeAccents(query);
    return brands.filter(b => removeAccents(b.name).includes(normalized));
  }, [brands, editingProduct.brand]);

  const couponProductSearchResults = useMemo(() => {
    if (!couponProductSearch.trim()) return [];
    const normalized = removeAccents(couponProductSearch);
    return products.filter(p => removeAccents(p.name).includes(normalized)).slice(0, 5);
  }, [products, couponProductSearch]);

  const handleOrderChange = (cat: Category, val: string) => {
    const orderNum = parseInt(val) || 0;
    saveCategoryConfig({ category: cat, order: orderNum });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-24 mt-4 px-2 md:px-4">
      <div className="bg-white rounded-sm shadow-sm border overflow-hidden">
        <div className="p-4 md:p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Hệ thống Quản trị</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">ElectroHub Pro Enterprise Control</p>
          </div>
        </div>

        <div className="bg-slate-50 px-2 pt-2 border-b">
           <div className="flex flex-nowrap overflow-x-auto custom-scrollbar gap-1 pb-2">
            {ADMIN_PANEL_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 rounded-t-sm text-[10px] md:text-[11px] font-black uppercase transition-all flex items-center gap-2 shrink-0 border-t-2 border-x ${tab === t.id ? 'bg-white border-t-[#ee4d2d] text-[#ee4d2d] shadow-sm z-10' : 'bg-transparent border-t-transparent border-x-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <i className={`fa-solid ${t.icon}`}></i> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-sm shadow-sm border min-h-[60vh]">
        {tab === 'products' && (
          <ProductManagementSection
            products={products}
            currentItems={currentItems}
            adminProductSearch={adminProductSearch}
            currentPage={currentPage}
            totalPages={totalPages}
            onSearchChange={(value) => {
              setAdminProductSearch(value);
              setCurrentPage(1);
            }}
            onPageChange={(page) => setCurrentPage(page)}
            onCreate={() => {
              setDuplicateProduct(null);
              setEditingProduct({
                images: [''],
                videoUrls: [''],
                specs: [],
                variants: [],
                videoUrl: '',
                category: DEFAULT_ADMIN_PRODUCT_CATEGORY,
                isHidden: false,
                isOutOfStock: false,
                soldCount: 0,
                showCommitments: false
              });
              setIsEditing(true);
            }}
            onCopy={(product) => handleCopyProduct(product)}
            onEdit={(product) => {
              const productToEdit = {
                ...product,
                videoUrls: product.videoUrls || (product.videoUrl ? [product.videoUrl] : [''])
              };
              setEditingProduct(productToEdit);
              setIsEditing(true);
            }}
            onDelete={(productId) => deleteProduct(productId)}
            onQuickUpdateSoldCount={(product, value) => handleQuickUpdateSoldCount(product, value)}
            onQuickToggleHidden={(product) => handleQuickToggleHidden(product)}
            onQuickToggleOutOfStock={(product) => handleQuickToggleOutOfStock(product)}
          />
        )}
        {tab === 'customMenus' && (
          <CustomMenusSection
            customMenus={customMenus}
            onCreate={() => { setEditingMenu({ isActive: true }); setIsEditingMenu(true); }}
            onEdit={(menu) => { setEditingMenu(menu); setIsEditingMenu(true); }}
            onDelete={(menuId) => { if (confirm('Xóa menu này?')) deleteCustomMenu(menuId); }}
          />
        )}

        {tab === 'orders' && (
          <OrdersSection
            orders={orders}
            onViewOrder={(order) => setViewingOrder(order)}
            onUpdateStatus={(orderId, status) => updateOrderStatus(orderId, status)}
          />
        )}

        {tab === 'reviews' && (
          <ReviewsSection
            reviews={reviews}
            currentReviews={currentReviews}
            currentReviewPage={currentReviewPage}
            totalReviewPages={totalReviewPages}
            products={products}
            onCreateReview={() => {
              setPartialReview({ rating: 5, tags: [], images: [''], createdAt: getLocalDatetimeString() });
              setReviewProductSearch('');
              setIsEditingReview(true);
            }}
            onEditReview={(review) => handleEditReview(review)}
            onDeleteReview={(reviewId) => { if (confirm('Xóa đánh giá này?')) deleteReview(reviewId); }}
            onPageChange={(page) => setCurrentReviewPage(page)}
          />
        )}

        {tab === 'blog' && (
          <BlogSection
            blogPosts={blogPosts}
            onCreate={() => { setEditingBlog({ relatedProductIds: [], isPublished: true, views: 0, createdAt: new Date().toISOString() }); setIsEditingBlog(true); }}
            onEdit={(post) => { setEditingBlog(post); setIsEditingBlog(true); }}
            onDelete={(postId) => { if (confirm('Xóa bài viết này?')) deleteBlogPost(postId); }}
          />
        )}

        {tab === 'marketing' && (
          <MarketingSection
            coupons={coupons}
            onCreate={() => { setEditingCoupon({ scope: 'all', applicableCategories: [], type: 'fixed', isActive: true }); setIsEditingCoupon(true); }}
            onEdit={(coupon) => { setEditingCoupon(coupon); setIsEditingCoupon(true); }}
            onDelete={(couponId) => deleteCoupon(couponId)}
          />
        )}

        {tab === 'alerts' && (
          <AlertsSection
            stockAlerts={stockAlerts}
            onDelete={(alertId) => { if (confirm('Xóa yêu cầu này?')) deleteStockAlert(alertId); }}
          />
        )}

        {tab === 'brands' && (
          <BrandsSection
            brands={brands}
            onCreate={() => { setEditingBrand({}); setIsEditingBrand(true); }}
            onEdit={(brand) => { setEditingBrand(brand); setIsEditingBrand(true); }}
            onDelete={(brandId) => deleteBrand(brandId)}
          />
        )}

        {tab === 'categories' && (
          <CategoriesSection
            categories={Object.values(Category)}
            categoryConfigs={categoryConfigs}
            visibleCategories={visibleCategories}
            categoryThemes={categoryThemes}
            onOrderChange={(category, value) => handleOrderChange(category, value)}
            onToggleVisibility={(category) => toggleCategoryVisibility(category)}
            onEditTheme={(theme) => { setEditingTheme(theme); setIsEditingTheme(true); }}
            onCreateTheme={(category) => { setEditingTheme({ category, color: 'from-slate-600', accentClass: 'text-slate-800', bgClass: 'bg-slate-50' }); setIsEditingTheme(true); }}
          />
        )}

        {tab === 'commitments' && (
          <CommitmentsSection
            commitments={commitments}
            onCreate={() => { setEditingCommitment({}); setIsEditingCommitment(true); }}
            onEdit={(commitment) => { setEditingCommitment(commitment); setIsEditingCommitment(true); }}
            onDelete={(commitmentId) => deleteCommitment(commitmentId)}
          />
        )}

        {tab === 'banners' && (
          <BannersSection
            banners={banners}
            onCreate={() => { setEditingBanner({ position: 'main', isActive: true, buttonText: 'XEM NGAY', link: '/' }); setIsEditingBanner(true); }}
            onEdit={(banner) => { setEditingBanner(banner); setIsEditingBanner(true); }}
            onDelete={(bannerId) => deleteBanner(bannerId)}
          />
        )}

        {tab === 'popup' && (
          <PopupSection
            tempHomePopup={tempHomePopup}
            setTempHomePopup={setTempHomePopup}
            onSave={() => { updateHomePopup(tempHomePopup); alert('Đã lưu cấu hình Popup!'); }}
          />
        )}

        {tab === 'app' && (
          <AppConfigSection
            tempAppConfig={tempAppConfig}
            setTempAppConfig={setTempAppConfig}
            onSave={() => { updateAppConfig(tempAppConfig); alert('Hệ thống đã cập nhật cấu hình mới!'); }}
          />
        )}
      </div>

      <CustomMenuModal
        open={isEditingMenu}
        editingMenu={editingMenu}
        setEditingMenu={setEditingMenu}
        onClose={() => setIsEditingMenu(false)}
        onSubmit={handleSaveMenu}
      />

      <BlogEditorModal
        open={isEditingBlog}
        editingBlog={editingBlog}
        setEditingBlog={setEditingBlog}
        products={products}
        blogProductSearch={blogProductSearch}
        setBlogProductSearch={setBlogProductSearch}
        showBlogProductResults={showBlogProductResults}
        setShowBlogProductResults={setShowBlogProductResults}
        blogProductSearchResults={blogProductSearchResults}
        blogEditorRef={blogEditorRef}
        isGenerating={isGenerating}
        onClose={() => setIsEditingBlog(false)}
        onSubmit={handleSaveBlog}
        onGenerateAI={handleAIBlog}
        execCommand={execCommand}
        insertLink={insertLink}
        insertImageFromUrl={insertImageFromUrl}
        uploadContentImage={() => uploadEditorImage('blogs/content')}
      />

      <ReviewEditorModal
        open={isEditingReview}
        editingReview={editingReview}
        setPartialReview={setPartialReview}
        reviewProductSearch={reviewProductSearch}
        setReviewProductSearch={setReviewProductSearch}
        showReviewProductResults={showReviewProductResults}
        setShowReviewProductResults={setShowReviewProductResults}
        reviewProductSearchResults={reviewProductSearchResults}
        reviewTags={REVIEW_TAGS}
        isGenerating={isGenerating}
        onClose={() => setIsEditingReview(false)}
        onSubmit={handleSaveManualReview}
        onToggleTag={toggleReviewTag}
        onAddImageLink={addReviewImageLink}
        onUpdateImageLink={updateReviewImageLink}
        onRemoveImageLink={removeReviewImageLink}
      />

      <ThemeEditorModal
        open={isEditingTheme}
        editingTheme={editingTheme}
        setEditingTheme={setEditingTheme}
        onClose={() => setIsEditingTheme(false)}
        onSubmit={handleSaveTheme}
      />

      <ProductEditorModal
        open={isEditing}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        duplicateProduct={duplicateProduct}
        duplicateNameWarning={duplicateNameWarning}
        brandSearchRef={brandSearchRef}
        showBrandResults={showBrandResults}
        setShowBrandResults={setShowBrandResults}
        brandSearchResults={brandSearchResults}
        giftSearchQuery={giftSearchQuery}
        setGiftSearchQuery={setGiftSearchQuery}
        showGiftResults={showGiftResults}
        setShowGiftResults={setShowGiftResults}
        giftSearchResults={giftSearchResults}
        descriptionEditorRef={descriptionEditorRef}
        isGenerating={isGenerating}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSaveProduct}
        onNameChange={(name) => {
          setEditingProduct({ ...editingProduct, name });
          setDuplicateProduct(null);
        }}
        onCheckDuplicateName={checkDuplicateProductName}
        onGenerateAIDescription={handleAIDescription}
        createSlug={createSlug}
        execCommand={execCommand}
        insertImageFromUrl={insertImageFromUrl}
        uploadEditorImage={() => uploadEditorImage('products/descriptions')}
        addImageField={addImageField}
        updateImageField={updateImageField}
        removeImageField={removeImageField}
        addVideoField={addVideoField}
        updateVideoField={updateVideoField}
        removeVideoField={removeVideoField}
        addSpecField={addSpecField}
        updateSpecField={updateSpecField}
        removeSpecField={removeSpecField}
        addVariantField={addVariantField}
        updateVariantLabel={updateVariantLabel}
        updateVariantOptions={updateVariantOptions}
        removeVariantField={removeVariantField}
      />
      <CommitmentEditorModal
        open={isEditingCommitment}
        editingCommitment={editingCommitment}
        setEditingCommitment={setEditingCommitment}
        commitmentEditorRef={commitmentEditorRef}
        onClose={() => setIsEditingCommitment(false)}
        onSubmit={handleSaveCommitment}
        onApplyTemplate={applyCommitmentTemplate}
        execCommand={execCommand}
      />
      
      <BrandEditorModal
        open={isEditingBrand}
        editingBrand={editingBrand}
        setEditingBrand={setEditingBrand}
        onClose={() => setIsEditingBrand(false)}
        onSubmit={handleSaveBrand}
      />

      <BannerEditorModal
        open={isEditingBanner}
        editingBanner={editingBanner}
        setEditingBanner={setEditingBanner}
        onClose={() => setIsEditingBanner(false)}
        onSubmit={handleSaveBanner}
      />

      <CouponEditorModal
        open={isEditingCoupon}
        editingCoupon={editingCoupon}
        setEditingCoupon={setEditingCoupon}
        couponProductSearch={couponProductSearch}
        setCouponProductSearch={setCouponProductSearch}
        couponProductSearchResults={couponProductSearchResults}
        onClose={() => setIsEditingCoupon(false)}
        onSubmit={handleSaveCoupon}
      />

      {/* MODAL XEM CHI TIET DON HANG */}
      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={(orderId, status) => updateOrderStatus(orderId, status)}
      />
    </div>
  );
};

export default AdminPanel;




