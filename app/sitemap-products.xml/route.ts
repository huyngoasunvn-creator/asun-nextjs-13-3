import { serverDb } from "@/services/firebaseServer";
import { collection, getDocs } from "firebase/firestore/lite";
import { createSlug } from "@/utils/seo";

export const revalidate = 3600;

export async function GET() {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const snapshot = await getDocs(collection(serverDb, "products"));

  const urls = snapshot.docs.map((doc) => {

    const data = doc.data() as {
      name?: string;
      createdAt?: string;
      isHidden?: boolean;
    };

    if (!data.name || data.isHidden) return "";

    const slug = createSlug(data.name, doc.id);

    return `
      <url>
        <loc>${baseUrl}/product/${slug}</loc>
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
