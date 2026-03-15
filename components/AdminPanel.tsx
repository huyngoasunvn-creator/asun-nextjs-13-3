
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { Product, Category, Banner, AppConfig, Brand, Coupon, Commitment, ProductSpec, Order, CategoryTheme, StockAlert, HomePopup, ProductVariant, Review, BlogPost, CustomMenu } from '../types';
import { generateProductDescription, generateBlogArticle } from '../services/gemini';
import Link from "next/link";



// Hàm lấy chuỗi datetime-local hiện tại (YYYY-MM-DDTHH:mm) theo giờ địa phương
const getLocalDatetimeString = (date?: string | Date) => {
  const d = date ? new Date(date) : new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

// Hàm chuẩn hóa tiếng Việt: Chuyển có dấu thành không dấu
const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
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
  const [tab, setTab] = useState<'products' | 'orders' | 'reviews' | 'blog' | 'customMenus' | 'marketing' | 'brands' | 'categories' | 'banners' | 'commitments' | 'app' | 'alerts' | 'popup'>('products');
  
  // States for Modals
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({ images: [''], videoUrls: [''], specs: [], variants: [], videoUrl: '' });
  const [duplicateNameWarning, setDuplicateNameWarning] = useState<string | null>(null);
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
  
  // States cho Tìm kiếm & Phân trang Sản phẩm
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

  // Đồng bộ tempAppConfig khi appConfig từ context thay đổi
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

  // Sync content cho editor cam kết
  useEffect(() => {
    if (isEditingCommitment && commitmentEditorRef.current) {
      commitmentEditorRef.current.innerHTML = editingCommitment.detail || '';
    }
  }, [isEditingCommitment, editingCommitment.id]);

  // Sync content cho editor mô tả sản phẩm
  useEffect(() => {
    if (isEditing && descriptionEditorRef.current) {
      descriptionEditorRef.current.innerHTML = editingProduct.description || '';
    }
  }, [isEditing, editingProduct.id]);

  const handleAIDescription = async () => {
    if (!editingProduct.name) {
      alert('Vui lòng nhập Tên sản phẩm để AI viết mô tả.');
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
      alert('Lỗi khi tạo mô tả bằng AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIBlog = async () => {
    if (!editingBlog.title) {
      alert('Vui lòng nhập Tiêu đề bài viết để AI viết nội dung.');
      return;
    }
    setIsGenerating(true);
    try {
      const { content, excerpt } = await generateBlogArticle(editingBlog.title, [editingBlog.category || "Điện máy", "Kỹ thuật", "Mẹo vặt"]);
      if (blogEditorRef.current) {
        blogEditorRef.current.innerHTML = content;
      }
      setEditingBlog(prev => ({ ...prev, content, excerpt }));
    } catch (error) {
      alert('Lỗi khi tạo nội dung bài viết bằng AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCommitmentTemplate = (type: 'GENUINE' | 'SUPPORT' | 'RETURNS') => {
    const templates = {
      GENUINE: {
        icon: 'fa-shield-check',
        title: 'CAM KẾT 100% CHÍNH HÃNG',
        desc: 'HOÀN TIỀN TRONG 90 NGÀY VỚI MỌI LÝ DO',
        detail: `<strong>CHÍNH SÁCH CAM KẾT CHÍNH HÃNG & HOÀN TIỀN</strong><br/>
                 <ul>
                    <li>Chúng tôi cam kết mọi sản phẩm bán ra đều là hàng chính hãng 100%.</li>
                    <li>Phát hiện hàng giả, hàng nhái bồi thường 200% giá trị đơn hàng.</li>
                    <li><strong>Đặc quyền:</strong> Hoàn tiền 100% trong vòng 90 ngày nếu khách hàng không hài lòng với bất kỳ lý do gì (sản phẩm còn nguyên tem mác).</li>
                 </ul>`
      },
      SUPPORT: {
        icon: 'fa-headset',
        title: 'TƯ VẤN & CHĂM SÓC 1:1',
        desc: 'HỖ TRỢ 24/7 TỪ NGƯỜI HƯỚNG DẪN',
        detail: `<strong>CHÍNH SÁCH CHĂM SÓC KHÁCH HÀNG</strong><br/>
                 <ul>
                    <li>Hỗ trợ trực tuyến 24/7 qua Zalo/Messenger.</li>
                    <li>Tư vấn kỹ thuật chuyên sâu về các thiết bị lọc nước và gia dụng.</li>
                    <li>Phát hồi yêu cầu trong vòng 15 phút.</li>
                 </ul>`
      },
      RETURNS: {
        icon: 'fa-arrows-rotate',
        title: 'CHÍNH SÁCH ĐỔI TRẢ 1-1',
        desc: 'LỖI NHÀ SẢN XUẤT ĐỔI MỚI TRONG 7 NGÀY',
        detail: `<strong>CHÍNH SÁCH ĐỔI TRẢ VÀ BẢO HÀNH</strong><br/>
                 <ul>
                    <li>Miễn phí đổi mới trong vòng 7 ngày đầu nếu có lỗi kỹ thuật.</li>
                    <li>Thủ tục tinh gọn, hỗ trợ nhận hàng đổi trả tại nhà.</li>
                    <li>Bảo hành chính hãng theo tiêu chuẩn của từng thương hiệu.</li>
                 </ul>`
      }
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
    category: editingProduct.category || Category.SMARTPHONES,
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

  // ✅ KIỂM TRA TRÙNG TÊN
const isDuplicate = products.some(
  p => p.name.toLowerCase().trim() === finalProduct.name.toLowerCase().trim()
  && p.id !== finalProduct.id
);

if (isDuplicate) {
  const confirmSave = confirm(
    "⚠️ Sản phẩm này đã tồn tại.\n\nBạn có muốn vẫn lưu sản phẩm không?"
  );

  if (!confirmSave) {
    return; // ❌ không lưu, quay lại form
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

  const insertImage = () => {
    const url = prompt('Nhập URL hình ảnh (ví dụ: https://...):');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const insertLink = () => {
    const url = prompt('Nhập URL liên kết (ví dụ: https://asun.vn):');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  // Logic Xử lý Danh sách sản phẩm
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

  // Logic Xử lý Đánh giá (Phân trang)
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
            {[
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
              { id: 'app', label: 'Cấu hình App', icon: 'fa-gears' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id as any)} 
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
                    onChange={(e) => { setAdminProductSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
<button
  onClick={() => {
    setDuplicateProduct(null);
    setEditingProduct({
      images: [''],
      videoUrls: [''],
      specs: [],
      variants: [],
      videoUrl: '',
      category: Category.SMARTPHONES,
      isHidden: false,
      isOutOfStock: false,
      soldCount: 0,
      showCommitments: false
    });
    setIsEditing(true);
  }}
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
                  {currentItems.map(p => (
                    <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.isHidden ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img src={p.images[0]} className={`w-10 h-10 object-cover rounded-sm border ${p.isHidden ? 'opacity-30 grayscale' : ''}`} />
                        <div>
                          <div className={`font-bold ${p.isHidden ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{p.name}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">{p.category} | {p.brand}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <label className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Số lượt bán</label>
                          <input 
                            type="number" 
                            className="w-16 p-1.5 border rounded-sm text-center text-xs font-black text-blue-600 focus:border-blue-400 outline-none shadow-sm"
                            defaultValue={p.soldCount}
                            onBlur={(e) => handleQuickUpdateSoldCount(p, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                          />
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-black ${p.isHidden ? 'text-slate-300' : 'text-[#ee4d2d]'}`}>₫{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {p.isHidden && <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-black rounded-sm uppercase tracking-widest"><i className="fa-solid fa-eye-slash mr-1"></i> ĐÃ ẨN</span>}
                          {p.isOutOfStock && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black rounded-sm uppercase tracking-widest"><i className="fa-solid fa-box-archive mr-1"></i> HẾT HÀNG</span>}
                          {!p.isHidden && !p.isOutOfStock && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-sm uppercase tracking-widest">ĐANG BÁN</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex justify-center items-center gap-3">
                            <button 
                              onClick={() => handleQuickToggleHidden(p)} 
                              title={p.isHidden ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${p.isHidden ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                              <i className={`fa-solid ${p.isHidden ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                            <button 
                              onClick={() => handleQuickToggleOutOfStock(p)} 
                              title={p.isOutOfStock ? "Báo còn hàng" : "Báo hết hàng"}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${p.isOutOfStock ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                              <i className={`fa-solid ${p.isOutOfStock ? 'fa-box-archive' : 'fa-box'}`}></i>
                            </button>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleCopyProduct(p)} className="text-emerald-600 font-black text-[10px] uppercase mr-4 hover:underline flex-inline items-center gap-1">
                          <i className="fa-solid fa-copy text-[9px]"></i> Copy
                        </button>
                        <button onClick={() => {
                          const productToEdit = {
                            ...p,
                            videoUrls: p.videoUrls || (p.videoUrl ? [p.videoUrl] : [''])
                          };
                          setEditingProduct(productToEdit); 
                          setIsEditing(true);
                        }} className="text-blue-600 font-black text-[10px] uppercase mr-4 hover:underline">Sửa</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all ${currentPage === i + 1 ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
                >
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
                
                <span className="ml-4 text-[10px] font-black uppercase text-slate-400 italic">Trang {currentPage} / {totalPages}</span>
              </div>
            )}
          </div>
        )}

        {tab === 'customMenus' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Quản lý Menu ẩn (Trang nhúng)</h2>
              <button onClick={() => { setEditingMenu({ isActive: true }); setIsEditingMenu(true); }} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black transition-all">Thêm Menu mới</button>
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
                  {customMenus.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800 uppercase">{m.title}</td>
                      <td className="px-6 py-4 text-xs text-blue-500 truncate max-w-xs">{m.url}</td>
                      <td className="px-6 py-4 text-xs font-mono">/p/{m.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${m.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {m.isActive ? 'Đang hiện' : 'Đang ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => { setEditingMenu(m); setIsEditingMenu(true); }} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa</button>
                        <button onClick={() => { if(confirm('Xóa menu này?')) deleteCustomMenu(m.id); }} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
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
        )}

        {tab === 'orders' && (
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
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs uppercase text-[#ee4d2d]">#{o.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-xs">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400">{o.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">₫{o.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as any)} 
                          className={`text-[9px] font-black border rounded p-1.5 outline-none uppercase transition-colors ${
                            o.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                            o.status === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-orange-50 text-orange-600 border-orange-200'
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
                        <button 
                          onClick={() => setViewingOrder(o)}
                          className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-sm hover:bg-black transition-all shadow-sm"
                        >
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
        )}

        {tab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <h2 className="text-xl font-black uppercase italic shrink-0">Quản lý Đánh giá ({reviews.length})</h2>
               <button 
                  onClick={() => {
                    setPartialReview({ 
                      rating: 5, 
                      tags: [], 
                      images: [''], 
                      createdAt: getLocalDatetimeString() 
                    });
                    setReviewProductSearch('');
                    setIsEditingReview(true);
                  }}
                  className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black transition-all"
               >
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
                  {currentReviews.map(rev => {
                    const prod = products.find(p => p.id === rev.productId);
                    return (
                      <tr key={rev.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={prod?.images[0]} className="w-8 h-8 object-cover rounded-sm border" />
                            <div className="font-bold text-xs truncate max-w-[200px]">{prod?.name || 'Sản phẩm đã xóa'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-black text-xs text-slate-800">{rev.userName}</div>
                           {rev.isManual && <span className="text-[8px] font-black text-blue-600 uppercase italic">(Admin thêm)</span>}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1 text-yellow-400 mb-1">
                              {[...Array(5)].map((_, i) => <i key={i} className={`fa-star ${i < rev.rating ? 'fa-solid' : 'fa-regular'}`}></i>)}
                           </div>
                           <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{rev.comment}"</p>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                           {new Date(rev.createdAt).toLocaleString('vi-VN', { 
                             day: '2-digit', 
                             month: '2-digit', 
                             year: 'numeric', 
                             hour: '2-digit', 
                             minute: '2-digit', 
                             hour12: false 
                           })}
                        </td>
                        <td className="px-6 py-4 text-right space-x-4">
                          <button 
                            onClick={() => handleEditReview(rev)}
                            className="text-blue-600 font-black text-[10px] uppercase hover:underline"
                          >
                            Sửa
                          </button>
                          <button 
                            onClick={() => { if(confirm('Xóa đánh giá này?')) deleteReview(rev.id); }}
                            className="text-red-500 font-black text-[10px] uppercase hover:underline"
                          >
                            Xóa
                          </button>
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
                <button 
                  disabled={currentReviewPage === 1}
                  onClick={() => setCurrentReviewPage(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                </button>
                
                {[...Array(totalReviewPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentReviewPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all ${currentReviewPage === i + 1 ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentReviewPage === totalReviewPages}
                  onClick={() => setCurrentReviewPage(prev => Math.min(totalReviewPages, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 disabled:opacity-30 border hover:bg-slate-200"
                >
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
                
                <span className="ml-4 text-[10px] font-black uppercase text-slate-400 italic">Trang {currentReviewPage} / {totalReviewPages}</span>
              </div>
            )}
          </div>
        )}

        {tab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-black uppercase italic tracking-tighter">Quản lý Bài viết Blog ({blogPosts.length})</h2>
               <button onClick={() => { setEditingBlog({ relatedProductIds: [], isPublished: true, views: 0, createdAt: new Date().toISOString() }); setIsEditingBlog(true); }} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase shadow-lg hover:bg-black">Viết bài mới</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {blogPosts.map(post => (
                 <div key={post.id} className="bg-white border rounded-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all shadow-sm">
                    <img src={post.image} className="aspect-video w-full object-cover" />
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
                       <button onClick={() => { setEditingBlog(post); setIsEditingBlog(true); }} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Sửa bài</button>
                       <button onClick={() => { if(confirm('Xóa bài viết này?')) deleteBlogPost(post.id); }} className="text-red-500 font-black text-[10px] uppercase hover:underline">Xóa</button>
                    </div>
                 </div>
               ))}
            </div>
            {blogPosts.length === 0 && (
              <div className="py-20 text-center text-slate-300 font-black uppercase text-xs">Chưa có bài viết nào</div>
            )}
          </div>
        )}

        {tab === 'marketing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic">Quản lý Mã giảm giá</h2>
              <button onClick={() => {setEditingCoupon({ scope: 'all', applicableCategories: [], type: 'fixed', isActive: true }); setIsEditingCoupon(true);}} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Tạo mã mới</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coupons.map(c => {
                const isFreeship = c.type === 'freeship';
                return (
                  <div key={c.id} className={`bg-white border-2 border-dashed p-6 rounded-sm relative flex flex-col justify-between hover:shadow-lg transition-all group ${isFreeship ? 'border-emerald-200' : 'border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div className={`text-2xl font-black mb-1 group-hover:scale-105 transition-transform flex items-center gap-2 ${isFreeship ? 'text-emerald-600' : 'text-[#ee4d2d]'}`}>
                          <i className={`fa-solid ${isFreeship ? 'fa-truck-fast' : 'fa-tag'} text-base opacity-70`}></i>
                          {c.code}
                        </div>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${c.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {c.isActive ? 'Đang chạy' : 'Dừng'}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${isFreeship ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {isFreeship ? 'Miễn phí vận chuyển' : (c.type === 'fixed' ? `Giảm ₫${c.value.toLocaleString()}` : `Giảm ${c.value}%`)}
                        {c.type === 'percent' && c.maxDiscount && (
                          <span className="text-[10px] text-slate-400 block font-normal">(Giảm tối đa ₫{c.maxDiscount.toLocaleString()})</span>
                        )}
                      </div>
                      <div className="mt-4 space-y-2">
                         <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${isFreeship ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>PHẠM VI</span>
                           <span className="text-[10px] font-bold text-slate-500">
                             {c.scope === 'all' ? 'Toàn sàn' : c.scope === 'category' ? `Ngành hàng (${c.applicableCategories?.join(', ')})` : 'Một sản phẩm cụ thể'}
                           </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${isFreeship ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>ĐIỀU KIỆN</span>
                           <span className="text-[10px] font-bold text-slate-500">Đơn từ ₫{c.minOrder.toLocaleString()}</span>
                         </div>
                         {(c.startDate || c.endDate) && (
                           <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-sm uppercase tracking-tighter">THỜI GIAN</span>
                             <span className="text-[10px] font-bold text-orange-500 italic">
                               {c.startDate ? new Date(c.startDate).toLocaleDateString() : '...'} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : '...'}
                             </span>
                           </div>
                         )}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4 text-[10px] font-black border-t pt-4">
                      <button onClick={() => {setEditingCoupon(c); setIsEditingCoupon(true);}} className="text-blue-600 uppercase hover:underline">Sửa mã</button>
                      <button onClick={() => deleteCoupon(c.id)} className="text-red-500 uppercase hover:underline">Xóa</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'alerts' && (
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
                  {stockAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(alert => (
                    <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-xs text-slate-800">{alert.productName}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono">ID: {alert.productId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-xs text-[#ee4d2d]">{alert.contact}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(alert.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${alert.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {alert.status === 'pending' ? 'Chờ báo hàng' : 'Đã thông báo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { if(confirm('Xóa yêu cầu này?')) deleteStockAlert(alert.id); }}
                          className="text-red-500 font-black text-[10px] uppercase hover:underline"
                        >
                          Xóa yêu cầu
                        </button>
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
        )}

        {tab === 'brands' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-xl font-black uppercase italic">Thương hiệu đối tác</h2><button onClick={() => {setEditingBrand({}); setIsEditingBrand(true);}} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Thương Hiệu</button></div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {brands.map(b => (
                <div key={b.id} className="border p-4 rounded-sm flex flex-col items-center gap-3">
                  <img src={b.logoUrl} className="h-10 object-contain" />
                  <div className="font-bold text-xs uppercase">{b.name}</div>
                  <div className="flex gap-4 text-[9px] font-black">
                    <button onClick={() => {setEditingBrand(b); setIsEditingBrand(true);}} className="text-blue-600">SỬA</button>
                    <button onClick={() => deleteBrand(b.id)} className="text-red-500">XÓA</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase italic mb-8 border-b pb-4 flex items-center gap-3"><i className="fa-solid fa-list text-[#ee4d2d]"></i> Hiển thị & Thứ tự ngành hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(Category).map(cat => {
                const config = categoryConfigs.find(c => c.category === cat) || { category: cat, order: 99 };
                const isVisible = visibleCategories.includes(cat);
                const theme = categoryThemes.find(t => t.category === cat);
                
                return (
                  <div key={cat} className={`p-4 border rounded-sm flex flex-col gap-4 transition-all shadow-sm ${isVisible ? 'bg-white border-slate-200' : 'bg-slate-50 opacity-60'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-black uppercase text-slate-400">Thứ tự</label>
                          <input 
                            type="number" 
                            min="1"
                            className="w-14 p-1.5 border rounded-sm text-[11px] font-black text-center focus:border-[#ee4d2d] outline-none" 
                            value={config.order}
                            onChange={(e) => handleOrderChange(cat, e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">{cat}</span>
                          <span className={`text-[8px] font-bold uppercase ${isVisible ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleCategoryVisibility(cat)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVisible ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                      >
                        <i className={`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                      </button>
                    </div>
                    
                    {theme ? (
                      <div className="pt-2 border-t flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                           <img src={theme.image} className="w-12 h-8 object-cover rounded-sm border" />
                           <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black text-slate-400 uppercase truncate">Banner: {theme.image}</p>
                              <p className="text-[9px] font-bold text-slate-600 italic truncate">"{theme.slogan}"</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => { setEditingTheme(theme); setIsEditingTheme(true); }}
                          className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase rounded-sm hover:bg-[#ee4d2d] transition-colors shrink-0"
                        >
                          Sửa Banner
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t flex justify-end">
                         <button 
                          onClick={() => { setEditingTheme({ category: cat, color: 'from-slate-600', accentClass: 'text-slate-800', bgClass: 'bg-slate-50' }); setIsEditingTheme(true); }}
                          className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-sm hover:bg-[#ee4d2d] transition-colors"
                        >
                          + Thêm Banner
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'commitments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-xl font-black uppercase italic">Cam kết dịch vụ</h2><button onClick={() => {setEditingCommitment({}); setIsEditingCommitment(true);}} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Cam Kết</button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{commitments.map(c => (<div key={c.id} className="border p-6 rounded-sm space-y-4"><div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border text-blue-600"><i className={`fa-solid ${c.icon} text-xl`}></i></div><div><h3 className="font-black text-sm uppercase">{c.title}</h3><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{c.desc}</p></div><div className="flex gap-4 text-[9px] font-black"><button onClick={() => {setEditingCommitment(c); setIsEditingCommitment(true);}} className="text-blue-600">SỬA</button><button onClick={() => deleteCommitment(c.id)} className="text-red-500">XÓA</button></div></div>))}</div>
          </div>
        )}

        {tab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic">Quản lý Banners</h2>
              <button onClick={() => {setEditingBanner({ position: 'main', isActive: true, buttonText: 'XEM NGAY', link: '/' }); setIsEditingBanner(true);}} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-black text-xs uppercase">Thêm Banner</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map(b => (
                <div key={b.id} className={`border rounded-sm overflow-hidden ${!b.isActive ? 'opacity-50 grayscale' : ''}`}>
                  <img src={b.imageUrl} className="h-40 w-full object-cover" />
                  <div className="p-4 flex justify-between items-center bg-slate-50">
                    <div>
                      <div className="font-black text-xs uppercase">{b.title || 'Banner không tiêu đề'}</div>
                      <div className="text-[9px] font-bold text-slate-400 italic">
                        Loại: {b.position === 'main' ? 'Slide Ngang (Băng tải chính)' : 'Slide Dọc (Cạnh Slide chính)'} | {b.isActive ? 'Đang hiện' : 'Đang ẩn'}
                      </div>
                    </div>
                    <div className="flex gap-4 text-[9px] font-black">
                      <button onClick={() => {setEditingBanner(b); setIsEditingBanner(true);}} className="text-blue-600 uppercase">Sửa</button>
                      <button onClick={() => deleteBanner(b.id)} className="text-red-500 uppercase">Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'popup' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
              <i className="fa-solid fa-window-maximize text-[#ee4d2d]"></i> Cấu hình Popup Quảng Cáo
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-sm">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Trạng thái Popup</span>
                        <span className="text-[10px] text-slate-400 font-bold">Bật/Tật hiển thị toàn trang chủ</span>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={tempHomePopup.isActive} onChange={e => setTempHomePopup({...tempHomePopup, isActive: e.target.checked})} />
                       <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                     </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Link Ảnh Popup *</label>
                    <input className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.imageUrl} onChange={e => setTempHomePopup({...tempHomePopup, imageUrl: e.target.value})} placeholder="https://..." />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Link liên kết (Khi khách click)</label>
                    <input className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.link} onChange={e => setTempHomePopup({...tempHomePopup, link: e.target.value})} placeholder="/flash-sales" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Thời gian bắt đầu</label>
                        <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.startDate || ''} onChange={e => setTempHomePopup({...tempHomePopup, startDate: e.target.value})} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Thời gian kết thúc</label>
                        <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={tempHomePopup.endDate || ''} onChange={e => setTempHomePopup({...tempHomePopup, endDate: e.target.value})} />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Xem trước Popup</h3>
                  <div className="bg-slate-100 p-8 rounded-sm border-2 border-dashed flex items-center justify-center min-h-[350px]">
                     {tempHomePopup.imageUrl ? (
                        <div className="relative max-w-[200px] shadow-2xl rounded-sm overflow-hidden border-2 border-white">
                           <img src={tempHomePopup.imageUrl} className="w-full h-auto" />
                           <div className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-[8px]"><i className="fa-solid fa-xmark"></i></div>
                        </div>
                     ) : (
                        <span className="text-slate-400 italic text-xs uppercase font-bold">Chưa có ảnh cấu hình</span>
                     )}
                  </div>
               </div>
            </div>
            <button onClick={() => {updateHomePopup(tempHomePopup); alert('Đã lưu cấu hình Popup!');}} className="w-full py-5 bg-slate-900 text-white font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:bg-black transition-all">Lưu Cấu Hình Popup</button>
          </div>
        )}

        {tab === 'app' && (
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
                        <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.zaloUrl || ''} onChange={e => setTempAppConfig({...tempAppConfig, zaloUrl: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Đường dẫn Messenger (https://m.me/...)</label>
                        <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.messengerUrl || ''} onChange={e => setTempAppConfig({...tempAppConfig, messengerUrl: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Số Hotline</label>
                        <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.hotline || ''} onChange={e => setTempAppConfig({...tempAppConfig, hotline: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Link đăng ký Bộ Công Thương</label>
                        <input className="w-full p-2.5 bg-white border text-xs" value={tempAppConfig.bctUrl || ''} onChange={e => setTempAppConfig({...tempAppConfig, bctUrl: e.target.value})} />
                      </div>
                   </div>
                </section>

                <section className="space-y-6 bg-white p-4 rounded-sm border">
                  <h3 className="text-[10px] font-black uppercase text-slate-900 border-b pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-image text-[#ee4d2d]"></i> Tinh chỉnh Logo Navbar
                  </h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">URL Logo Shop</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border text-sm focus:border-[#ee4d2d] outline-none" 
                      placeholder="https://..."
                      value={tempAppConfig.logoUrl || ''} 
                      onChange={e => setTempAppConfig({...tempAppConfig, logoUrl: e.target.value})} 
                    />
                  </div>

                  {/* LOGO SCALE CONTROLLER */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase text-slate-400">Kích thước Logo (To/Nhỏ)</label>
                      <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoScale || 1}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3" step="0.1" 
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ee4d2d]" 
                      value={tempAppConfig.logoScale || 1} 
                      onChange={e => setTempAppConfig({...tempAppConfig, logoScale: parseFloat(e.target.value)})} 
                    />
                  </div>

                  {/* LOGO POSITION CONTROLLERS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase text-slate-400">Vị trí Ngang (X)</label>
                        <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoX || 0}px</span>
                      </div>
                      <input 
                        type="range" min="-100" max="100" step="1" 
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" 
                        value={tempAppConfig.logoX || 0} 
                        onChange={e => setTempAppConfig({...tempAppConfig, logoX: parseInt(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase text-slate-400">Vị trí Dọc (Y)</label>
                        <span className="text-[10px] font-bold text-[#ee4d2d]">{tempAppConfig.logoY || 0}px</span>
                      </div>
                      <input 
                        type="range" min="-50" max="50" step="1" 
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" 
                        value={tempAppConfig.logoY || 0} 
                        onChange={e => setTempAppConfig({...tempAppConfig, logoY: parseInt(e.target.value)})} 
                      />
                    </div>
                  </div>
                </section>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">QR Code Tải App</label>
                  <input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.qrCodeUrl} onChange={e => setTempAppConfig({...tempAppConfig, qrCodeUrl: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400">iOS App Store</label><input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.appStoreUrl} onChange={e => setTempAppConfig({...tempAppConfig, appStoreUrl: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400">Android Google Play</label><input className="w-full p-3 bg-slate-50 border text-sm" value={tempAppConfig.googlePlayUrl} onChange={e => setTempAppConfig({...tempAppConfig, googlePlayUrl: e.target.value})} /></div>
                </div>
              </div>

              {/* LIVE PREVIEW AREA */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Xem trước hiển thị Navbar</h3>
                 <div className="bg-[#ee4d2d] p-10 rounded-sm border-4 border-slate-200 flex items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-[8px] font-black text-white/40 uppercase">Mô phỏng Thanh Navbar thực tế</div>
                    {tempAppConfig.logoUrl ? (
                      <div className="h-14 flex items-center justify-center bg-white/5 border border-white/10 px-10 relative overflow-visible" style={{ width: '280px' }}>
                        <img 
                          src={tempAppConfig.logoUrl} 
                          className="w-auto h-full object-contain pointer-events-none"
                          style={{
                            transform: `translate(${tempAppConfig.logoX || 0}px, ${tempAppConfig.logoY || 0}px) scale(${tempAppConfig.logoScale || 1})`,
                            transformOrigin: 'center center',
                            maxWidth: 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-white/40 italic text-xs font-bold uppercase tracking-widest text-center">Chưa có Logo<br/>Vui lòng nhập link bên cạnh</div>
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

            <button 
              onClick={() => {updateAppConfig(tempAppConfig); alert('Hệ thống đã cập nhật cấu hình mới!');}} 
              className="w-full py-5 bg-slate-900 text-white font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-black active:scale-[0.99] transition-all"
            >
              Lưu & Cố định cấu hình
            </button>
          </div>
        )}
      </div>

      {isEditingMenu && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                 <h3 className="text-lg font-black uppercase italic tracking-tighter">Cấu hình Menu ẩn (Trang nhúng)</h3>
                 <button onClick={() => setIsEditingMenu(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <form onSubmit={handleSaveMenu} className="p-6 space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Tên Menu hiển thị *</label>
                    <input required placeholder="VD: Bảng giá đối tác..." className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingMenu.title || ''} onChange={e => setEditingMenu({...editingMenu, title: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">URL trang web nhúng (Link ẩn) *</label>
                    <input required type="url" placeholder="https://..." className="w-full p-3 bg-slate-50 border text-sm italic" value={editingMenu.url || ''} onChange={e => setEditingMenu({...editingMenu, url: e.target.value})} />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-sm">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Trạng thái Menu</span>
                       <span className="text-[10px] text-slate-400 font-bold">Bật/Tắt hiển thị trên thanh điều hướng</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={editingMenu.isActive ?? true} onChange={e => setEditingMenu({...editingMenu, isActive: e.target.checked})} />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                    </label>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditingMenu(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy bỏ</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">Lưu & Hiển thị Menu</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isEditingBlog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
           <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative my-8">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                 <h3 className="text-lg font-black uppercase italic tracking-tighter">Biên tập bài viết Blog</h3>
                 <button onClick={() => setIsEditingBlog(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <form onSubmit={handleSaveBlog} className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar" style={{maxHeight: 'calc(90vh - 80px)'}}>
                 <div className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Tiêu đề bài viết *</label>
                       <input required placeholder="Nhập tiêu đề hấp dẫn..." className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingBlog.title || ''} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400">Chuyên mục</label>
                          <input placeholder="VD: Mẹo vặt, Tin tức..." className="w-full p-3 bg-slate-50 border text-sm" value={editingBlog.category || ''} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400">Tác giả</label>
                          <input placeholder="VD: Admin" className="w-full p-3 bg-slate-50 border text-sm" value={editingBlog.author || ''} onChange={e => setEditingBlog({...editingBlog, author: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Ảnh đại diện (URL) *</label>
                       <input required placeholder="https://..." className="w-full p-3 bg-slate-50 border text-sm" value={editingBlog.image || ''} onChange={e => setEditingBlog({...editingBlog, image: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Link Video (YouTube/Drive)</label>
                       <input placeholder="https://www.youtube.com/watch?v=..." className="w-full p-3 bg-slate-50 border text-sm italic" value={editingBlog.videoUrl || ''} onChange={e => setEditingBlog({...editingBlog, videoUrl: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Mô tả ngắn (Excerpt)</label>
                       <textarea rows={3} placeholder="Tóm tắt nội dung bài viết..." className="w-full p-3 bg-slate-50 border text-sm resize-none" value={editingBlog.excerpt || ''} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} />
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-blue-700">Liên kết Sản phẩm liên quan</label>
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
                               {blogProductSearchResults.map(p => (
                                 <button 
                                   key={p.id} 
                                   type="button"
                                   onClick={() => {
                                     const current = editingBlog.relatedProductIds || [];
                                     if (!current.includes(p.id)) {
                                       setEditingBlog({ ...editingBlog, relatedProductIds: [...current, p.id] });
                                     }
                                     setBlogProductSearch('');
                                     setShowBlogProductResults(false);
                                   }}
                                   className="w-full text-left p-3 hover:bg-slate-50 border-b text-[10px] flex items-center gap-3"
                                 >
                                    <img src={p.images[0]} className="w-8 h-8 object-cover rounded-sm" />
                                    <span className="font-bold">{p.name}</span>
                                 </button>
                               ))}
                            </div>
                          )}
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {editingBlog.relatedProductIds?.map(pid => {
                            const p = products.find(prod => prod.id === pid);
                            return (
                              <div key={pid} className="flex items-center gap-2 bg-white border px-2 py-1 rounded-full">
                                 <span className="text-[9px] font-bold text-slate-600 truncate max-w-[100px]">{p?.name || pid}</span>
                                 <button type="button" onClick={() => setEditingBlog({...editingBlog, relatedProductIds: editingBlog.relatedProductIds?.filter(id => id !== pid)})} className="text-red-500"><i className="fa-solid fa-circle-xmark"></i></button>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Nội dung bài viết</h3>
                       <button type="button" onClick={handleAIBlog} className="bg-blue-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase flex items-center gap-2">
                          <i className={`fa-solid ${isGenerating ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'}`}></i> AI Viết bài
                       </button>
                    </div>
                    <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
                       <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                          <button type="button" onClick={() => execCommand('bold')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold" title="In đậm">B</button>
                          <button type="button" onClick={() => execCommand('italic')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic" title="In nghiêng">I</button>
                          <button type="button" onClick={() => execCommand('insertUnorderedList')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs" title="Danh sách"><i className="fa-solid fa-list-ul"></i></button>
                          <button type="button" onClick={insertLink} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-blue-600" title="Gắn liên kết"><i className="fa-solid fa-link"></i></button>
                          <button type="button" onClick={() => execCommand('unlink')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs text-red-400" title="Bỏ liên kết"><i className="fa-solid fa-link-slash"></i></button>
                          <button type="button" onClick={insertImage} className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 rounded text-blue-600 text-xs" title="Chèn ảnh"><i className="fa-solid fa-image"></i></button>
                       </div>
                       <div 
                         ref={blogEditorRef}
                         contentEditable 
                         className="p-5 min-h-[30rem] max-h-[40rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white"
                         spellCheck={false}
                       ></div>
                    </div>
                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                       <button type="button" onClick={() => setIsEditingBlog(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy</button>
                       <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">Lưu Bài Viết</button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isEditingReview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative my-8">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                 <h3 className="text-lg font-black uppercase italic tracking-tighter">
                   {editingReview.id ? 'Cập nhật đánh giá' : 'Thêm đánh giá thủ công (Admin)'}
                 </h3>
                 <button onClick={() => setIsEditingReview(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <form onSubmit={handleSaveManualReview} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar" style={{maxHeight: 'calc(90vh - 80px)'}}>
                 
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
                         onChange={e => { setReviewProductSearch(e.target.value); setShowReviewProductResults(true); }}
                       />
                       {showReviewProductResults && reviewProductSearchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm">
                             {reviewProductSearchResults.map(p => (
                               <button 
                                 key={p.id} 
                                 type="button"
                                 onClick={() => {
                                   setPartialReview({ ...editingReview, productId: p.id });
                                   setReviewProductSearch(p.name);
                                   setShowReviewProductResults(false);
                                 }}
                                 className="w-full text-left p-3 hover:bg-slate-50 border-b text-[11px] flex items-center gap-3"
                               >
                                  <img src={p.images[0]} className="w-8 h-8 object-cover rounded-sm" />
                                  <span className="font-bold">{p.name}</span>
                               </button>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Tên người đánh giá *</label>
                       <input required placeholder="VD: Anh Minh, Chị Lan..." className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingReview.userName || ''} onChange={e => setPartialReview({...editingReview, userName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Ngày & Giờ tạo *</label>
                       <input type="datetime-local" required className="w-full p-3 bg-slate-50 border text-sm" value={editingReview.createdAt || ''} onChange={e => setPartialReview({...editingReview, createdAt: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 block text-center">Mức độ hài lòng (Số sao)</label>
                    <div className="flex justify-center gap-4">
                       {[1,2,3,4,5].map(star => (
                         <button key={star} type="button" onClick={() => setPartialReview({...editingReview, rating: star})} className={`text-2xl transition-all ${editingReview.rating! >= star ? 'text-yellow-400 scale-125' : 'text-slate-200'}`}>
                            <i className="fa-solid fa-star"></i>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Chọn tags đánh giá nhanh</label>
                    <div className="flex flex-wrap gap-2">
                       {REVIEW_TAGS.map(tag => (
                         <button 
                           key={tag} 
                           type="button" 
                           onClick={() => toggleReviewTag(tag)}
                           className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${editingReview.tags?.includes(tag) ? 'bg-emerald-50 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#ee4d2d]/50'}`}
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
                      value={editingReview.comment || ''} 
                      onChange={e => setPartialReview({...editingReview, comment: e.target.value})}
                    />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black uppercase text-slate-400">Hình ảnh thực tế (Link)</label>
                       <button type="button" onClick={addReviewImageLink} className="text-[10px] font-black text-blue-600 uppercase hover:underline">+ Thêm link ảnh</button>
                    </div>
                    <div className="space-y-2">
                       {editingReview.images?.map((url, i) => (
                         <div key={i} className="flex gap-2 items-center">
                            <div className="w-10 h-10 border bg-white shrink-0">
                               {url ? <img src={url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><i className="fa-solid fa-image text-xs text-slate-300"></i></div>}
                            </div>
                            <input placeholder="https://..." className="flex-1 p-2 bg-slate-50 border text-[11px]" value={url} onChange={e => updateReviewImageLink(i, e.target.value)} />
                            <button type="button" onClick={() => removeReviewImageLink(i)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                    <button type="button" onClick={() => setIsEditingReview(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy bỏ</button>
                    <button type="submit" disabled={isGenerating} className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">
                       {isGenerating ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : (editingReview.id ? 'CẬP NHẬT' : 'LƯU ĐÁNH GIÁ')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isEditingTheme && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter">Sửa Giao diện Ngành: {editingTheme.category}</h3>
                <button onClick={() => setIsEditingTheme(false)}><i className="fa-solid fa-xmark"></i></button>
             </div>
             <form onSubmit={handleSaveTheme} className="p-6 space-y-5">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Link Ảnh Banner (1200x400)</label>
                   <input required placeholder="https://..." className="w-full p-3 bg-slate-50 border text-xs" value={editingTheme.image || ''} onChange={e => setEditingTheme({...editingTheme, image: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Slogan ngành hàng</label>
                   <input required placeholder="Nhập câu slogan..." className="w-full p-3 bg-slate-50 border text-xs font-bold" value={editingTheme.slogan || ''} onChange={e => setEditingTheme({...editingTheme, slogan: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-2">
                   <button type="button" onClick={() => setIsEditingTheme(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 font-black uppercase text-[10px]">Hủy</button>
                   <button type="submit" className="flex-[2] py-3 bg-[#ee4d2d] text-white font-black uppercase text-[10px] shadow-lg">Cập nhật giao diện</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            <div className="p-4 md:p-6 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
              <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Cấu hình sản phẩm Master</h2>
              <button onClick={() => setIsEditing(false)}><i className="fa-solid fa-xmark text-2xl"></i></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 overflow-y-auto custom-scrollbar" style={{maxHeight: 'calc(90vh - 80px)'}}>
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase text-[#ee4d2d] border-b pb-2">Thông tin bán hàng</h3>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Tên sản phẩm *</label>
                    <input
  required
  placeholder="Tên sản phẩm *"
  className="w-full p-3 bg-slate-50 border text-sm font-bold"
  value={editingProduct.name || ''}
  onChange={e => {
    setEditingProduct({...editingProduct, name: e.target.value})
    setDuplicateProduct(null)   // reset cảnh báo trùng
  }}
  onBlur={(e) => checkDuplicateProductName(e.target.value)}
/>
{duplicateProduct && (
  <div style={{ color: "red", marginTop: 5 }}>
    ⚠️ Sản phẩm trùng:{" "}
    <Link
  href={`/product/${createSlug(duplicateProduct.name)}-${duplicateProduct.id}`}
  target="_blank"
  style={{ textDecoration: "underline", fontWeight: 600 }}
>
  {duplicateProduct.name}
</Link>
  </div>
)}
{duplicateNameWarning && (
  <p className="text-red-500 text-xs mt-1">
    {duplicateNameWarning}
  </p>
)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 relative" ref={brandSearchRef}>
                      <label className="text-[9px] font-black text-slate-400 uppercase">Thương hiệu *</label>
                      <input 
                        required
                        placeholder="Tìm thương hiệu..." 
                        className="w-full p-3 bg-slate-50 border text-sm font-bold" 
                        value={editingProduct.brand || ''} 
                        onFocus={() => setShowBrandResults(true)}
                        onChange={e => {
                          setEditingProduct({...editingProduct, brand: e.target.value});
                          setShowBrandResults(true);
                        }} 
                      />
                      {showBrandResults && brandSearchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm border-slate-200">
                          {brandSearchResults.map(b => (
                            <button 
                              key={b.id} 
                              type="button"
                              onClick={() => {
                                setEditingProduct({...editingProduct, brand: b.name});
                                setShowBrandResults(false);
                              }}
                              className="w-full text-left p-3 hover:bg-slate-50 border-b last:border-none text-xs flex items-center gap-3 transition-colors"
                            >
                              <img src={b.logoUrl} className="w-6 h-6 object-contain grayscale opacity-60" alt={b.name} />
                              <span className="font-bold text-slate-700">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Ngành hàng</label>
                      <select className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Giá bán (₫) *</label>
                      <input type="number" required placeholder="₫" className="w-full p-3 bg-white border-2 border-[#ee4d2d]/20 text-sm font-black text-[#ee4d2d]" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Giá gốc (Gạch chân)</label>
                      <input type="number" placeholder="₫" className="w-full p-3 bg-slate-50 border text-sm opacity-60" value={editingProduct.originalPrice || ''} onChange={e => setEditingProduct({...editingProduct, originalPrice: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Tồn kho</label>
                      <input type="number" placeholder="Kho" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng đã bán</label>
                      <input type="number" placeholder="Đã bán" className="w-full p-3 bg-slate-50 border text-sm font-bold text-blue-600" value={editingProduct.soldCount || ''} onChange={e => setEditingProduct({...editingProduct, soldCount: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Sao (1-5)</label>
                      <input type="number" placeholder="Đánh giá" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.rating || ''} onChange={e => setEditingProduct({...editingProduct, rating: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Bảo hành (Tháng)</label>
                      <input type="number" placeholder="BH" className="w-full p-3 bg-slate-50 border text-sm" value={editingProduct.warrantyMonths || ''} onChange={e => setEditingProduct({...editingProduct, warrantyMonths: Number(e.target.value)})} />
                    </div>
                  </div>
                </section>

                <section className="p-4 bg-slate-50 border rounded-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-[11px] font-black uppercase text-slate-900">Ảnh & Video sản phẩm</h3>
                    <button type="button" onClick={addImageField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm ảnh</button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.images?.map((img, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="w-10 h-10 border bg-white shrink-0">
                          {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100" />}
                        </div>
                        <input placeholder="Link ảnh (https://...)" className="flex-1 p-2 bg-white border text-[11px]" value={img} onChange={e => updateImageField(i, e.target.value)} />
                        <button type="button" onClick={() => removeImageField(i)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Danh sách Video (YouTube/Drive)</label>
                        <button type="button" onClick={addVideoField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm video</button>
                      </div>
                      <div className="space-y-2">
                        {editingProduct.videoUrls?.map((v, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <div className="w-10 h-10 border bg-white shrink-0 flex items-center justify-center">
                               <i className="fa-brands fa-youtube text-red-600 text-lg"></i>
                            </div>
                            <input placeholder="Link video nhúng..." className="flex-1 p-2 bg-white border text-[11px]" value={v} onChange={e => updateVideoField(i, e.target.value)} />
                            <button type="button" onClick={() => removeVideoField(i)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
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
                            <span className="text-[8px] text-slate-400 font-bold">Không hiện trên shop</span>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={editingProduct.isHidden || false} onChange={e => setEditingProduct({...editingProduct, isHidden: e.target.checked})} />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                         </label>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Hết hàng</span>
                            <span className="text-[8px] text-slate-400 font-bold">Hiện nhãn "HẾT HÀNG"</span>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={editingProduct.isOutOfStock || false} onChange={e => setEditingProduct({...editingProduct, isOutOfStock: e.target.checked})} />
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
                           <input type="checkbox" className="sr-only peer" checked={editingProduct.hideWarranty || false} onChange={e => setEditingProduct({...editingProduct, hideWarranty: e.target.checked})} />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                         </label>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white border rounded-sm">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#ee4d2d] uppercase tracking-tighter">Hiện Cam Kết</span>
                            <span className="text-[8px] text-slate-400 font-bold">Hiển thị ở mục gợi ý</span>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={editingProduct.showCommitments || false} onChange={e => setEditingProduct({...editingProduct, showCommitments: e.target.checked})} />
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
                           <input type="checkbox" className="sr-only peer" checked={editingProduct.isFreeship || false} onChange={e => setEditingProduct({...editingProduct, isFreeship: e.target.checked})} />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                         </label>
                      </div>
                   </div>
                   {!editingProduct.isFreeship && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Phí vận chuyển cho SP này (₫) *</label>
                        <input type="number" placeholder="Nhập phí ship" className="w-full p-3 bg-white border text-sm font-bold focus:border-blue-400 outline-none" value={editingProduct.shippingFee || ''} onChange={e => setEditingProduct({...editingProduct, shippingFee: Number(e.target.value)})} />
                      </div>
                   )}
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Thông số kỹ thuật</h3>
                    <button type="button" onClick={addSpecField} className="text-[9px] font-black text-blue-600 uppercase">+ Thêm dòng</button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.specs?.map((spec, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input placeholder="Nhãn" className="w-1/3 p-2 bg-slate-50 border text-[11px] font-bold" value={spec.label} onChange={e => updateSpecField(i, 'label', e.target.value)} />
                        <input placeholder="Giá trị" className="w-full p-2 bg-slate-50 border text-[11px]" value={spec.value} onChange={e => updateSpecField(i, 'value', e.target.value)} />
                        <button type="button" onClick={() => removeSpecField(i)} className="text-red-500 px-1"><i className="fa-solid fa-trash-can text-xs"></i></button>
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
                    {editingProduct.variants?.map((v, i) => (
                      <div key={i} className="p-3 bg-white border rounded-sm space-y-3 relative group">
                        <button type="button" onClick={() => removeVariantField(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400">Tên phân loại (VD: Màu sắc, Dung lượng)</label>
                          <input placeholder="Nhãn phân loại" className="w-full p-2 bg-slate-50 border text-[11px] font-bold" value={v.label} onChange={e => updateVariantLabel(i, e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400">Các tùy chọn (Phân cách bằng dấu phẩy)</label>
                          <input placeholder="Đen, Trắng, Vàng..." className="w-full p-2 bg-slate-50 border text-[11px]" value={v.options.join(',')} onChange={e => updateVariantOptions(i, e.target.value)} />
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
                      <input type="number" placeholder="VD: 2" className="w-full p-3 bg-white border text-sm" value={editingProduct.promoBuyQty || ''} onChange={e => setEditingProduct({...editingProduct, promoBuyQty: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng tặng (Y)</label>
                      <input type="number" placeholder="VD: 1" className="w-full p-3 bg-white border text-sm" value={editingProduct.promoGetQty || ''} onChange={e => setEditingProduct({...editingProduct, promoGetQty: Number(e.target.value)})} />
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
                           onChange={e => { setGiftSearchQuery(e.target.value); setShowGiftResults(true); }}
                         />
                         {showGiftResults && giftSearchResults.length > 0 && (
                           <div className="absolute top-full left-0 right-0 bg-white border shadow-xl z-[150] max-h-48 overflow-y-auto rounded-sm">
                              {giftSearchResults.map(p => (
                                <button 
                                  key={p.id} 
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct({...editingProduct, promoGiftProductId: p.id, promoGiftName: p.name});
                                    setGiftSearchQuery(p.name);
                                    setShowGiftResults(false);
                                  }}
                                  className="w-full text-left p-3 hover:bg-blue-50 border-b text-xs flex items-center gap-2 transition-colors"
                                >
                                  <img src={p.images[0]} className="w-6 h-6 object-cover rounded-sm" />
                                  <span className="truncate font-medium">{p.name}</span>
                                </button>
                              ))}
                           </div>
                         )}
                       </div>
                       <button 
                         type="button" 
                         onClick={() => { setEditingProduct({...editingProduct, promoGiftProductId: undefined, promoGiftName: ''}); setGiftSearchQuery(''); }}
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
                      value={editingProduct.promoGiftName || ''} 
                      onChange={e => setEditingProduct({...editingProduct, promoGiftName: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-pink-600 uppercase italic">Bắt đầu tặng</label>
                      <input type="datetime-local" className="w-full p-2.5 bg-white border text-[10px]" value={editingProduct.giftStartDate || ''} onChange={e => setEditingProduct({...editingProduct, giftStartDate: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-pink-600 uppercase italic">Kết thúc tặng</label>
                      <input type="datetime-local" className="w-full p-2.5 bg-white border text-[10px]" value={editingProduct.giftEndDate || ''} onChange={e => setEditingProduct({...editingProduct, giftEndDate: e.target.value})} />
                    </div>
                  </div>
                </section>

                <section className="p-4 bg-purple-50 border border-purple-100 rounded-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-purple-200 pb-2">
                    <h3 className="text-[11px] font-black uppercase text-purple-700 italic flex items-center gap-2">
                      <i className="fa-solid fa-bolt-lightning text-yellow-500"></i> XẢ HÀNG SIÊU SỐC
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={editingProduct.isShockSale || false} onChange={e => setEditingProduct({...editingProduct, isShockSale: e.target.checked})} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  {editingProduct.isShockSale && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[9px] font-black text-purple-500 uppercase">Giá Xả Kho Siêu SỐC (₫) *</label>
                      <input type="number" required placeholder="Nhập giá xả kho cực rẻ" className="w-full p-3 bg-white border-2 border-purple-300 text-sm font-black text-purple-700" value={editingProduct.shockSalePrice || ''} onChange={e => setEditingProduct({...editingProduct, shockSalePrice: Number(e.target.value)})} />
                    </div>
                  )}
                </section>

                <section className="p-4 bg-pink-50 border border-pink-100 rounded-sm space-y-3">
                  <h3 className="text-[11px] font-black uppercase text-pink-700 italic border-b border-pink-200 pb-2">Quà tặng đặc quyền</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Tên quà tặng</label>
                      <input placeholder="Tên quà" className="w-full p-3 bg-white border border-pink-200 text-sm font-black" value={editingProduct.giftName || ''} onChange={e => setEditingProduct({...editingProduct, giftName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">URL Ảnh Quà</label>
                      <input placeholder="URL Ảnh Quà" className="w-full p-3 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftImage || ''} onChange={e => setEditingProduct({...editingProduct, giftImage: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-pink-600 uppercase italic">Bắt đầu tặng</label>
                        <input type="datetime-local" className="w-full p-2.5 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftStartDate || ''} onChange={e => setEditingProduct({...editingProduct, giftStartDate: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-pink-600 uppercase italic">Kết thúc tặng</label>
                        <input type="datetime-local" className="w-full p-2.5 bg-white border border-pink-200 text-[10px]" value={editingProduct.giftEndDate || ''} onChange={e => setEditingProduct({...editingProduct, giftEndDate: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-[11px] font-black uppercase text-[#ee4d2d]">Mô tả chi tiết sản phẩm</h3>
                    <button type="button" onClick={handleAIDescription} className="bg-blue-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase flex items-center gap-2 hover:bg-blue-700">
                      <i className={`fa-solid ${isGenerating ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'}`}></i>
                      {isGenerating ? 'AI Writing...' : 'AI Mô tả'}
                    </button>
                  </div>
                  
                  <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
                    <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                      <button type="button" onClick={() => execCommand('bold')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold">B</button>
                      <button type="button" onClick={() => execCommand('italic')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic">I</button>
                      <button type="button" onClick={() => execCommand('underline')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs underline">U</button>
                      <div className="w-px h-6 bg-slate-300 mx-1"></div>
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-list-ul"></i></button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-list-ol"></i></button>
                      <div className="w-px h-6 bg-slate-300 mx-1"></div>
                      <button type="button" title="Chèn hình ảnh vào mô tả" onClick={insertImage} className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-blue-600 text-xs"><i className="fa-solid fa-image"></i></button>
                    </div>
                    <div 
                      ref={descriptionEditorRef}
                      contentEditable 
                      className="p-5 min-h-[15rem] max-h-[30rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white"
                      spellCheck={false}
                    ></div>
                  </div>
                </section>

                <div className="pt-4 sticky bottom-0 bg-white pb-2 flex gap-3">
                   <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-slate-200 transition-colors">Đóng</button>
                   <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs shadow-xl tracking-widest rounded-sm hover:bg-[#d73211] transition-colors">Lưu Sản Phẩm</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isEditingCommitment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            <div className="p-4 md:p-5 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Cấu hình Cam kết dịch vụ</h2>
              <button onClick={() => setIsEditingCommitment(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <form onSubmit={handleSaveCommitment} className="p-6 space-y-6 overflow-y-auto custom-scrollbar" style={{maxHeight: 'calc(90vh - 64px)'}}>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-sm">
                 <h4 className="text-[10px] font-black uppercase text-orange-700 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Gợi ý nội dung mẫu
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyCommitmentTemplate('GENUINE')} className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all">Mẫu: Hoàn tiền 90 ngày</button>
                    <button type="button" onClick={() => applyCommitmentTemplate('SUPPORT')} className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all">Mẫu: Hỗ trợ 24/7</button>
                    <button type="button" onClick={() => applyCommitmentTemplate('RETURNS')} className="px-3 py-1.5 bg-white border border-orange-300 rounded-sm text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all">Mẫu: Đổi trả 15 ngày</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Icon (FontAwesome)</label>
                  <input required placeholder="VD: fa-shield-halved" className="w-full p-3 bg-slate-50 border text-sm" value={editingCommitment.icon || ''} onChange={e => setEditingCommitment({...editingCommitment, icon: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tiêu đề chính</label>
                  <input required placeholder="VD: CAM KẾT CHÍNH HÃNG" className="w-full p-3 bg-slate-50 border text-sm font-black uppercase" value={editingCommitment.title || ''} onChange={e => setEditingCommitment({...editingCommitment, title: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Dòng mô tả ngắn (Highlight)</label>
                <input placeholder="VD: HOÀN TIỀN TRONG 90 NGÀY..." className="w-full p-3 bg-slate-50 border text-sm font-bold text-[#ee4d2d] uppercase" value={editingCommitment.desc || ''} onChange={e => setEditingCommitment({...editingCommitment, desc: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Nội dung chi tiết chính sách (Rich Text)</label>
                <div className="border bg-white rounded-sm overflow-hidden flex flex-col shadow-inner">
                  <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border-b shrink-0">
                    <button type="button" onClick={() => execCommand('bold')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs font-bold">B</button>
                    <button type="button" onClick={() => execCommand('italic')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs italic">I</button>
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-list-ul"></i></button>
                    <button type="button" onClick={() => execCommand('justifyFull')} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-slate-200 text-xs"><i className="fa-solid fa-align-justify"></i></button>
                  </div>
                  <div 
                    ref={commitmentEditorRef}
                    contentEditable 
                    className="p-5 min-h-[15rem] max-h-[30rem] overflow-y-auto outline-none prose prose-sm max-w-none text-sm leading-relaxed custom-scrollbar bg-white"
                    spellCheck={false}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsEditingCommitment(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm">Hủy</button>
                <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl rounded-sm">Lưu Cam Kết</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isEditingBrand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-md rounded-sm shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center"><h3 className="font-black uppercase italic">Thương Hiệu Đối Tác</h3><button onClick={() => setIsEditingBrand(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <form onSubmit={handleSaveBrand} className="p-6 space-y-4">
               <input required placeholder="Tên thương hiệu" className="w-full p-3 bg-slate-50 border text-sm font-black" value={editingBrand.name || ''} onChange={e => setEditingBrand({...editingBrand, name: e.target.value})} />
               <input required placeholder="Logo URL" className="w-full p-3 bg-slate-50 border text-sm" value={editingBrand.logoUrl || ''} onChange={e => setEditingBrand({...editingBrand, logoUrl: e.target.value})} />
               <button type="submit" className="w-full py-3 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest">Lưu Thương Hiệu</button>
            </form>
          </div>
        </div>
      )}

      {isEditingBanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic tracking-tighter">Cấu hình Banner</h3>
              <button onClick={() => setIsEditingBanner(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSaveBanner} className="p-6 space-y-5">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">Loại hiển thị *</label>
                 <select 
                    className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]" 
                    value={editingBanner.position || 'main'} 
                    onChange={e => setEditingBanner({...editingBanner, position: e.target.value as any})}
                 >
                    <option value="main">Slide Ngang (Băng tải chính)</option>
                    <option value="side">Slide Dọc (Cạnh Slide chính)</option>
                 </select>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">Ảnh Banner (URL) *</label>
                 <input required placeholder="https://..." className="w-full p-3 bg-slate-50 border text-sm" value={editingBanner.imageUrl || ''} onChange={e => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })} />
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">Nội dung / Tiêu đề (Nếu có)</label>
                 <input placeholder="VD: GIẢM GIÁ 50% SMARTPHONE" className="w-full p-3 bg-slate-50 border text-sm font-black uppercase" value={editingBanner.title || ''} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} />
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">Link liên kết (Nếu có)</label>
                 <input placeholder="VD: /flash-sales hoặc https://..." className="w-full p-3 bg-slate-50 border text-sm" value={editingBanner.link || ''} onChange={e => setEditingBanner({...editingBanner, link: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Văn bản nút bấm</label>
                    <input placeholder="XEM NGAY" className="w-full p-3 bg-white border text-sm font-bold" value={editingBanner.buttonText || ''} onChange={e => setEditingBanner({...editingBanner, buttonText: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Hoạt động</label>
                    <div className="flex items-center h-[46px]">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={editingBanner.isActive ?? true} onChange={e => setEditingBanner({...editingBanner, isActive: e.target.checked})} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                      </label>
                    </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditingBanner(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px]">Hủy</button>
                  <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-widest shadow-xl">Lưu Banner</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {isEditingCoupon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 my-8">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-black uppercase italic tracking-tighter">Cấu hình Mã Giảm Giá Đặc Biệt</h3>
              <button onClick={() => setIsEditingCoupon(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSaveCoupon} className="p-6 md:p-8 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
               
               {/* Hàng 1: Mã & Trạng thái */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Mã giảm giá (CODE) *</label>
                   <input required placeholder="VD: ELECTRO100" className="w-full p-3 bg-slate-50 border text-sm font-black uppercase focus:border-[#ee4d2d] outline-none" value={editingCoupon.code || ''} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Trạng thái kích hoạt</label>
                    <div className="flex items-center h-[46px] bg-slate-50 px-4 rounded-sm border">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={editingCoupon.isActive ?? true} onChange={e => setEditingCoupon({...editingCoupon, isActive: e.target.checked})} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                      </label>
                      <span className="ml-3 text-[10px] font-black uppercase text-slate-400">{editingCoupon.isActive ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                    </div>
                 </div>
               </div>

               {/* Hàng 2: Loại giảm & Giá trị */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-sm border">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Hình thức giảm *</label>
                   <select className="w-full p-3 bg-white border text-sm font-bold h-[46px]" value={editingCoupon.type} onChange={e => setEditingCoupon({...editingCoupon, type: e.target.value as any})}>
                     <option value="fixed">Giảm số tiền cố định (₫)</option>
                     <option value="percent">Giảm theo phần trăm (%)</option>
                     <option value="freeship">Miễn phí vận chuyển (Freeship)</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Giá trị giảm *</label>
                   <input 
                     type="number" 
                     required={editingCoupon.type !== 'freeship'} 
                     disabled={editingCoupon.type === 'freeship'}
                     placeholder={editingCoupon.type === 'percent' ? 'VD: 15 (%)' : (editingCoupon.type === 'freeship' ? 'Không cần nhập giá trị' : 'VD: 100000 (₫)')} 
                     className="w-full p-3 bg-white border text-sm font-black text-[#ee4d2d] disabled:bg-slate-100 disabled:text-slate-400" 
                     value={editingCoupon.type === 'freeship' ? '' : (editingCoupon.value || '')} 
                     onChange={e => setEditingCoupon({...editingCoupon, value: Number(e.target.value)})} 
                   />
                 </div>
                 {editingCoupon.type === 'percent' && (
                   <div className="md:col-span-2 space-y-1 animate-in slide-in-from-top-2">
                     <label className="text-[10px] font-black uppercase text-blue-600">Giảm tối đa (₫) - Chặn mức giảm lớn nhất</label>
                     <input type="number" placeholder="VD: 200000 (Nếu để trống sẽ không giới hạn)" className="w-full p-3 bg-white border border-blue-200 text-sm font-black text-blue-700" value={editingCoupon.maxDiscount || ''} onChange={e => setEditingCoupon({...editingCoupon, maxDiscount: Number(e.target.value)})} />
                   </div>
                 )}
               </div>

               {/* Hàng 3: Điều kiện & Phạm vi */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Đơn hàng tối thiểu (₫) *</label>
                   <input type="number" required placeholder="VD: 500000" className="w-full p-3 bg-slate-50 border text-sm" value={editingCoupon.minOrder || ''} onChange={e => setEditingCoupon({...editingCoupon, minOrder: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Phạm vi áp dụng</label>
                   <select className="w-full p-3 bg-slate-50 border text-sm font-bold h-[46px]" value={editingCoupon.scope} onChange={e => setEditingCoupon({...editingCoupon, scope: e.target.value as any})}>
                     <option value="all">Toàn sàn (Tất cả sản phẩm)</option>
                     <option value="category">Theo ngành hàng</option>
                     <option value="product">Một sản phẩm cụ thể</option>
                   </select>
                 </div>
               </div>

               {/* Điều kiện bổ sung: Category / Product */}
               {editingCoupon.scope === 'category' && (
                 <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm space-y-2 animate-in fade-in">
                   <label className="text-[10px] font-black uppercase text-orange-700">Chọn các ngành hàng áp dụng</label>
                   <div className="grid grid-cols-2 gap-2">
                     {Object.values(Category).map(cat => (
                       <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded-sm">
                         <input 
                           type="checkbox" 
                           checked={editingCoupon.applicableCategories?.includes(cat)} 
                           onChange={e => {
                             const current = editingCoupon.applicableCategories || [];
                             if (e.target.checked) setEditingCoupon({...editingCoupon, applicableCategories: [...current, cat]});
                             else setEditingCoupon({...editingCoupon, applicableCategories: current.filter(c => c !== cat)});
                           }}
                         />
                         <span className="text-[10px] font-bold text-slate-600">{cat}</span>
                       </label>
                     ))}
                   </div>
                 </div>
               )}

               {editingCoupon.scope === 'product' && (
                 <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black uppercase text-blue-700 italic">Tìm sản phẩm được áp dụng</label>
                    <div className="relative">
                       <input 
                         placeholder="Nhập tên sản phẩm..." 
                         className="w-full p-3 bg-white border text-xs" 
                         value={couponProductSearch} 
                         onChange={e => setCouponProductSearch(e.target.value)}
                       />
                       {couponProductSearchResults.length > 0 && (
                         <div className="absolute top-full left-0 right-0 bg-white border shadow-2xl z-[150] max-h-48 overflow-y-auto rounded-sm mt-1">
                            {couponProductSearchResults.map(p => (
                              <button 
                                key={p.id} 
                                type="button"
                                onClick={() => {
                                  setEditingCoupon({...editingCoupon, productId: p.id});
                                  setCouponProductSearch(p.name);
                                }}
                                className={`w-full text-left p-3 hover:bg-slate-50 border-b text-[10px] flex items-center gap-3 transition-colors ${editingCoupon.productId === p.id ? 'bg-blue-100' : ''}`}
                              >
                                <img src={p.images[0]} className="w-8 h-8 object-cover rounded-sm" />
                                <span className="font-bold">{p.name}</span>
                                {editingCoupon.productId === p.id && <i className="fa-solid fa-check text-blue-600 ml-auto"></i>}
                              </button>
                            ))}
                         </div>
                       )}
                    </div>
                    {editingCoupon.productId && (
                      <div className="flex items-center gap-3 bg-white p-2 rounded-sm border shadow-sm">
                         <i className="fa-solid fa-link text-blue-500"></i>
                         <span className="text-[10px] font-black text-slate-700">ID: {editingCoupon.productId}</span>
                         <button type="button" onClick={() => setEditingCoupon({...editingCoupon, productId: undefined})} className="ml-auto text-red-500 text-[10px] hover:underline">Hủy chọn</button>
                      </div>
                    )}
                 </div>
               )}

               {/* Hàng cuối: Thời gian áp dụng */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-2 border-dashed rounded-sm">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Ngày bắt đầu</label>
                    <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={editingCoupon.startDate || ''} onChange={e => setEditingCoupon({...editingCoupon, startDate: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Ngày kết thúc (Hết hạn)</label>
                    <input type="datetime-local" className="w-full p-3 bg-slate-50 border text-xs" value={editingCoupon.endDate || ''} onChange={e => setEditingCoupon({...editingCoupon, endDate: e.target.value})} />
                 </div>
               </div>

               <div className="flex gap-4 pt-4 border-t">
                  <button type="button" onClick={() => setIsEditingCoupon(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-slate-200 transition-colors">Hủy bỏ</button>
                  <button type="submit" className="flex-[2] py-4 bg-[#ee4d2d] text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl rounded-sm hover:bg-black transition-all">Lưu & Kích hoạt mã</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT ĐƠN HÀNG */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-300 my-8 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex flex-col">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Hồ sơ đơn hàng chi tiết</h2>
                <span className="text-[10px] font-mono opacity-60">ID: #{viewingOrder.id.toUpperCase()}</span>
              </div>
              <button onClick={() => setViewingOrder(null)} className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50 flex-1" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1 & 2: Customer & Products */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Card */}
                  <div className="bg-white p-5 rounded-sm border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${viewingOrder.status === 'Đã giao' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        <i className="fa-solid fa-truck-ramp-box text-lg"></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Trạng thái hiện tại</p>
                        <span className="text-sm font-black text-slate-800 uppercase italic">{viewingOrder.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                       <label className="text-[10px] font-black text-slate-400 uppercase hidden sm:block">Cập nhật nhanh:</label>
                       <select 
                        value={viewingOrder.status} 
                        onChange={(e) => updateOrderStatus(viewingOrder.id, e.target.value as any)} 
                        className="flex-1 sm:flex-none p-2 bg-slate-50 border rounded-sm text-[11px] font-black uppercase outline-none focus:border-[#ee4d2d]"
                       >
                          <option value="Chờ xử lý">Chờ xử lý</option>
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã giao">Đã giao</option>
                          <option value="Đã hủy">Đã hủy</option>
                       </select>
                    </div>
                  </div>

                  {/* Product List Table */}
                  <div className="bg-white rounded-sm border shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-900/5 border-b">
                       <h3 className="text-[11px] font-black text-slate-800 uppercase italic tracking-widest flex items-center gap-2">
                         <i className="fa-solid fa-boxes-stacked text-[#ee4d2d]"></i> Danh sách sản phẩm cần soạn
                       </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Sản phẩm & Phân loại</th>
                            <th className="px-4 py-3 text-center">SL</th>
                            <th className="px-4 py-3 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {viewingOrder.items.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-start gap-4">
                                  <img src={item.images[0]} className="w-14 h-14 object-cover rounded-sm border bg-white shrink-0" />
                                  <div className="space-y-1 min-w-0">
                                    <div className="text-[11px] font-black text-slate-800 uppercase leading-tight group-hover:text-[#ee4d2d] transition-colors">{item.name}</div>
                                    
                                    {/* PHÂN LOẠI CHI TIẾT ĐỂ SOẠN ĐƠN */}
                                    {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5 pt-1">
                                        {Object.entries(item.selectedVariants).map(([label, val]) => (
                                          <span key={label} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-black rounded-sm border border-orange-200 uppercase">
                                            {label}: {val}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[9px] font-bold text-slate-300 uppercase italic">Không có phân loại</span>
                                    )}

                                    {/* QUÀ TẶNG KÈM THEO SP */}
                                    {item.calculatedGifts && item.calculatedGifts.length > 0 && (
                                      <div className="pt-2 space-y-1">
                                        {item.calculatedGifts.map((gift, gIdx) => (
                                          <div key={gIdx} className="flex items-center gap-1.5 text-pink-600">
                                            <i className="fa-solid fa-gift text-[9px]"></i>
                                            <span className="text-[10px] font-black uppercase italic">Tặng kèm: {gift.quantity} {gift.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center font-black text-slate-900">x{item.quantity}</td>
                              <td className="px-4 py-4 text-right font-black text-slate-800">₫{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Customer Info Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-sm border shadow-sm space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2 flex items-center gap-2">
                        <i className="fa-solid fa-user-tag text-blue-500"></i> Thông tin khách hàng
                      </h4>
                      <div className="space-y-3">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase">Họ và tên</span>
                            <span className="text-sm font-bold text-slate-800">{viewingOrder.customerName}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase">Điện thoại</span>
                            <span className="text-sm font-black text-[#ee4d2d]">{viewingOrder.customerPhone}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase">Email</span>
                            <span className="text-xs font-bold text-slate-500">{viewingOrder.customerEmail}</span>
                         </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm border shadow-sm space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2 flex items-center gap-2">
                        <i className="fa-solid fa-map-location-dot text-emerald-500"></i> Địa chỉ nhận hàng
                      </h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        "{viewingOrder.shippingAddress}"
                      </p>
                      {viewingOrder.note && (
                        <div className="pt-3 border-t border-dashed">
                           <span className="text-[8px] font-black text-orange-400 uppercase block mb-1">Ghi chú từ khách:</span>
                           <p className="text-[11px] font-bold text-slate-500 leading-normal">{viewingOrder.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 3: Billing & Invoice */}
                <div className="space-y-6">
                  {/* Invoice Details */}
                  {viewingOrder.invoiceRequest ? (
                    <div className="bg-white p-5 rounded-sm border border-blue-100 shadow-md space-y-4">
                       <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-50 pb-2 flex items-center gap-2">
                         <i className="fa-solid fa-file-invoice"></i> Thông tin hóa đơn VAT
                       </h4>
                       <div className="space-y-4">
                          <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full w-fit uppercase">
                             {viewingOrder.invoiceRequest.type === 'personal' ? 'Hóa đơn Cá nhân' : 'Hóa đơn Doanh nghiệp'}
                          </div>
                          <div className="space-y-3">
                             <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase block">Tên đơn vị/Cá nhân</span>
                                <span className="text-xs font-bold text-slate-700 uppercase leading-tight block">{viewingOrder.invoiceRequest.name}</span>
                             </div>
                             {viewingOrder.invoiceRequest.taxCode && (
                               <div>
                                  <span className="text-[8px] font-black text-slate-400 uppercase block">Mã số thuế</span>
                                  <span className="text-xs font-black text-slate-800 tracking-wider">{viewingOrder.invoiceRequest.taxCode}</span>
                               </div>
                             )}
                             <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase block">Email nhận HĐ</span>
                                <span className="text-xs font-bold text-blue-600 underline">{viewingOrder.invoiceRequest.email}</span>
                             </div>
                             <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase block">Địa chỉ</span>
                                <span className="text-[11px] font-medium text-slate-500 leading-snug block">{viewingOrder.invoiceRequest.address}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-sm border border-dashed border-slate-200 text-center space-y-2 opacity-60">
                       <i className="fa-solid fa-file-invoice text-slate-200 text-2xl"></i>
                       <p className="text-[10px] font-black text-slate-400 uppercase italic">Không yêu cầu hóa đơn VAT</p>
                    </div>
                  )}

                  {/* Order Totals Summary */}
                  <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] border-b border-white/10 pb-3 italic">Tóm tắt thanh toán</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs">
                          <span className="text-white/60">Tạm tính hàng hóa:</span>
                          <span className="font-bold">₫{(viewingOrder.total + (viewingOrder.discountAmount || 0) - (viewingOrder.shippingFee || 0)).toLocaleString()}</span>
                       </div>
                       {viewingOrder.discountAmount && viewingOrder.discountAmount > 0 && (
                         <div className="flex justify-between text-xs text-yellow-400 font-bold">
                            <span>Giảm giá Voucher ({viewingOrder.couponCode || 'Promo'}):</span>
                            <span>-₫{viewingOrder.discountAmount.toLocaleString()}</span>
                         </div>
                       )}
                       <div className="flex justify-between text-xs text-emerald-400 font-bold">
                          <span>Phí vận chuyển:</span>
                          <span className="uppercase italic">{viewingOrder.shippingFee > 0 ? `₫${viewingOrder.shippingFee.toLocaleString()}` : 'Miễn phí'}</span>
                       </div>
                    </div>
                    <div className="pt-5 border-t border-white/20 flex flex-col items-center">
                       <span className="text-[10px] font-black text-white/40 uppercase mb-1">TỔNG THANH TOÁN (COD)</span>
                       <span className="text-3xl font-black text-[#ee4d2d] drop-shadow-lg">₫{viewingOrder.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Prep Checklist */}
                  <div className="bg-white p-5 rounded-sm border shadow-sm">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Ghi chú soạn hàng (Internal)</h4>
                     <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-[11px] text-slate-500">
                           <input type="checkbox" className="rounded-sm accent-[#ee4d2d]" />
                           <span>Kiểm tra ngoại quan sản phẩm</span>
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-slate-500">
                           <input type="checkbox" className="rounded-sm accent-[#ee4d2d]" />
                           <span>Dán tem bảo hành 12-24 tháng</span>
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-slate-500">
                           <input type="checkbox" className="rounded-sm accent-[#ee4d2d]" />
                           <span>Đóng gói chống sốc 3 lớp</span>
                        </li>
                     </ul>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 md:p-6 bg-white border-t flex justify-center md:justify-end gap-3 shrink-0 shadow-inner">
               <button 
                onClick={() => setViewingOrder(null)}
                className="px-8 py-3 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-slate-200 transition-colors"
               >
                 Đóng lại
               </button>
               <button 
                onClick={() => window.print()}
                className="px-10 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg"
               >
                 <i className="fa-solid fa-print"></i> In đơn hàng
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
