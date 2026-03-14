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
      url: `${baseUrl}/sitemap-products.xml`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/sitemap-blog.xml`,
      lastModified: new Date()
    }
  ];
}