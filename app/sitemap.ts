import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/flash-sales`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/shock-sales`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/sitemap-products.xml`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/sitemap-blog.xml`,
      lastModified: new Date()
    }
  ];
}
