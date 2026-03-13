import { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Sản phẩm",
    };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),

    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
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
      description: product.description.slice(0, 160),
      images: [product.images?.[0]]
    }
  };
}

export default async function ProductPage({ params }: Props) {

  const { slug } = await params;

  const product = await getProduct(slug);

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
              name: product.brand
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "VND",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.soldCount
            }
          })
        }}
      />

      <ProductDetail />
    </>
  );
}