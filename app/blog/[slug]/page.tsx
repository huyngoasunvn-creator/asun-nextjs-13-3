import { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseClient";

type Props = {
  params: Promise<{ slug: string }>;
};

type Blog = {
id: string;
title: string;
excerpt: string;
image: string;
content?: string;
author?: string;
createdAt?: string;
};

// lấy ID từ slug
function getIdFromSlug(slug?: string) {

if (!slug) return null;

const parts = slug.split("-");

const last = parts.at(-1);

if (!last) return null;

return `blog-${last}`;
}

// lấy blog từ firestore
async function getBlog(id?: string | null): Promise<Blog | null> {

if (!id) return null;

const ref = doc(db, "blogPosts", id);

const snap = await getDoc(ref);

if (!snap.exists()) return null;

return {
  id: snap.id,
  ...(snap.data() as Omit<Blog, "id">)
};
}

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {

const { slug } = await params;

const id = getIdFromSlug(slug);

if (!id) {
  return {
    title: "Tin tức",
    description: "Tin tức mới nhất"
  };
}

const blog = await getBlog(id);

if (!blog) {
  return {
    title: "Tin tức",
    description: "Tin tức mới nhất"
  };
}

const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

return {
  title: blog.title,
  description: blog.excerpt,

  alternates: {
    canonical: url
  },

  openGraph: {
    title: blog.title,
    description: blog.excerpt,
    url,
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

// PAGE
export default async function BlogPage({ params }: Props) {

const { slug } = await params;

const id = getIdFromSlug(slug);

if (!id) {
  return <div>Không tìm thấy bài viết</div>;
}

const blog = await getBlog(id);

if (!blog) {
  return <div>Không tìm thấy bài viết</div>;
}

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
description: blog.excerpt,
mainEntityOfPage: {
"@type": "WebPage",
"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
}
})
}}
/>

<BlogDetail />

</>
);
}