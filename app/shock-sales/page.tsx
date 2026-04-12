import type { Metadata } from "next";
import ShockSales from '@/components/ShockSales';
import { getPublicProducts } from "@/services/publicStore";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Xả kho và giá sốc điện máy",
  description:
    "Theo dõi danh sách xả kho, giảm sâu và giá sốc cho các sản phẩm điện máy, gia dụng tại Asun Việt Nam.",
  alternates: {
    canonical: `${baseUrl}/shock-sales`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Xả kho và giá sốc điện máy | Asun Việt Nam",
    description:
      "Theo dõi danh sách xả kho, giảm sâu và giá sốc cho các sản phẩm điện máy, gia dụng tại Asun Việt Nam.",
    url: `${baseUrl}/shock-sales`,
    siteName: "Asun Việt Nam",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function ShockSalesPage() {
  const products = await getPublicProducts();
  return <ShockSales initialProducts={products} />;
}
