export type ImageFitMode = "fill" | "fit" | "limit";

type OptimizeImageOptions = {
  width?: number;
  height?: number;
  fit?: ImageFitMode;
  quality?: "auto" | number;
};

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const isCloudinaryUrl = (value: string) =>
  /^https?:\/\/res\.cloudinary\.com\//i.test(value) && value.includes(CLOUDINARY_UPLOAD_SEGMENT);

const isUnsplashUrl = (value: string) =>
  /^https?:\/\/images\.unsplash\.com\//i.test(value);

export function optimizeImageUrl(
  src: string | undefined | null,
  options: OptimizeImageOptions = {}
) {
  if (!src) return "";
  if (!isAbsoluteUrl(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  const {
    width,
    height,
    fit = "fill",
    quality = "auto",
  } = options;

  if (isCloudinaryUrl(src)) {
    const transforms = ["f_auto", `q_${quality}`, "dpr_auto"];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);

    if (width || height) {
      const cropMode = fit === "fit" ? "fit" : fit === "limit" ? "limit" : "fill";
      transforms.push(`c_${cropMode}`);
    }

    return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms.join(",")}/`);
  }

  if (isUnsplashUrl(src)) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", String(quality === "auto" ? 80 : quality));

    if (width) url.searchParams.set("w", String(width));
    if (height) url.searchParams.set("h", String(height));
    if (width || height) {
      url.searchParams.set("fit", fit === "fit" ? "max" : "crop");
    }

    return url.toString();
  }

  return src;
}
