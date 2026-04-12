import React from "react";
import { optimizeImageUrl, type ImageFitMode } from "@/utils/image";

type SmartImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  widthHint?: number;
  heightHint?: number;
  fit?: ImageFitMode;
  quality?: "auto" | number;
  priority?: boolean;
};

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  widthHint,
  heightHint,
  fit = "fill",
  quality = "auto",
  priority = false,
  loading,
  decoding,
  fetchPriority,
  ...props
}) => {
  const optimizedSrc = optimizeImageUrl(src, {
    width: widthHint,
    height: heightHint,
    fit,
    quality,
  });

  return (
    <img
      {...props}
      src={optimizedSrc}
      alt={alt}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding={decoding ?? "async"}
      fetchPriority={priority ? "high" : fetchPriority ?? "auto"}
    />
  );
};

export default SmartImage;
