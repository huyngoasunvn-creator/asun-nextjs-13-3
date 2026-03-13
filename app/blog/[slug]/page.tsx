import { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlog(slug: string) {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Tin tức"
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,

    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      siteName: "Asun Việt Nam",
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630
        }
      ],
      locale: "vi_VN",
      type: "article"
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.image]
    }
  };
}

export default async function BlogPage({ params }: Props) {

  const { slug } = await params;

  const blog = await getBlog(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blog.title,
            image: blog.image,
            author: {
              "@type": "Person",
              name: blog.author || "Admin"
            },
            publisher: {
              "@type": "Organization",
              name: "Asun Việt Nam"
            },
            datePublished: blog.createdAt,
            description: blog.excerpt
          })
        }}
      />

      <BlogDetail />
    </>
  );
}