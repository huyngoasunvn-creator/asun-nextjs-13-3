import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import { getPublishedBlogPosts } from "@/services/publicStore";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tin tức & Mẹo hay điện máy",
  description:
    "Cập nhật tin tức điện máy, mẹo sử dụng gia dụng, đánh giá sản phẩm và xu hướng công nghệ mới từ Asun Việt Nam.",
  keywords: [
    "tin tức điện máy",
    "mẹo gia dụng",
    "đánh giá sản phẩm",
    "kinh nghiệm mua điện máy",
    "Asun Việt Nam blog",
  ],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tin tức & Mẹo hay điện máy | Asun Việt Nam",
    description:
      "Khám phá bài viết hướng dẫn, đánh giá và xu hướng công nghệ mới nhất từ Asun Việt Nam.",
    url: `${baseUrl}/blog`,
    siteName: "Asun Việt Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${baseUrl}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Tin tức Asun Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin tức & Mẹo hay điện máy | Asun Việt Nam",
    description:
      "Khám phá bài viết hướng dẫn, đánh giá và xu hướng công nghệ mới nhất từ Asun Việt Nam.",
    images: [`${baseUrl}/opengraph-image.jpg`],
  },
};

export default async function BlogListPage() {
  const posts = await getPublishedBlogPosts();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tin tức & Mẹo hay điện máy",
    description:
      "Danh sách bài viết chia sẻ kinh nghiệm sử dụng điện máy, mẹo gia dụng và xu hướng công nghệ từ Asun Việt Nam.",
    url: `${baseUrl}/blog`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogList initialPosts={posts} />
    </>
  );
}
