import { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params?: {
    slug?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const rawSlug = slug || "";

  const title = rawSlug
    .split("-p-")[0]
    .replace(/-/g, " ");

  const url = `https://asun.vn/product/${rawSlug}`;

  return {
    title: `${title} | Asun Việt Nam`,
    description: `Mua ${title} chính hãng tại Asun Việt Nam`,

    openGraph: {
      title: title,
      description: `Mua ${title} chính hãng`,
      url: url,
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
        }
      ]
    },

    twitter: {
      card: "summary_large_image",
      title: title,
      description: `Mua ${title} chính hãng`,
      images: ["/logo.png"]
    }
  };
}

export default function ProductPage() {
  return <ProductDetail />;
}