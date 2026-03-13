import { MetadataRoute } from "next";
import { db } from "@/services/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/product`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    }
  ];

  try {

    const productSnapshot = await getDocs(
      collection(db, "products")
    );

    const productPages: MetadataRoute.Sitemap =
      productSnapshot.docs.map((doc) => {

        const data: any = doc.data();

        const slug =
          data.slug ||
          `${data.name?.toLowerCase()
            ?.replace(/[^a-z0-9\s-]/g, "")
            ?.replace(/\s+/g, "-")}-p-${doc.id}`;

        return {
          url: `${baseUrl}/product/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8
        };
      });

    return [...staticPages, ...productPages];

  } catch (error) {

    console.error("Sitemap error:", error);

    return staticPages;
  }
}