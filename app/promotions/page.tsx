import type { Metadata } from "next";
import Promotions from '@/components/Promotions';
import { getPublicProducts } from "@/services/publicStore";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Khuyến mãi điện máy mới nhất",
  description:
    "Khám phá ưu đãi, quà tặng và mã giảm giá điện máy, gia dụng mới nhất tại Asun Việt Nam.",
  alternates: {
    canonical: `${baseUrl}/promotions`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Khuyến mãi điện máy mới nhất | Asun Việt Nam",
    description:
      "Khám phá ưu đãi, quà tặng và mã giảm giá điện máy, gia dụng mới nhất tại Asun Việt Nam.",
    url: `${baseUrl}/promotions`,
    siteName: "Asun Việt Nam",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function PromotionsPage() {
  const products = await getPublicProducts();
  return <Promotions initialProducts={products} />;
}
