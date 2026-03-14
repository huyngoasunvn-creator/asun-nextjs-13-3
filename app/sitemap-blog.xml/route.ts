import { NextResponse } from "next/server";
import { db } from "@/services/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

    const snapshot = await getDocs(collection(db, "blogs"));

    const urls = snapshot.docs.map((doc) => {
      const data: any = doc.data();

      return `
        <url>
          <loc>${baseUrl}/blog/${data.slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

  } catch (error) {
    console.error("SITEMAP BLOG ERROR:", error);

    return new NextResponse("Error generating sitemap", {
      status: 500,
    });
  }
}