import type { Metadata } from "next";
import FlashSales from '@/components/FlashSales';
import { getPublicProducts } from "@/services/publicStore";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Flash Sale điện máy hôm nay",
  description:
    "Săn Flash Sale điện máy, gia dụng và thiết bị công nghệ chính hãng với giá tốt mỗi ngày tại Asun Việt Nam.",
  alternates: {
    canonical: `${baseUrl}/flash-sales`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Flash Sale điện máy hôm nay | Asun Việt Nam",
    description:
      "Săn Flash Sale điện máy, gia dụng và thiết bị công nghệ chính hãng với giá tốt mỗi ngày tại Asun Việt Nam.",
    url: `${baseUrl}/flash-sales`,
    siteName: "Asun Việt Nam",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function FlashSalesPage() {
  const products = await getPublicProducts();
  return <FlashSales initialProducts={products} />;
}
