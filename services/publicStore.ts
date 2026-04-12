import "server-only";

import { unstable_cache } from "next/cache";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import { serverDb } from "@/services/firebaseServer";
import {
  AppConfig,
  Banner,
  BlogPost,
  Brand,
  Category,
  CategoryConfig,
  CategoryTheme,
  Commitment,
  Coupon,
  CustomMenu,
  HomePopup,
  Product,
} from "@/types";

const DEFAULT_APP_CONFIG: AppConfig = {
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asun.vn",
  appStoreUrl: "https://apps.apple.com",
  googlePlayUrl: "https://play.google.com",
  zaloUrl: "https://zalo.me/0905564384",
  messengerUrl: "https://m.me/electrohubpro",
  hotline: "0905564384",
  bctUrl: "http://online.gov.vn/Home/WebDetails/14227",
};

const DEFAULT_HOME_POPUP: HomePopup = {
  imageUrl:
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
  link: "/flash-sales",
  isActive: false,
};

async function fetchCollectionItems<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(serverDb, collectionName));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<T, "id">),
  })) as T[];
}

/**
 * Chỉ giữ field cần thiết cho trang public/home.
 * Bỏ các field nặng như description dài, gallery lớn, metadata thừa...
 * Bạn chỉnh lại theo đúng Product type thực tế của bạn.
 */
function toPublicProduct(product: Product): Product {
  return {
    ...product,
    // Ví dụ nếu có các field nặng thì bỏ đi:
    // description: "",
    // content: "",
    // gallery: product.gallery?.slice(0, 3) ?? [],
  };
}

async function getCachedPublicProducts() {
  const products = await fetchCollectionItems<Product>("products");
  return products.filter((product) => !product.isHidden);
}

const getCachedPublishedBlogPosts = unstable_cache(
  async () => {
    const posts = await fetchCollectionItems<BlogPost>("blogPosts");
    return posts.filter((post) => post.isPublished);
  },
  ["published-blog-posts"],
  { revalidate: 300 }
);

const getCachedBanners = unstable_cache(
  async () => fetchCollectionItems<Banner>("banners"),
  ["banners"],
  { revalidate: 300 }
);

const getCachedBrands = unstable_cache(
  async () => fetchCollectionItems<Brand>("brands"),
  ["brands"],
  { revalidate: 300 }
);

const getCachedCommitments = unstable_cache(
  async () => fetchCollectionItems<Commitment>("commitments"),
  ["commitments"],
  { revalidate: 300 }
);

const getCachedCoupons = unstable_cache(
  async () => fetchCollectionItems<Coupon>("coupons"),
  ["coupons"],
  { revalidate: 300 }
);

const getCachedCategoryConfigs = unstable_cache(
  async () => fetchCollectionItems<CategoryConfig>("categoryConfigs"),
  ["category-configs"],
  { revalidate: 300 }
);

const getCachedCategoryThemes = unstable_cache(
  async () => fetchCollectionItems<CategoryTheme>("categoryThemes"),
  ["category-themes"],
  { revalidate: 300 }
);

const getCachedVisibleCategories = unstable_cache(
  async () => {
    const categoriesDoc = await getDoc(doc(serverDb, "settings", "categories"));

    return categoriesDoc.exists()
      ? ((categoriesDoc.data().visibleCategories as Category[]) || Object.values(Category))
      : Object.values(Category);
  },
  ["visible-categories"],
  { revalidate: 300 }
);

const getCachedAppConfig = unstable_cache(
  async () => {
    const appConfigDoc = await getDoc(doc(serverDb, "settings", "appConfig"));

    return appConfigDoc.exists()
      ? ({ ...DEFAULT_APP_CONFIG, ...(appConfigDoc.data() as AppConfig) } satisfies AppConfig)
      : DEFAULT_APP_CONFIG;
  },
  ["app-config"],
  { revalidate: 300 }
);

const getCachedHomePopup = unstable_cache(
  async () => {
    const homePopupDoc = await getDoc(doc(serverDb, "settings", "homePopup"));

    return homePopupDoc.exists()
      ? ({ ...DEFAULT_HOME_POPUP, ...(homePopupDoc.data() as HomePopup) } satisfies HomePopup)
      : DEFAULT_HOME_POPUP;
  },
  ["home-popup"],
  { revalidate: 300 }
);

const getCachedActiveCustomMenus = unstable_cache(
  async () => {
    const customMenus = await fetchCollectionItems<CustomMenu>("customMenus");
    return customMenus.filter((menu) => menu.isActive);
  },
  ["active-custom-menus"],
  { revalidate: 300 }
);

const getCachedHasShockSales = unstable_cache(
  async () => {
    const products = await fetchCollectionItems<Product>("products");
    return products.some((product) => product.isShockSale && !product.isHidden);
  },
  ["has-shock-sales"],
  { revalidate: 300 }
);

export async function getPublicProducts(): Promise<Product[]> {
  return getCachedPublicProducts();
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return getCachedPublishedBlogPosts();
}

export async function getHomePageData() {
  const [
    products,
    banners,
    brands,
    commitments,
    coupons,
    categoryConfigs,
    categoryThemes,
    visibleCategories,
  ] = await Promise.all([
    getCachedPublicProducts(),
    getCachedBanners(),
    getCachedBrands(),
    getCachedCommitments(),
    getCachedCoupons(),
    getCachedCategoryConfigs(),
    getCachedCategoryThemes(),
    getCachedVisibleCategories(),
  ]);

  return {
    products,
    banners,
    brands,
    commitments,
    coupons,
    categoryConfigs,
    categoryThemes,
    visibleCategories,
  };
}

export async function getShellData() {
  const [appConfig, homePopup, visibleCategories, customMenus, hasShockSales] =
    await Promise.all([
      getCachedAppConfig(),
      getCachedHomePopup(),
      getCachedVisibleCategories(),
      getCachedActiveCustomMenus(),
      getCachedHasShockSales(),
    ]);

  return {
    appConfig,
    homePopup,
    visibleCategories,
    customMenus,
    hasShockSales,
  };
}