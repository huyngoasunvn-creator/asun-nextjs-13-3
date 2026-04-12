import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/services/adminAuth";

type ProductDescriptionPayload = {
  name?: string;
  brand?: string;
  category?: string;
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

    const { name, brand, category } =
      (await request.json()) as ProductDescriptionPayload;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Thiếu tên sản phẩm." }, { status: 400 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu cấu hình Gemini API key." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Viết mô tả sản phẩm chuyên nghiệp bằng TIẾNG VIỆT cho mặt hàng ${category || "Điện máy"} tên là ${name.trim()} của hãng ${brand?.trim() || "TechNova"}. Nổi bật các tính năng công nghệ. Giới hạn dưới 100 từ.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "Không tạo được mô tả.",
    });
  } catch (error) {
    console.error("Gemini product description API error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo mô tả bằng AI." },
      { status: 500 }
    );
  }
}
