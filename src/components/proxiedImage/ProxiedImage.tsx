"use client";

import Image, { ImageProps } from "next/image";

export function ProxiedImage({ src, ...props }: ImageProps) {
  let finalSrc: string;

  if (typeof src === "string" && src.startsWith("http")) {
    finalSrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;
  } else {
    finalSrc = src as string;
  }

  return finalSrc ? <Image src={finalSrc} {...props} /> : null;
}
