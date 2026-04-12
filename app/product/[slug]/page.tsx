import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { serverDb } from "@/services/firebaseServer";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore/lite";
import { Product, Review } from "@/types";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

function getIdFromSlug(slug: string) {

  const parts = slug.split("-p-");

  if (parts.length < 2) return null;

  return `p-${parts[1]}`;

}

async function getProduct(slug?: string) {
  if (!slug) return null;

  const id = getIdFromSlug(slug);
  if (!id) return null;

  const ref = doc(serverDb, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const product: any = {
    id: snap.id,
    ...snap.data()
  };

  if (product.isHidden) return null;

  return product;
}

async function getProductReviews(productId?: string): Promise<Review[]> {
  if (!productId) return [];

  const reviewsQuery = query(
    collection(serverDb, "reviews"),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(reviewsQuery);

  return snapshot.docs
    .map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as Omit<Review, "id">) }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function getRelatedProducts(product?: Product | null): Promise<Product[]> {
  if (!product) return [];

  const snapshot = await getDocs(collection(serverDb, "products"));

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Product, "id">),
    }))
    .filter(
      (candidate) =>
        !candidate.isHidden &&
        candidate.id !== product.id &&
        (candidate.category === product.category || candidate.brand === product.brand)
    )
    .slice(0, 8);
}

async function getGiftProduct(product?: Product | null): Promise<Product | null> {
  if (!product?.promoGiftProductId) return null;

  const ref = doc(serverDb, "products", product.promoGiftProductId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const giftProduct = {
    id: snap.id,
    ...(snap.data() as Omit<Product, "id">),
  };

  if (giftProduct.isHidden) return null;

  return giftProduct;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const product: any = await getProduct(slug);
  const productReviews = await getProductReviews(product?.id);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.asun.vn";

  if (!product) {
    return {
      title: "Sản phẩm | Asun Việt Nam",
      description: "Danh sách sản phẩm tại Asun Việt Nam",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const cleanDesc =
    product.description?.replace(/<[^>]*>?/gm, "") || "";

  const title = product.seoTitle?.trim() || `${product.name} | Asun Việt Nam`;

  const description =
    product.seoDescription?.trim() ||
    cleanDesc.slice(0, 160) ||
    `Mua ${product.name} chính hãng tại Asun Việt Nam`;

  const image = product.images?.[0]
  ? product.images[0].startsWith("http")
    ? product.images[0]
    : `${baseUrl}${product.images[0]}`
  : `${baseUrl}/logo.png`;

  const url = `${baseUrl}/product/${slug}`;

  return {
    metadataBase: new URL(baseUrl),

    title,
    description,

    keywords: [
      product.name,
      `mua ${product.name}`,
      `giá ${product.name}`,
      "Asun Việt Nam"
    ],

    alternates: {
      canonical: url
    },

    robots: {
      index: true,
      follow: true
    },

    openGraph: {
  title,
  description,
  url,
  siteName: "Asun Việt Nam",

  images: [
    {
      url: image,
      width: 1200,
      height: 630,
      alt: product.name
    }
  ],

  locale: "vi_VN",
  type: "website"
},

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function ProductPage({ params }: Props) {

  const { slug } = await params;

  const product: any = await getProduct(slug);
  const [productReviews, relatedProducts, giftProduct] = await Promise.all([
    getProductReviews(product?.id),
    getRelatedProducts(product),
    getGiftProduct(product),
  ]);

  if (!product) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const url = `${baseUrl}/product/${slug}`;

  const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: product.images?.[0] || "/logo.png",
  description: product.description,
  sku: product.id,

  brand: {
    "@type": "Brand",
    name: product.brand || "Asun Việt Nam"
  },

  offers: {
    "@type": "Offer",
    url: url,
    price: product.price,
    priceCurrency: "VND",
    priceValidUntil: "2026-12-31",
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition"
  }
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      <ProductDetail
        initialProduct={product}
        initialReviews={productReviews}
        initialRelatedProducts={relatedProducts}
        initialGiftProduct={giftProduct}
      />
    </>
  );
}
