
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (name: string, brand: string, category: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Viết mô tả sản phẩm chuyên nghiệp bằng TIẾNG VIỆT cho mặt hàng ${category} tên là ${name} của hãng ${brand}. Nổi bật các tính năng công nghệ. Giới hạn dưới 100 từ.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Không tạo được mô tả.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lỗi khi tạo nội dung.";
  }
};

export const generateBlogArticle = async (title: string, keywords: string[]): Promise<{ content: string; excerpt: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Viết một bài blog chuyên sâu bằng TIẾNG VIỆT với tiêu đề: "${title}".
    Từ khóa cần bao gồm: ${keywords.join(', ')}.
    Yêu cầu:
    1. Nội dung hấp dẫn, hữu ích, chuẩn SEO.
    2. Sử dụng định dạng HTML (h2, h3, p, strong, ul, li).
    3. Độ dài khoảng 500-700 từ.
    4. Trình bày dưới dạng một chuỗi văn bản HTML duy nhất.
    5. Ở cuối phản hồi, hãy thêm một đoạn tóm tắt ngắn (excerpt) dưới 150 chữ, ngăn cách với nội dung chính bằng chuỗi "---EXCERPT---".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const fullText = response.text || "";
    const parts = fullText.split("---EXCERPT---");
    
    return {
      content: parts[0]?.trim() || "Không tạo được nội dung.",
      excerpt: parts[1]?.trim() || "Không tạo được tóm tắt."
    };
  } catch (error) {
    console.error("Gemini AI Blog Error:", error);
    throw error;
  }
};
