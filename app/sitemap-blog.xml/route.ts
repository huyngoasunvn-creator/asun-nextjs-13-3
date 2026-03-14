export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`
    );

    const data = await res.json();

    const urls = (data.documents || []).map((doc: any) => {
      const slug = doc.fields.slug?.stringValue;

      return `
        <url>
          <loc>${baseUrl}/blog/${slug}</loc>
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

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

  } catch (error) {
    console.error(error);

    return new Response("Lỗi khi tạo sơ đồ trang web", {
      status: 500,
    });
  }
}