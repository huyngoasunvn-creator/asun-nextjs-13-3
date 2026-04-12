import { serverDb } from "@/services/firebaseServer";
import { collection, getDocs } from "firebase/firestore/lite";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const snapshot = await getDocs(collection(serverDb, "blogPosts"));

  const urls = snapshot.docs.map((doc) => {

    const data = doc.data() as {
      slug?: string;
      createdAt?: string;
      isPublished?: boolean;
    };
    const slug = data.slug;

    if (!slug || !data.isPublished) return "";

    const publicId = doc.id.replace(/^blog-/, "");

    return `
      <url>
        <loc>${baseUrl}/blog/${slug}-${publicId}</loc>
        <lastmod>${data.createdAt || new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;

  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
