import { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";
import { doc, getDoc } from "firebase/firestore/lite";
import { serverDb } from "@/services/firebaseServer";
import { notFound } from "next/navigation";
import { BlogPost } from "@/types";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

type Blog = BlogPost;

function getIdFromSlug(slug?: string) {
  if (!slug) return null;

  const parts = slug.split("-");
  const last = parts.at(-1);

  if (!last) return null;

  return `blog-${last}`;
}

async function getBlog(id?: string | null): Promise<Blog | null> {

  if (!id) return null;

  const ref = doc(serverDb, "blogPosts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const blog = {
    id: snap.id,
    ...(snap.data() as Omit<Blog, "id">)
  };

  if (!blog.isPublished) return null;

  return blog;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    return {
      title: "Tin tức | Asun Việt Nam",
      description: "Tin tức mới nhất từ Asun Việt Nam"
    };
  }

  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Tin tức | Asun Việt Nam",
      description: "Tin tức mới nhất từ Asun Việt Nam"
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const url = `${baseUrl}/blog/${slug}`;

  const description =
    blog.excerpt?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
    "Tin tức mới nhất từ Asun Việt Nam";

  const image = blog.image || `${baseUrl}/logo.png`;

  return {

    title: blog.title,
    description,

    robots: {
      index: true,
      follow: true
    },

    alternates: {
      canonical: url
    },

    openGraph: {
      title: blog.title,
      description,
      url,
      siteName: "Asun Việt Nam",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title
        }
      ],

      locale: "vi_VN",
      type: "article",
      publishedTime: blog.createdAt
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [image]
    }
  };
}

export default async function BlogPage({ params }: Props) {

  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

  const url = `${baseUrl}/blog/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    image: blog.image,
    datePublished: blog.createdAt,
    dateModified: blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "Admin"
    },
    publisher: {
      "@type": "Organization",
      name: "Asun Việt Nam"
    },
    description: blog.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      <BlogDetail initialBlog={blog} />
    </>
  );
}
