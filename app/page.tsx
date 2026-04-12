import type { Metadata } from "next";
import ProductList from "@/components/ProductList";
import { getHomePageData } from "@/services/publicStore";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {

  title: "Asun Việt Nam | Điện máy chính hãng giá tốt",
  
  description:
    "Asun Việt Nam chuyên cung cấp điện máy chính hãng, giá tốt, nhiều khuyến mãi hấp dẫn. Giao hàng toàn quốc.",

  keywords: [
    "Asun Việt Nam",
    "điện máy",
    "mua điện máy",
    "điện máy chính hãng",
    "thiết bị điện tử"
  ],

  robots: {
    index: true,
    follow: true
  },

  alternates: {
  canonical: `${baseUrl}/`
},

  openGraph: {
    title: "Asun Việt Nam | Điện máy chính hãng giá tốt",
    description:
      "Asun Việt Nam chuyên cung cấp điện máy chính hãng, giá tốt, nhiều khuyến mãi hấp dẫn.",
    url: baseUrl,
    siteName: "Asun Việt Nam",

    images: [
  {
    url: `${baseUrl}/opengraph-image.jpg`,
    width: 1200,
    height: 630,
    alt: "Asun Việt Nam"
  }
],

    locale: "vi_VN",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Asun Việt Nam | Điện máy chính hãng",
    description:
      "Asun Việt Nam chuyên cung cấp điện máy chính hãng giá tốt.",
    images: [`${baseUrl}/opengraph-image.jpg`]
  }
};

export default async function Home() {
  const homeData = await getHomePageData();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Asun Việt Nam",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      <ProductList
        initialProducts={homeData.products}
        initialBanners={homeData.banners}
        initialCoupons={homeData.coupons}
        initialBrands={homeData.brands}
        initialCommitments={homeData.commitments}
        initialCategoryConfigs={homeData.categoryConfigs}
        initialCategoryThemes={homeData.categoryThemes}
        initialVisibleCategories={homeData.visibleCategories}
      />
    </>
  );
}
