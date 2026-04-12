import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/services/adminAuth";

type BlogArticlePayload = {
  title?: string;
  keywords?: string[];
};

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.API_KEY;

export async function POST(request: Request) {
  try {
    const adminVerification = await verifyAdminRequest(request);

    if ("error" in adminVerification) {
      return NextResponse.json(
        { error: adminVerification.error },
        { status: adminVerification.status }
      );
    }

    const { title, keywords = [] } = (await request.json()) as BlogArticlePayload;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Thiếu tiêu đề bài viết." },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu cấu hình Gemini API key." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Viết một bài blog chuyên sâu bằng TIẾNG VIỆT với tiêu đề: "${title.trim()}".
Từ khóa cần bao gồm: ${keywords.join(", ")}.
Yêu cầu:
1. Nội dung hấp dẫn, hữu ích, chuẩn SEO.
2. Sử dụng định dạng HTML (h2, h3, p, strong, ul, li).
3. Độ dài khoảng 500-700 từ.
4. Trình bày dưới dạng một chuỗi văn bản HTML duy nhất.
5. Ở cuối phản hồi, hãy thêm một đoạn tóm tắt ngắn (excerpt) dưới 150 chữ, ngăn cách với nội dung chính bằng chuỗi "---EXCERPT---".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const fullText = response.text || "";
    const parts = fullText.split("---EXCERPT---");

    return NextResponse.json({
      content: parts[0]?.trim() || "Không tạo được nội dung.",
      excerpt: parts[1]?.trim() || "Không tạo được tóm tắt.",
    });
  } catch (error) {
    console.error("Gemini blog article API error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo nội dung blog bằng AI." },
      { status: 500 }
    );
  }
}
