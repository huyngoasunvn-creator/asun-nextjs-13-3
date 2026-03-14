import { db } from "@/services/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const snapshot = await getDocs(collection(db, "products"));

  const urls = snapshot.docs.map((doc) => {

    const data: any = doc.data();

    const nameSlug = data.name
      ?.normalize("NFD")
      ?.replace(/[\u0300-\u036f]/g, "")
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\s-]/g, "")
      ?.replace(/\s+/g, "-")
      ?.slice(0, 60);

    const slug =
      data.slug || `${nameSlug}-p-${doc.id}`;

    return `
      <url>
        <loc>${baseUrl}/product/${slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
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