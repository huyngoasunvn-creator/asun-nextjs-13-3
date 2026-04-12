import { getAdminRequestHeaders } from "@/services/adminClient";

async function requestJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: await getAdminRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Không thể gọi dịch vụ AI.");
  }

  return data;
}

export const generateProductDescription = async (
  name: string,
  brand: string,
  category: string
): Promise<string> => {
  const data = await requestJson<{ text: string }>("/api/ai/product-description", {
    name,
    brand,
    category,
  });

  return data.text || "Không tạo được mô tả.";
};

export const generateBlogArticle = async (
  title: string,
  keywords: string[]
): Promise<{ content: string; excerpt: string }> => {
  return requestJson<{ content: string; excerpt: string }>("/api/ai/blog-article", {
    title,
    keywords,
  });
};
