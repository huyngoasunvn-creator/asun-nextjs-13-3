import { createHash } from "crypto";

import { verifyAdminRequest } from "@/services/adminAuth";

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

function buildSignature(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

function sanitizeFolderName(value: string, fallback: string) {
  const sanitized = value
    .trim()
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "");

  return sanitized || fallback;
}

export async function POST(request: Request) {
  const adminVerification = await verifyAdminRequest(request);

  if ("error" in adminVerification) {
    return Response.json(
      { error: adminVerification.error },
      { status: adminVerification.status }
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "asun";

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderValue = formData.get("folder");
  const folder =
    typeof folderValue === "string" && folderValue.trim()
      ? sanitizeFolderName(folderValue, defaultFolder)
      : defaultFolder;

  if (!(file instanceof File)) {
    return Response.json(
      { error: "No image file was provided." },
      { status: 400 }
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return Response.json(
      { error: "Định dạng ảnh không được hỗ trợ." },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: "Ảnh quá lớn. Vui lòng chọn file nhỏ hơn 8MB." },
      { status: 400 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const uploadParams = {
    folder,
    timestamp,
    unique_filename: "true",
    use_filename: "true",
  };
  const signature = buildSignature(uploadParams, apiSecret);

  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("api_key", apiKey);
  cloudinaryFormData.append("timestamp", timestamp);
  cloudinaryFormData.append("folder", folder);
  cloudinaryFormData.append("unique_filename", "true");
  cloudinaryFormData.append("use_filename", "true");
  cloudinaryFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    }
  );

  const result = (await response.json()) as CloudinaryResponse;

  if (!response.ok || !result.secure_url) {
    return Response.json(
      {
        error: result.error?.message || "Cloudinary upload failed unexpectedly.",
      },
      { status: response.status || 500 }
    );
  }

  return Response.json({
    url: result.secure_url,
    publicId: result.public_id || null,
  });
}
