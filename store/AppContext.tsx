
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  increment,
  where,
  getDocsFromCache,
  getDocsFromServer
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
import { 
  Product, CartItem, Order, Category, Banner, AppConfig, Brand, 
  Coupon, Commitment, AppNotification, InvoiceData, CategoryConfig, 
  CategoryTheme, StockAlert, OrderGiftItem, HomePopup, Review, BlogPost, CustomMenu
} from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const cleanData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => (v && typeof v === 'object') ? cleanData(v) : v);
  }
  if (obj === null || obj === undefined || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value === undefined) return;
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      newObj[key] = cleanData(value);
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
};

interface AppContextType {
  products: Product[];
  brands: Brand[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  blogPosts: BlogPost[];
  banners: Banner[];
  commitments: Commitment[];
  customMenus: CustomMenu[];
  appConfig: AppConfig;
  homePopup: HomePopup;
  coupons: Coupon[];
  notifications: AppNotification[];
  categoryConfigs: CategoryConfig[];
  categoryThemes: CategoryTheme[];
  stockAlerts: StockAlert[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  activeCategory: Category | 'Tất cả';
  setActiveCategory: (cat: Category | 'Tất cả') => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  visibleCategories: Category[];
  isAdmin: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addToCart: (product: Product, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  toggleCartItemSelection: (cartItemId: string) => void;
  toggleAllCartItems: (isSelected: boolean) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  toggleAdmin: () => void;
  placeOrder: (customerData: { 
    userId: string,
    name: string, 
    phone: string, 
    email: string, 
    address: string, 
    note?: string, 
    discountAmount?: number, 
    couponCode?: string,
    shippingFee?: number,
    total?: number,
    invoiceRequest?: InvoiceData 
  }) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteProduct: (productId: string) => void;
  saveProduct: (product: Product) => void;
  saveBanner: (banner: Banner) => void;
  deleteBanner: (bannerId: string) => void;
  saveBrand: (brand: Brand) => void;
  deleteBrand: (brandId: string) => void;
  saveCommitment: (commitment: Commitment) => void;
  deleteCommitment: (id: string) => void;
  saveCustomMenu: (menu: CustomMenu) => Promise<void>;
  deleteCustomMenu: (id: string) => Promise<void>;
  toggleCategoryVisibility: (category: Category) => void;
  updateAppConfig: (config: AppConfig) => void;
  updateHomePopup: (popup: HomePopup) => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  saveCategoryConfig: (config: CategoryConfig) => void;
  saveCategoryTheme: (theme: CategoryTheme) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addStockAlert: (productId: string, productName: string, contact: string) => void;
  deleteStockAlert: (alertId: string) => void;
  alertProduct: Product | null;
  setAlertProduct: (p: Product | null) => void;
  saveReview: (review: Review) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;
  incrementBlogPostViews: (postId: string) => Promise<void>;
  saveCouponToUser: (coupon: Coupon) => Promise<void>;
  userSavedCouponCodes: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_APP_CONFIG: AppConfig = {
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asun.vn',
  appStoreUrl: 'https://apps.apple.com',
  googlePlayUrl: 'https://play.google.com',
  zaloUrl: 'https://zalo.me/0905564384',
  messengerUrl: 'https://m.me/electrohubpro',
  hotline: '0905564384',
  bctUrl: 'http://online.gov.vn/Home/WebDetails/14227'
};

const DEFAULT_HOME_POPUP: HomePopup = {
  imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  link: '/flash-sales',
  isActive: false
};

const CART_STORAGE_KEY = 'asun_cart_v3';
const WISHLIST_STORAGE_KEY = 'asun_wishlist_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [customMenus, setCustomMenus] = useState<CustomMenu[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [homePopup, setHomePopup] = useState<HomePopup>(DEFAULT_HOME_POPUP);
  const [categoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>([]);
  const [categoryThemes, setCategoryThemes] = useState<CategoryTheme[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [userSavedCouponCodes, setUserSavedCouponCodes] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'Tất cả'>('Tất cả');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>(Object.values(Category));
  const [isAdmin, setIsAdmin] = useState(false);
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);

  const isInitialOrdersLoad = useRef(true);

  // --- HÀM HELPER FETCH DỮ LIỆU AN TOÀN ---

  const syncCollection = async (collectionName: string, setter: Function, fallback: any[] = []) => {
    try {
      const q = collection(db, collectionName);
      const cacheSnap = await getDocsFromCache(q).catch(() => null);
      if (cacheSnap && !cacheSnap.empty) {
        setter(cacheSnap.docs.map(d => d.data()));
      }
      const serverSnap = await getDocsFromServer(q);
      if (!serverSnap.empty) {
        setter(serverSnap.docs.map(d => d.data()));
      } else if (!cacheSnap || cacheSnap.empty) {
        setter(fallback);
      }
    } catch (e) {
      console.error(`Sync ${collectionName} error:`, e);
    }
  };

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "appConfig"), (s) => {
      if (s.exists()) setAppConfig(s.data() as AppConfig);
    });
    const unsubPopup = onSnapshot(doc(db, "settings", "homePopup"), (s) => {
      if (s.exists()) setHomePopup(s.data() as HomePopup);
    });
    const unsubCats = onSnapshot(doc(db, "settings", "categories"), (s) => {
      if (s.exists()) setVisibleCategories(s.data().visibleCategories as Category[]);
    });
    return () => { unsubConfig(); unsubPopup(); unsubCats(); };
  }, []);

  useEffect(() => {
    syncCollection("products", (data: Product[]) => setProducts(data.length > 0 ? data : INITIAL_PRODUCTS));
    syncCollection("banners", setBanners);
    syncCollection("brands", setBrands);
    syncCollection("commitments", setCommitments);
    syncCollection("categoryConfigs", setCategoryConfigs);
    syncCollection("categoryThemes", setCategoryThemes);
    syncCollection("coupons", setCoupons);
    syncCollection("blogPosts", setBlogPosts);
    syncCollection("customMenus", setCustomMenus);
    
    getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc"))).then(s => {
      setReviews(s.docs.map(d => d.data() as Review));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.email === "admin@droppii.vn") {
      const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("date", "desc")), (snap) => {
        const orderList = snap.docs.map(doc => doc.data() as Order);
        
        // Chỉ tạo thông báo sau khi dữ liệu ban đầu đã tải xong
        if (!isInitialOrdersLoad.current) {
          snap.docChanges().forEach((change) => {
            if (change.type === "added") {
              const orderData = change.doc.data() as Order;
              const newNotif: AppNotification = {
                id: `notif-order-${orderData.id}`,
                title: "ĐƠN HÀNG MỚI!",
                message: `Khách hàng ${orderData.customerName} vừa đặt đơn ₫${orderData.total.toLocaleString()}`,
                type: 'system',
                link: '/admin',
                isRead: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotif, ...prev]);
            }
          });
        }
        
        setOrders(orderList);
        isInitialOrdersLoad.current = false;
      });

      const unsubAlerts = onSnapshot(collection(db, "stockAlerts"), (snap) => {
        setStockAlerts(snap.docs.map(doc => doc.data() as StockAlert));
      });
      return () => { unsubOrders(); unsubAlerts(); };
    } else if (user) {
      const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("date", "desc"));
      const unsub = onSnapshot(q, (snap) => {
        setOrders(snap.docs.map(doc => doc.data() as Order));
      });
      return () => unsub();
    }
  }, [user]);

  useEffect(() => {
    try {
      const sCart = localStorage.getItem(CART_STORAGE_KEY);
      if (sCart) setCart(JSON.parse(sCart));
      const sWish = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (sWish) setWishlist(JSON.parse(sWish));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      return;
    }
    const syncWishlist = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const cloudWish = userSnap.data().wishlist || [];
        const merged = Array.from(new Set([...wishlist, ...cloudWish]));
        setWishlist(merged);
        await updateDoc(userRef, { wishlist: merged });
      } else {
        await setDoc(userRef, { wishlist: wishlist, email: user.email });
      }
    };
    syncWishlist();
  }, [user]);

  const saveProduct = async (product: Product) => {
    const data = cleanData(product);
    await setDoc(doc(db, "products", product.id), data);
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? product : p);
      return [product, ...prev];
    });
  };

  const toggleWishlist = async (productId: string) => {
    const newWishlist = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    setWishlist(newWishlist);
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { wishlist: newWishlist });
    } else {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
    }
  };

  const saveReview = async (review: Review) => {
    const data = cleanData(review);
    await setDoc(doc(db, "reviews", review.id), data);
    setReviews(prev => [review, ...prev]);
    if (review.orderId) {
      const orderRef = doc(db, "orders", review.orderId);
      await updateDoc(orderRef, { reviewedProductIds: arrayUnion(review.productId) });
    }
    const productRef = doc(db, "products", review.productId);
    const prodSnap = await getDoc(productRef);
    if (prodSnap.exists()) {
      const currentProdReviews = reviews.filter(r => r.productId === review.productId);
      const totalRatingCount = currentProdReviews.length + 1;
      const totalRatingSum = currentProdReviews.reduce((sum, r) => sum + r.rating, 0) + review.rating;
      const newRating = totalRatingSum / totalRatingCount;
      await updateDoc(productRef, { rating: Number(newRating.toFixed(1)) });
    }
  };

  const deleteReview = async (reviewId: string) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) return;
    await deleteDoc(doc(db, "reviews", reviewId));
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const saveBlogPost = async (post: BlogPost) => {
    const data = cleanData(post);
    await setDoc(doc(db, "blogPosts", post.id), data);
    setBlogPosts(prev => {
      const exists = prev.find(p => p.id === post.id);
      return exists ? prev.map(p => p.id === post.id ? post : p) : [post, ...prev];
    });
  };

  const deleteBlogPost = async (postId: string) => {
    await deleteDoc(doc(db, "blogPosts", postId));
    setBlogPosts(prev => prev.filter(p => p.id !== postId));
  };

  const incrementBlogPostViews = async (postId: string) => {
    const postRef = doc(db, "blogPosts", postId);
    await updateDoc(postRef, { views: increment(1) });
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, "products", productId));
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const saveBanner = async (banner: Banner) => {
    const data = cleanData(banner);
    await setDoc(doc(db, "banners", banner.id), data);
    setBanners(prev => {
      const exists = prev.find(b => b.id === banner.id);
      return exists ? prev.map(b => b.id === banner.id ? banner : b) : [...prev, banner];
    });
  };

  const deleteBanner = async (bannerId: string) => {
    await deleteDoc(doc(db, "banners", bannerId));
    setBanners(prev => prev.filter(b => b.id !== bannerId));
  };

  const saveBrand = async (brand: Brand) => {
    const data = cleanData(brand);
    await setDoc(doc(db, "brands", brand.id), data);
    setBrands(prev => {
      const exists = prev.find(b => b.id === brand.id);
      return exists ? prev.map(b => b.id === brand.id ? brand : b) : [...prev, brand];
    });
  };

  const deleteBrand = async (brandId: string) => {
    await deleteDoc(doc(db, "brands", brandId));
    setBrands(prev => prev.filter(b => b.id !== brandId));
  };

  const saveCustomMenu = async (menu: CustomMenu) => {
    const data = cleanData(menu);
    await setDoc(doc(db, "customMenus", menu.id), data);
    setCustomMenus(prev => {
      const exists = prev.find(m => m.id === menu.id);
      return exists ? prev.map(m => m.id === menu.id ? menu : m) : [...prev, menu];
    });
  };

  const deleteCustomMenu = async (id: string) => {
    await deleteDoc(doc(db, "customMenus", id));
    setCustomMenus(prev => prev.filter(m => m.id !== id));
  };

  const updateAppConfig = async (config: AppConfig) => {
    const data = cleanData(config);
    await setDoc(doc(db, "settings", "appConfig"), data);
  };

  const updateHomePopup = async (popup: HomePopup) => {
    const data = cleanData(popup);
    await setDoc(doc(db, "settings", "homePopup"), data);
  };

  const saveCoupon = async (coupon: Coupon) => {
    const data = cleanData(coupon);
    await setDoc(doc(db, "coupons", coupon.id), data);
    setCoupons(prev => {
      const exists = prev.find(c => c.id === coupon.id);
      return exists ? prev.map(c => c.id === coupon.id ? coupon : c) : [...prev, coupon];
    });
  };

  const deleteCoupon = async (couponId: string) => {
    await deleteDoc(doc(db, "coupons", couponId));
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const saveCommitment = async (commitment: Commitment) => {
    const data = cleanData(commitment);
    await setDoc(doc(db, "commitments", commitment.id), data);
    setCommitments(prev => {
      const exists = prev.find(c => c.id === commitment.id);
      return exists ? prev.map(c => c.id === commitment.id ? commitment : c) : [...prev, commitment];
    });
  };

  const deleteCommitment = async (id: string) => {
    await deleteDoc(doc(db, "commitments", id));
    setCommitments(prev => prev.filter(c => c.id !== id));
  };

  const saveCategoryConfig = async (config: CategoryConfig) => {
    const data = cleanData(config);
    await setDoc(doc(db, "categoryConfigs", config.category), data);
    setCategoryConfigs(prev => {
      const exists = prev.find(c => c.category === config.category);
      return exists ? prev.map(c => c.category === config.category ? config : c) : [...prev, config];
    });
  };

  const saveCategoryTheme = async (theme: CategoryTheme) => {
    const data = cleanData(theme);
    await setDoc(doc(db, "categoryThemes", theme.category), data);
    setCategoryThemes(prev => {
      const exists = prev.find(t => t.category === theme.category);
      return exists ? prev.map(t => t.category === theme.category ? theme : t) : [...prev, theme];
    });
  };

  const addStockAlert = async (productId: string, productName: string, contact: string) => {
    const id = `alert-${Date.now()}`;
    const alert: StockAlert = { id, productId, productName, contact, status: 'pending', createdAt: new Date().toISOString() };
    await setDoc(doc(db, "stockAlerts", id), cleanData(alert));
  };

  const deleteStockAlert = async (alertId: string) => {
    await deleteDoc(doc(db, "stockAlerts", alertId));
  };

  const placeOrder = async (data: any) => {
    const orderId = `ord-${Date.now()}`;
    const selectedItems = cart.filter(item => item.selected);
    const order: Order = {
      id: orderId, userId: data.userId || 'guest', items: selectedItems,
      total: data.total, shippingFee: data.shippingFee, status: 'Chờ xử lý',
      date: new Date().toISOString(), shippingAddress: data.address,
      customerName: data.name, customerPhone: data.phone, customerEmail: data.email,
      note: data.note, discountAmount: data.discountAmount, couponCode: data.couponCode,
      invoiceRequest: data.invoiceRequest, reviewedProductIds: []
    };
    await setDoc(doc(db, "orders", orderId), cleanData(order));
    setCart(prev => prev.filter(item => !item.selected));
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  };

  const addToCart = (product: Product, selectedVariants?: Record<string, string>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && JSON.stringify(item.selectedVariants || {}) === JSON.stringify(selectedVariants || {}));
      if (existing) return prev.map(item => (item.id === product.id && JSON.stringify(item.selectedVariants || {}) === JSON.stringify(selectedVariants || {})) ? { ...item, quantity: item.quantity + 1, selected: true } : item);
      return [...prev, { ...product, quantity: 1, selected: true, selectedVariants }];
    });
  };

  const removeFromCart = (cartItemId: string) => setCart(prev => prev.filter(item => item.id !== cartItemId));
  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const toggleCartItemSelection = (cartItemId: string) => {
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, selected: !item.selected } : item));
  };
  const toggleAllCartItems = (isSelected: boolean) => {
    setCart(prev => prev.map(item => ({ ...item, selected: isSelected })));
  };
  const clearCart = () => setCart([]);
  const toggleAdmin = () => setIsAdmin(!isAdmin);
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 5));
  };
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const clearNotifications = () => setNotifications([]);
  const toggleCategoryVisibility = async (category: Category) => {
    const newVisibleCats = visibleCategories.includes(category) 
      ? visibleCategories.filter(c => c !== category) : [...visibleCategories, category];
    await setDoc(doc(db, "settings", "categories"), { visibleCategories: newVisibleCats });
  };

  const saveCouponToUser = async (coupon: Coupon) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, { userSavedCouponCodes: arrayUnion(coupon.code) });
      setUserSavedCouponCodes(prev => Array.from(new Set([...prev, coupon.code])));
    } catch (e) {
      await setDoc(userRef, { userSavedCouponCodes: [coupon.code], email: user.email }, { merge: true });
    }
  };

  useEffect(() => {
    if (!user) { setUserSavedCouponCodes([]); return; }
    getDoc(doc(db, "users", user.uid)).then(s => {
      if (s.exists()) setUserSavedCouponCodes(s.data().userSavedCouponCodes || []);
    });
  }, [user]);

  return (
    <AppContext.Provider value={{
      products, brands, cart, wishlist, orders, reviews, blogPosts, banners, commitments, customMenus, appConfig, homePopup, coupons, notifications, categoryConfigs, categoryThemes, stockAlerts, searchQuery, setSearchQuery, 
      recentSearches, addRecentSearch, activeCategory, setActiveCategory, selectedBrand, setSelectedBrand, visibleCategories, isAdmin,
      setProducts, addToCart, removeFromCart, updateCartQuantity, toggleCartItemSelection, toggleAllCartItems, toggleWishlist,
      clearCart, toggleAdmin, placeOrder, updateOrderStatus, deleteProduct, saveProduct, saveBanner, deleteBanner, 
      saveBrand, deleteBrand, saveCoupon, deleteCoupon, saveCommitment, deleteCommitment, saveCustomMenu, deleteCustomMenu, saveCategoryConfig, saveCategoryTheme,
      toggleCategoryVisibility, updateAppConfig, updateHomePopup, markNotificationAsRead, clearNotifications, addStockAlert, deleteStockAlert,
      alertProduct, setAlertProduct, saveReview, deleteReview, saveBlogPost, deleteBlogPost, incrementBlogPostViews,
      saveCouponToUser, userSavedCouponCodes
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
