export const config = {
  runtime: 'edge',
};

const BOT_HTML = ({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />

  <meta name="twitter:card" content="summary_large_image" />
</head>
<body></body>
</html>
`;

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return new Response('Missing path', { status: 400 });
  }

  try {
    const isProduct = path.startsWith('/product/');
    const id = path.split('-').pop();
    const collection = isProduct ? 'products' : 'blogPosts';

    const projectId = 'droppii-electrohub';

const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${id}`;


    const res = await fetch(firestoreUrl);
    const json = await res.json();

    const fields = json.fields || {};

    const title =
      fields.name?.stringValue ||
      fields.title?.stringValue ||
      'Asun Việt Nam';

    const description =
      fields.description?.stringValue ||
      fields.excerpt?.stringValue ||
      '';

    const image =
      fields.image?.stringValue ||
      fields.thumbnail?.stringValue ||
      'https://asun.vn/og-default.jpg';

    return new Response(
      BOT_HTML({
        title,
        description,
        image,
        url: `https://www.asun.vn${path}`,
      }),
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (e) {
    return new Response('OG error', { status: 500 });
  }
}
