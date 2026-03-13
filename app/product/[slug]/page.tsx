
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { db } from "@/services/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: Promise<{ slug: string }>;
};

function getIdFromSlug(slug: string) {

  const parts = slug.split("-");

  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];

  if (secondLast === "p") {
    return "p-" + last;
  }

  return last;
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

  if (!product) {
    return {
      title: "Sản phẩm",
      description: "Sản phẩm tại Asun Việt Nam"
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: product.name,
    description: product.description?.slice(0, 160),

    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      url: `${baseUrl}/product/${slug}`,
      siteName: "Asun Việt Nam",
      images: [
        {
          url: product.images?.[0],
          width: 1200,
          height: 630
        }
      ],
      locale: "vi_VN",
      type: "website"
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.slice(0, 160),
      images: [product.images?.[0]]
    }
  };
}

export default async function ProductPage({ params }: Props) {

  const { slug } = await params;

  const product: any = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description,
            brand: {
              "@type": "Brand",
              name: product.brand || "Asun"
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "VND",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock"
            }
          })
        }}
      />

      <ProductDetail initialProduct={product} />
    </>
  );
}