import { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const title = slug
    .split("-p-")[0]
    .replace(/-/g, " ");

  return {
    title: `${title} | Asun Việt Nam`,
    description: `Chi tiết sản phẩm ${title}`,

    openGraph: {
      title,
      description: `Chi tiết sản phẩm ${title}`,
      type: "website",
    }
  };
}

export default function ProductPage() {
  return <ProductDetail />;
}