import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

  return [
    {
      url: "https://asun.vn",
      lastModified: new Date(),
    },
    {
      url: "https://asun.vn/blog",
      lastModified: new Date(),
    },
    {
      url: "https://asun.vn/product",
      lastModified: new Date(),
    }
  ];
}