import { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";

type Props = {
  params?: {
    slug?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const rawSlug = slug || "";

  const title = rawSlug
    .split("-blog-")[0]
    .replace(/-/g, " ");

  return {
    title: `${title} | Tin tức Asun`,
    description: `Bài viết ${title} - Kiến thức máy lọc nước từ Asun Việt Nam`,
    openGraph: {
      title,
      description: `Bài viết ${title}`,
      type: "article",
    }
  };
}

export default function BlogDetailPage() {
  return <BlogDetail />;
}