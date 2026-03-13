(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/seo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSlug",
    ()=>createSlug,
    "getIdFromSlug",
    ()=>getIdFromSlug
]);
const createSlug = (name, id)=>{
    if (!name) return id;
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    return `${normalized}-${id}`;
};
function getIdFromSlug(slug) {
    if (!slug) return '';
    const parts = slug.split('-');
    if (parts.length < 1) return '';
    const last = parts[parts.length - 1];
    const secondLast = parts.length >= 2 ? parts[parts.length - 2] : null;
    // Trường hợp: slug kết thúc bằng "-p-[dãy số]" (Định dạng p-timestamp)
    // Kiểm tra secondLast là 'p' và last chỉ chứa các chữ số
    if (secondLast === 'p' && /^\d+$/.test(last)) {
        return `p-${last}`;
    }
    // Trường hợp mặc định hoặc ID cũ (p1, p2, pABC...)
    return last;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ProductDetail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/seo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const StarRating = ({ rating })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-0.5",
        children: [
            [
                1,
                2,
                3,
                4,
                5
            ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: `text-[8px] ${rating >= star ? 'fa-solid fa-star text-yellow-400' : rating > star - 1 ? 'fa-solid fa-star-half-stroke text-yellow-400' : 'fa-regular fa-star text-slate-200'}`
                }, star, false, {
                    fileName: "[project]/components/ProductDetail.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] text-slate-400 font-bold ml-1",
                children: rating
            }, void 0, false, {
                fileName: "[project]/components/ProductDetail.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductDetail.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = StarRating;
const ProductDetail = ()=>{
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const slug = params?.slug;
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIdFromSlug"])(slug);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { products, addToCart, wishlist, toggleWishlist, commitments, setSelectedBrand, setActiveCategory, setSearchQuery, setAlertProduct, reviews } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [selectedImageIdx, setSelectedImageIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isLightboxOpen, setIsLightboxOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lightboxImageOverride, setLightboxImageOverride] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedVariants, setSelectedVariants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isDescExpanded, setIsDescExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSeeMore, setShowSeeMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('desc');
    const REVIEWS_PER_PAGE = 5;
    const [reviewPage, setReviewPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selectedTagFilter, setSelectedTagFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const descRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const thumbnailContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const product = products.find((p)=>p.id === id);
    // --- LOGIC SEO & STRUCTURED DATA ---
    const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[now]": ()=>new Date()
    }["ProductDetail.useMemo[now]"], []);
    const currentPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[currentPrice]": ()=>{
            if (!product) return 0;
            const isFlashSale = product.flashSalePrice && product.flashSaleEnd && new Date(product.flashSaleEnd) > now && (!product.flashSaleStart || new Date(product.flashSaleStart) <= now);
            if (product.isShockSale && product.shockSalePrice) return product.shockSalePrice;
            if (isFlashSale) return product.flashSalePrice;
            return product.price;
        }
    }["ProductDetail.useMemo[currentPrice]"], [
        product,
        now
    ]);
    const seoTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[seoTitle]": ()=>product?.seoTitle || `${product?.name} - ${product?.brand} chính hãng | Asun.vn`
    }["ProductDetail.useMemo[seoTitle]"], [
        product
    ]);
    const seoDesc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[seoDesc]": ()=>product?.seoDescription || `Mua ${product?.name} tại Asun.vn. Giá cực tốt: ${currentPrice.toLocaleString()}đ. Bảo hành ${product?.warrantyMonths} tháng, cam kết chính hãng 100%.`
    }["ProductDetail.useMemo[seoDesc]"], [
        product,
        currentPrice
    ]);
    const schemaData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[schemaData]": ()=>{
            if (!product) return null;
            return {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "image": product.images,
                "description": product.description.replace(/<[^>]*>?/gm, '').substring(0, 200),
                "brand": {
                    "@type": "Brand",
                    "name": product.brand
                },
                "sku": product.id,
                "mpn": product.id,
                "offers": {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "VND",
                    "price": currentPrice,
                    "priceValidUntil": "2026-12-31",
                    "availability": product.isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                    "itemCondition": "https://schema.org/NewCondition"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": product.rating || 5,
                    "bestRating": "5",
                    "worstRating": "1",
                    "ratingCount": reviews.filter({
                        "ProductDetail.useMemo[schemaData]": (r)=>r.productId === product.id
                    }["ProductDetail.useMemo[schemaData]"]).length || 1
                }
            };
        }
    }["ProductDetail.useMemo[schemaData]"], [
        product,
        reviews,
        currentPrice
    ]);
    // --- LOGIC EFFECT GỐC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetail.useEffect": ()=>{
            if (product) {
                setSelectedImageIdx(0);
                setIsDescExpanded(false);
                const initial = {};
                if (product.variants && product.variants.length > 0) {
                    product.variants.forEach({
                        "ProductDetail.useEffect": (v)=>{
                            if (v.options.length > 0) initial[v.label] = v.options[0];
                        }
                    }["ProductDetail.useEffect"]);
                }
                setSelectedVariants(initial);
            }
        }
    }["ProductDetail.useEffect"], [
        product
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetail.useEffect": ()=>{
            if (thumbnailContainerRef.current) {
                const container = thumbnailContainerRef.current;
                const activeThumb = container.children[selectedImageIdx];
                if (activeThumb) {
                    const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }["ProductDetail.useEffect"], [
        selectedImageIdx
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetail.useEffect": ()=>{
            if (descRef.current && activeTab === 'desc') {
                if (descRef.current.scrollHeight > 450) setShowSeeMore(true);
                else setShowSeeMore(false);
            }
        }
    }["ProductDetail.useEffect"], [
        product?.description,
        activeTab
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetail.useEffect": ()=>{
            const handleKeyDown = {
                "ProductDetail.useEffect.handleKeyDown": (e)=>{
                    if (!isLightboxOpen) return;
                    if (e.key === 'ArrowRight') nextImage();
                    if (e.key === 'ArrowLeft') prevImage();
                    if (e.key === 'Escape') {
                        setIsLightboxOpen(false);
                        setLightboxImageOverride(null);
                    }
                }
            }["ProductDetail.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "ProductDetail.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["ProductDetail.useEffect"];
        }
    }["ProductDetail.useEffect"], [
        isLightboxOpen,
        selectedImageIdx
    ]);
    const nextImage = (e)=>{
        if (e) e.stopPropagation();
        if (!product) return;
        if (lightboxImageOverride) return;
        setSelectedImageIdx((prev)=>(prev + 1) % product.images.length);
    };
    const prevImage = (e)=>{
        if (e) e.stopPropagation();
        if (!product) return;
        if (lightboxImageOverride) return;
        setSelectedImageIdx((prev)=>(prev - 1 + product.images.length) % product.images.length);
    };
    const productReviews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[productReviews]": ()=>{
            return reviews.filter({
                "ProductDetail.useMemo[productReviews]": (r)=>r.productId === id
            }["ProductDetail.useMemo[productReviews]"]);
        }
    }["ProductDetail.useMemo[productReviews]"], [
        reviews,
        id
    ]);
    const ratingStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[ratingStats]": ()=>{
            const stats = [
                0,
                0,
                0,
                0,
                0
            ];
            productReviews.forEach({
                "ProductDetail.useMemo[ratingStats]": (r)=>{
                    if (r.rating >= 1 && r.rating <= 5) stats[r.rating - 1]++;
                }
            }["ProductDetail.useMemo[ratingStats]"]);
            return stats.reverse();
        }
    }["ProductDetail.useMemo[ratingStats]"], [
        productReviews
    ]);
    const filteredReviews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[filteredReviews]": ()=>{
            let res = [
                ...productReviews
            ];
            if (selectedTagFilter) {
                res = res.filter({
                    "ProductDetail.useMemo[filteredReviews]": (r)=>r.tags?.includes(selectedTagFilter)
                }["ProductDetail.useMemo[filteredReviews]"]);
            }
            return res;
        }
    }["ProductDetail.useMemo[filteredReviews]"], [
        productReviews,
        selectedTagFilter
    ]);
    const paginatedReviews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[paginatedReviews]": ()=>{
            return filteredReviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
        }
    }["ProductDetail.useMemo[paginatedReviews]"], [
        filteredReviews,
        reviewPage
    ]);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-center py-20 font-bold uppercase text-slate-400 italic",
        children: "Sản phẩm không tồn tại"
    }, void 0, false, {
        fileName: "[project]/components/ProductDetail.tsx",
        lineNumber: 188,
        columnNumber: 24
    }, ("TURBOPACK compile-time value", void 0));
    const isInWishlist = wishlist.includes(product.id);
    const giftProduct = product.promoGiftProductId ? products.find((p)=>p.id === product.promoGiftProductId) : null;
    const isGiftActive = (p)=>{
        if (!p.giftName) return false;
        if (p.giftStartDate && new Date(p.giftStartDate) > now) return false;
        if (p.giftEndDate && new Date(p.giftEndDate) < now) return false;
        return true;
    };
    const isBuyXGetYActive = (p)=>{
        if (!p.promoBuyQty || !p.promoGetQty) return false;
        if (p.promoStartDate && new Date(p.promoStartDate) > now) return false;
        if (p.promoEndDate && new Date(p.promoEndDate) < now) return false;
        return true;
    };
    const buyXGetY = isBuyXGetYActive(product);
    const giftActive = isGiftActive(product);
    const handleBrandClick = (brandName)=>{
        setActiveCategory('Tất cả');
        setSearchQuery('');
        setSelectedBrand(brandName);
        router.push('/');
    };
    const handleCategoryClick = (category)=>{
        setSelectedBrand(null);
        setSearchQuery('');
        setActiveCategory(category);
        router.push('/');
    };
    const handleVariantSelect = (label, option)=>{
        setSelectedVariants((prev)=>({
                ...prev,
                [label]: option
            }));
    };
    const openGiftLightbox = (imageUrl)=>{
        setLightboxImageOverride(imageUrl);
        setIsLightboxOpen(true);
    };
    const getEmbedUrl = (url)=>{
        if (!url) return '';
        try {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                let videoId = '';
                if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
                else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0].split('/')[0];
                return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
            }
        } catch (e) {}
        return url;
    };
    const allVideoUrls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductDetail.useMemo[allVideoUrls]": ()=>{
            const urls = product.videoUrls ? [
                ...product.videoUrls
            ] : [];
            if (product.videoUrl && !urls.includes(product.videoUrl)) {
                urls.unshift(product.videoUrl);
            }
            return urls.map({
                "ProductDetail.useMemo[allVideoUrls]": (url)=>getEmbedUrl(url)
            }["ProductDetail.useMemo[allVideoUrls]"]).filter({
                "ProductDetail.useMemo[allVideoUrls]": (url)=>url !== ''
            }["ProductDetail.useMemo[allVideoUrls]"]);
        }
    }["ProductDetail.useMemo[allVideoUrls]"], [
        product.videoUrls,
        product.videoUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto space-y-6 pb-24 px-4 md:px-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 py-4 border-b border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        onClick: ()=>{
                            setSelectedBrand(null);
                            setActiveCategory('Tất cả');
                            setSearchQuery('');
                        },
                        className: "hover:text-[#ee4d2d] transition-colors",
                        children: "Trang chủ"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right text-[8px] opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: ()=>handleCategoryClick(product.category),
                        className: "hover:text-[#ee4d2d] cursor-pointer transition-colors",
                        children: product.category
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right text-[8px] opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: ()=>handleBrandClick(product.brand),
                        className: "hover:text-[#ee4d2d] cursor-pointer transition-colors",
                        children: product.brand
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right text-[8px] opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-900 truncate max-w-[150px] md:max-w-none",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductDetail.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-4 md:p-8 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-5 gap-8 border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-2 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group relative aspect-square rounded-sm overflow-hidden border bg-slate-50 flex items-center justify-center cursor-zoom-in",
                                onClick: ()=>setIsLightboxOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: product.images[selectedImageIdx],
                                        className: `max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${product.isOutOfStock ? 'grayscale opacity-50' : ''}`,
                                        alt: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    product.images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: prevImage,
                                                className: "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chevron-left"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 276
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: nextImage,
                                                className: "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chevron-right"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 277
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true),
                                    product.isOutOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 flex items-center justify-center pointer-events-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-slate-900/90 text-white text-xs md:text-sm font-black px-6 py-3 uppercase tracking-[0.3em] italic shadow-2xl transform -rotate-12 border-2 border-white/20",
                                            children: "HẾT HÀNG"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 279,
                                            columnNumber: 125
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 279,
                                        columnNumber: 38
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group/thumbs-area",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: thumbnailContainerRef,
                                    className: "flex gap-2 overflow-x-auto pb-4 thumbnail-slider-custom snap-x scroll-smooth",
                                    children: product.images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>setSelectedImageIdx(i),
                                            className: `w-16 h-16 md:w-24 md:h-24 shrink-0 border cursor-pointer overflow-hidden transition-all snap-start rounded-sm relative ${selectedImageIdx === i ? 'border-[#ee4d2d] ring-2 ring-[#ee4d2d]/20 p-0.5 shadow-md z-10 scale-95' : 'border-slate-100 opacity-60 hover:opacity-100'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: img,
                                                className: `w-full h-full object-cover ${product.isOutOfStock ? 'grayscale' : ''}`,
                                                alt: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 284,
                                                columnNumber: 354
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, i, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-3 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center flex-wrap gap-3",
                                children: [
                                    product.isShockSale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 bg-purple-600 text-white text-[9px] font-black rounded-sm uppercase tracking-tighter",
                                        children: "XẢ KHO SIÊU SỐC"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 291,
                                        columnNumber: 38
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 bg-[#ee4d2d] text-white text-[9px] font-black rounded-sm uppercase tracking-tighter",
                                        children: "YÊU THÍCH"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 291,
                                        columnNumber: 176
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-bold text-slate-400 uppercase tracking-widest",
                                        children: [
                                            "Thương hiệu: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleBrandClick(product.brand),
                                                className: "text-[#ee4d2d] hover:underline font-black",
                                                children: product.brand
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 292,
                                                columnNumber: 109
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !product.hideWarranty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 text-[9px] font-black rounded-sm uppercase tracking-tighter border flex items-center gap-1 ${product.warrantyMonths > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: `fa-solid ${product.warrantyMonths > 0 ? 'fa-shield-check' : 'fa-shield-xmark'}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 296,
                                                columnNumber: 20
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            product.warrantyMonths > 0 ? `Bảo hành ${product.warrantyMonths} tháng` : 'Sản phẩm không bảo hành'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 295,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    product.isFreeship && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 text-[9px] font-black rounded-sm uppercase tracking-tighter border flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-truck-fast"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 302,
                                                columnNumber: 20
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Miễn phí vận chuyển"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 301,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 290,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none",
                                children: product.name
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 307,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-4 py-4 border-y border-slate-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-3xl md:text-4xl font-black ${product.isOutOfStock ? 'text-slate-400' : product.isShockSale ? 'text-purple-600' : 'text-[#ee4d2d]'}`,
                                        children: [
                                            "₫",
                                            currentPrice.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 309,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    product.originalPrice && product.originalPrice > currentPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-slate-400 line-through text-lg font-medium opacity-60",
                                        children: [
                                            "₫",
                                            product.originalPrice.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 310,
                                        columnNumber: 83
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 308,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pb-2 flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarRating, {
                                            rating: product.rating
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 314,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-slate-400 font-black uppercase",
                                            children: [
                                                "(",
                                                productReviews.length,
                                                " Đánh giá)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 315,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 312,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            (giftActive || buyXGetY) && !product.isOutOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-pink-50 border border-pink-100 rounded-sm space-y-3 animate-in slide-in-from-top-2 duration-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-pink-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-gift"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 322,
                                                columnNumber: 20
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-black uppercase italic tracking-tighter",
                                                children: "Ưu đãi đặc biệt từ Asun"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 323,
                                                columnNumber: 20
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 321,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            buyXGetY && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-white p-2.5 rounded-sm border border-pink-100 shadow-sm group",
                                                onClick: ()=>openGiftLightbox(giftProduct ? giftProduct.images[0] : product.promoGiftImage || ''),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 bg-pink-50 rounded-sm flex items-center justify-center shrink-0 border border-pink-50 overflow-hidden cursor-zoom-in",
                                                        children: giftProduct ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: giftProduct.images[0],
                                                            className: "w-full h-full object-cover",
                                                            alt: "gift"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 329,
                                                            columnNumber: 43
                                                        }, ("TURBOPACK compile-time value", void 0)) : product.promoGiftImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: product.promoGiftImage,
                                                            className: "w-full h-full object-cover",
                                                            alt: "gift"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 329,
                                                            columnNumber: 156
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-boxes-stacked text-pink-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 329,
                                                            columnNumber: 245
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] font-black text-slate-800 uppercase leading-none mb-1",
                                                                children: [
                                                                    "CHƯƠNG TRÌNH MUA ",
                                                                    product.promoBuyQty,
                                                                    " TẶNG ",
                                                                    product.promoGetQty
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 28
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-pink-600 font-bold italic truncate",
                                                                children: [
                                                                    "Quà tặng: ",
                                                                    giftProduct?.name || product.promoGiftName || product.name
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 333,
                                                                columnNumber: 28
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 327,
                                                columnNumber: 22
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            giftActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 bg-white p-2.5 rounded-sm border border-pink-100 shadow-sm",
                                                onClick: ()=>openGiftLightbox(product.giftImage || ''),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 bg-pink-50 rounded-sm flex items-center justify-center shrink-0 border border-pink-50 overflow-hidden cursor-zoom-in",
                                                        children: product.giftImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: product.giftImage,
                                                            className: "w-full h-full object-cover",
                                                            alt: "gift"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 340,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-gift text-pink-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 340,
                                                            columnNumber: 133
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] font-black text-slate-800 uppercase leading-none mb-1",
                                                                children: "QUÀ TẶNG KÈM TRỰC TIẾP"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 343,
                                                                columnNumber: 28
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-pink-600 font-bold italic truncate",
                                                                children: product.giftName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 28
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 338,
                                                columnNumber: 22
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    (product.promoEndDate || product.giftEndDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9px] text-slate-400 font-bold uppercase italic text-right",
                                        children: [
                                            "* Áp dụng đến hết ",
                                            new Date(product.promoEndDate || product.giftEndDate || '').toLocaleDateString('vi-VN')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 350,
                                        columnNumber: 20
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 320,
                                columnNumber: 14
                            }, ("TURBOPACK compile-time value", void 0)),
                            product.variants && product.variants.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 py-2",
                                children: product.variants.map((v, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-[10px] font-black uppercase text-slate-400 tracking-widest",
                                                children: v.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 360,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: v.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleVariantSelect(v.label, opt),
                                                        className: `px-4 py-2 border rounded-sm text-xs font-bold transition-all ${selectedVariants[v.label] === opt ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d] shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`,
                                                        children: opt
                                                    }, opt, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 82
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 361,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 359,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 358,
                                columnNumber: 14
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-4 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-1 gap-2",
                                        children: [
                                            product.isOutOfStock ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setAlertProduct(product),
                                                className: "flex-1 py-4 border-2 border-blue-600 text-blue-600 font-black uppercase text-xs tracking-widest transition-all shadow-sm bg-blue-50 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-bell"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 20
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Báo khi có hàng"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 368,
                                                columnNumber: 18
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>addToCart(product, selectedVariants),
                                                className: `flex-1 py-4 border-2 font-black uppercase text-xs tracking-widest transition-all shadow-sm ${product.isShockSale ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white' : 'border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white'}`,
                                                children: "Thêm Giỏ Hàng"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 372,
                                                columnNumber: 18
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleWishlist(product.id),
                                                className: `px-6 border-2 transition-all shadow-sm ${isInWishlist ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white' : 'border-slate-200 text-slate-400 hover:border-[#ee4d2d] hover:text-[#ee4d2d]'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fa-heart ${isInWishlist ? 'fa-solid' : 'fa-regular'} text-xl`
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 18
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 376,
                                                columnNumber: 16
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 366,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !product.isOutOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            addToCart(product, selectedVariants);
                                            router.push('/checkout');
                                        },
                                        className: `flex-1 py-4 font-black uppercase text-xs tracking-widest shadow-xl transition-all text-white active:scale-95 ${product.isShockSale ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#ee4d2d] hover:bg-[#d73211]'}`,
                                        children: "Mua Ngay"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductDetail.tsx",
                                        lineNumber: 381,
                                        columnNumber: 16
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 365,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductDetail.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 space-y-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex border-b overflow-x-auto no-scrollbar bg-slate-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab('desc'),
                                            className: `flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'desc' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`,
                                            children: [
                                                "MÔ TẢ CHI TIẾT",
                                                activeTab === 'desc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 46
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 393,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        allVideoUrls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab('video'),
                                            className: `flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'video' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`,
                                            children: [
                                                "VIDEO THỰC TẾ (",
                                                allVideoUrls.length,
                                                ")",
                                                activeTab === 'video' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 401,
                                            columnNumber: 20
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab('reviews'),
                                            className: `flex-1 min-w-[140px] py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-[#ee4d2d] bg-white' : 'text-slate-400 hover:text-slate-600'}`,
                                            children: [
                                                "ĐÁNH GIÁ (",
                                                productReviews.length,
                                                ")",
                                                activeTab === 'reviews' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 left-0 right-0 h-1 bg-[#ee4d2d]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 409,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 392,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 md:p-8 min-h-[400px]",
                                    children: [
                                        activeTab === 'desc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-in fade-in duration-500 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "sr-only",
                                                    children: [
                                                        "Thông tin chi tiết ",
                                                        product.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 24
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: descRef,
                                                    className: `text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line prose max-w-none transition-all duration-500 overflow-hidden relative rich-text-display ${!isDescExpanded && showSeeMore ? 'max-h-[450px]' : 'max-h-none'}`,
                                                    dangerouslySetInnerHTML: {
                                                        __html: product.description || "Nội dung sản phẩm đang được cập nhật..."
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 24
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                showSeeMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `mt-4 flex justify-center pt-6 ${!isDescExpanded ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-4' : 'border-t border-slate-50'}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setIsDescExpanded(!isDescExpanded),
                                                        className: "flex items-center gap-2 px-8 py-2.5 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95",
                                                        children: isDescExpanded ? 'THU GỌN' : 'XEM THÊM'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 30
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 27
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 420,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        activeTab === 'video' && allVideoUrls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-in fade-in duration-500 space-y-8",
                                            children: allVideoUrls.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-[10px] font-black uppercase text-slate-400 italic",
                                                            children: [
                                                                "Clip giới thiệu #",
                                                                index + 1
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "aspect-video w-full rounded-sm overflow-hidden bg-slate-900 shadow-md border border-slate-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                                                src: url,
                                                                className: "w-full h-full",
                                                                title: `Video review ${product.name} part ${index + 1}`,
                                                                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                                                                allowFullScreen: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 439,
                                                                columnNumber: 32
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 438,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 26
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 434,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        activeTab === 'reviews' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-in fade-in duration-500 space-y-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center justify-center bg-slate-50 p-6 rounded-sm border",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-5xl font-black text-[#ee4d2d]",
                                                                    children: product.rating
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 30
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "my-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarRating, {
                                                                        rating: product.rating
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 52
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 30
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-black text-slate-400 uppercase",
                                                                    children: [
                                                                        productReviews.length,
                                                                        " đánh giá thực tế"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                                    lineNumber: 458,
                                                                    columnNumber: 30
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "md:col-span-2 space-y-2",
                                                            children: ratingStats.map((count, i)=>{
                                                                const star = 5 - i;
                                                                const percentage = productReviews.length > 0 ? count / productReviews.length * 100 : 0;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] font-black text-slate-500 w-4",
                                                                            children: star
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                                            lineNumber: 466,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fa-solid fa-star text-[8px] text-yellow-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                                            lineNumber: 467,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-full bg-yellow-400",
                                                                                style: {
                                                                                    width: `${percentage}%`
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                lineNumber: 469,
                                                                                columnNumber: 40
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                                            lineNumber: 468,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] font-bold text-slate-400 w-8",
                                                                            children: [
                                                                                percentage.toFixed(0),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                                            lineNumber: 471,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, star, true, {
                                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 34
                                                                }, ("TURBOPACK compile-time value", void 0));
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 24
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-8",
                                                    children: paginatedReviews.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "py-12 text-center opacity-40",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-comments text-4xl mb-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 481,
                                                                columnNumber: 32
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] font-black uppercase",
                                                                children: [
                                                                    "Chưa có đánh giá nào ",
                                                                    selectedTagFilter ? 'với từ khóa này' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 482,
                                                                columnNumber: 32
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 480,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-8",
                                                        children: paginatedReviews.map((review)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-4 animate-in fade-in duration-500 pb-8 border-b last:border-none",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-start",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black",
                                                                                        children: review.userName.charAt(0)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                                        lineNumber: 490,
                                                                                        columnNumber: 42
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                className: "text-xs font-black text-slate-800 uppercase flex items-center gap-2",
                                                                                                children: [
                                                                                                    review.userName,
                                                                                                    " ",
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] rounded-sm flex items-center gap-1 border border-emerald-100",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                                className: "fa-solid fa-circle-check"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                                                lineNumber: 492,
                                                                                                                columnNumber: 282
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            " Đã mua hàng"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                                                        lineNumber: 492,
                                                                                                        columnNumber: 147
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                                lineNumber: 492,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "mt-1 flex items-center gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarRating, {
                                                                                                        rating: review.rating
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                                                        lineNumber: 494,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    review.tags?.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-1 rounded-sm",
                                                                                                            children: t
                                                                                                        }, t, false, {
                                                                                                            fileName: "[project]/components/ProductDetail.tsx",
                                                                                                            lineNumber: 496,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                                lineNumber: 493,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                                        lineNumber: 491,
                                                                                        columnNumber: 42
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                lineNumber: 489,
                                                                                columnNumber: 39
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[9px] text-slate-300 font-bold uppercase",
                                                                                children: new Date(review.createdAt).toLocaleDateString('vi-VN')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                                lineNumber: 501,
                                                                                columnNumber: 39
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                        lineNumber: 488,
                                                                        columnNumber: 36
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-slate-600 leading-relaxed italic",
                                                                        children: [
                                                                            '"',
                                                                            review.comment || 'Khách hàng không để lại nội dung.',
                                                                            '"'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                                        lineNumber: 505,
                                                                        columnNumber: 36
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, review.id, true, {
                                                                fileName: "[project]/components/ProductDetail.tsx",
                                                                lineNumber: 487,
                                                                columnNumber: 33
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 24
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 453,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 418,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ProductDetail.tsx",
                            lineNumber: 391,
                            columnNumber: 12
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 390,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 md:p-8 border rounded-sm shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-black uppercase italic border-b pb-5 tracking-tighter mb-6 flex items-center gap-3 text-slate-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-gears text-[#ee4d2d]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 520,
                                            columnNumber: 16
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " THÔNG SỐ KỸ THUẬT"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center py-2 border-b border-slate-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-black text-slate-400 uppercase tracking-widest",
                                                    children: "Thương hiệu"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-black text-slate-700 uppercase",
                                                    children: product.brand
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ProductDetail.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 523,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        product.specs && product.specs.length > 0 ? product.specs.map((spec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start py-2 border-b border-slate-50 last:border-none",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest pt-0.5",
                                                        children: spec.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 530,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-slate-600 text-right max-w-[60%]",
                                                        children: spec.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ProductDetail.tsx",
                                                        lineNumber: 531,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/components/ProductDetail.tsx",
                                                lineNumber: 529,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-400 italic text-center py-4",
                                            children: "Đang cập nhật..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductDetail.tsx",
                                            lineNumber: 535,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ProductDetail.tsx",
                            lineNumber: 518,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 517,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductDetail.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isLightboxOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300",
                onClick: ()=>{
                    setIsLightboxOpen(false);
                    setLightboxImageOverride(null);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "absolute top-6 right-6 text-white text-4xl hover:text-[#ee4d2d] transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fa-solid fa-xmark"
                        }, void 0, false, {
                            fileName: "[project]/components/ProductDetail.tsx",
                            lineNumber: 544,
                            columnNumber: 113
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 544,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !lightboxImageOverride && product.images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: prevImage,
                                className: "absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white hover:bg-[#ee4d2d] transition-all flex items-center justify-center shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-chevron-left text-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 547,
                                    columnNumber: 219
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 547,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: nextImage,
                                className: "absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white hover:bg-[#ee4d2d] transition-all flex items-center justify-center shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-chevron-right text-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/components/ProductDetail.tsx",
                                    lineNumber: 548,
                                    columnNumber: 220
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductDetail.tsx",
                                lineNumber: 548,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: lightboxImageOverride || product.images[selectedImageIdx],
                        className: "max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-500 shadow-2xl rounded-sm",
                        onClick: (e)=>e.stopPropagation(),
                        alt: "Zoomed view"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductDetail.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductDetail.tsx",
                lineNumber: 543,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductDetail.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ProductDetail, "v85TD27xjd4/X9Pc7jx7UW6zS9w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c1 = ProductDetail;
const __TURBOPACK__default__export__ = ProductDetail;
var _c, _c1;
__turbopack_context__.k.register(_c, "StarRating");
__turbopack_context__.k.register(_c1, "ProductDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_30bb2b7b._.js.map