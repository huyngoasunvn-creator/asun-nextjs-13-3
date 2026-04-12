import { getAdminRequestHeaders } from "@/services/adminClient";

type UploadImageOptions = {
  folder?: string;
};

type UploadImageResponse = {
  url: string;
  publicId: string | null;
};

const CLIENT_MAX_DIMENSION = 2000;
const CLIENT_COMPRESSION_THRESHOLD_BYTES = 1.5 * 1024 * 1024;
const NON_COMPRESSIBLE_TYPES = new Set(["image/gif", "image/svg+xml"]);
const COMPRESSIBLE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function replaceFileExtension(fileName: string, mimeType: string) {
  const extension =
    mimeType === "image/jpeg"
      ? "jpg"
      : mimeType === "image/webp"
        ? "webp"
        : mimeType === "image/png"
          ? "png"
          : "img";

  return fileName.replace(/\.[^/.]+$/, "") + `.${extension}`;
}

function loadImageElement(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Khong the doc anh truoc khi tai len."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

async function optimizeImageBeforeUpload(file: File) {
  if (typeof window === "undefined") return file;
  if (NON_COMPRESSIBLE_TYPES.has(file.type)) return file;
  if (!COMPRESSIBLE_TYPES.has(file.type)) return file;

  const image = await loadImageElement(file);
  const largestSide = Math.max(image.width, image.height);
  const shouldResize = largestSide > CLIENT_MAX_DIMENSION;
  const shouldCompress = file.size > CLIENT_COMPRESSION_THRESHOLD_BYTES;

  if (!shouldResize && !shouldCompress) {
    return file;
  }

  const scale = shouldResize ? CLIENT_MAX_DIMENSION / largestSide : 1;
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const targetMimeType =
    file.type === "image/png" || file.type === "image/webp"
      ? "image/webp"
      : "image/jpeg";
  const blob = await canvasToBlob(canvas, targetMimeType, 0.82);

  if (!blob) return file;
  if (!shouldResize && blob.size >= file.size * 0.95) return file;

  return new File([blob], replaceFileExtension(file.name, targetMimeType), {
    type: targetMimeType,
    lastModified: file.lastModified,
  });
}

export async function uploadImageFile(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadImageResponse> {
  const optimizedFile = await optimizeImageBeforeUpload(file);
  const formData = new FormData();
  formData.append("file", optimizedFile);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch("/api/uploads/cloudinary", {
    method: "POST",
    headers: await getAdminRequestHeaders(),
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Image upload failed.");
  }

  return result as UploadImageResponse;
}
