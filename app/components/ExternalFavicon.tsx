"use client";

import { useMemo } from "react";

type ExternalFaviconProps = {
  href: string;
  title: string;
  className?: string;
  logoSrc?: string;
};

export function ExternalFavicon({ href, title, className, logoSrc }: ExternalFaviconProps) {
  const source = useMemo(() => {
    if (logoSrc) {
      return logoSrc;
    }
    try {
      const url = new URL(href);
      const host = url.hostname;

      return `/api/favicon?domain=${encodeURIComponent(host)}`;
    } catch {
      return "";
    }
  }, [href, logoSrc]);

  const fallbackLetter = title.slice(0, 1).toLocaleUpperCase("pl");

  if (!source) {
    return <span className={className}>{fallbackLetter}</span>;
  }

  return <img className={className} src={source} alt="" loading="lazy" />;
}
