import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { db } from "@/services/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: Promise<{ slug: string }>;
};

function getIdFromSlug(slug: string) {
  const match = slug.match(/p-\d+$/);
  return match ? match[0] : null;
}

async function getProduct(slug?: string) {
  if (!slug) return null;

  const id = getIdFromSlug(slug);
  if (!id) return null;

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const product: any = await getProduct(slug);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

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

  const title = `${product.name} | Asun Việt Nam`;

  const description =
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

      <ProductDetail initialProduct={product} />
    </>
  );
}