import { NextRequest } from "next/server";

const oneDay = 60 * 60 * 24;

function looksLikeImage(data: ArrayBuffer, contentType: string) {
  const bytes = new Uint8Array(data);
  if (bytes.byteLength < 4) {
    return false;
  }

  const isPng =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  const isIco = bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00;
  const isWebp =
    bytes.byteLength > 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  if (isPng || isJpeg || isGif || isIco || isWebp) {
    return true;
  }

  if (contentType.includes("svg")) {
    const text = new TextDecoder().decode(bytes.slice(0, Math.min(bytes.byteLength, 240))).toLowerCase();
    return text.includes("<svg");
  }

  return false;
}

function sanitizeDomain(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9.-]/g, "").replace(/^\.+|\.+$/g, "");
}

function fallbackSvg(domain: string) {
  const letter = (domain[0] || "L").toUpperCase();
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Fallback icon">
  <rect width="128" height="128" rx="24" fill="#f2efe6"/>
  <circle cx="64" cy="64" r="40" fill="#ffffff" stroke="#d8d2c1" stroke-width="4"/>
  <text x="64" y="74" text-anchor="middle" font-family="Aptos, Segoe UI, Arial, sans-serif" font-size="38" font-weight="700" fill="#20201d">${letter}</text>
</svg>`.trim();
}

async function tryFetch(url: string) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; KRD-IG-FaviconProxy/1.0)",
      accept: "image/*,*/*;q=0.8",
    },
    next: { revalidate: oneDay },
  });

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const normalizedType = contentType.toLowerCase();
  const isImageType =
    normalizedType.startsWith("image/") ||
    normalizedType.includes("application/octet-stream");

  if (!isImageType) {
    return null;
  }

  const data = await response.arrayBuffer();

  if (!data || data.byteLength === 0) {
    return null;
  }

  if (!looksLikeImage(data, normalizedType)) {
    return null;
  }

  return { data, contentType };
}

export async function GET(request: NextRequest) {
  const domainRaw = request.nextUrl.searchParams.get("domain") || "";
  const domain = sanitizeDomain(domainRaw);

  if (!domain) {
    return new Response(fallbackSvg("link"), {
      status: 200,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": `public, max-age=${oneDay}`,
      },
    });
  }

  const noWww = domain.replace(/^www\./, "");
  const candidates = [
    `https://${domain}/favicon.ico`,
    `https://${noWww}/favicon.ico`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://icons.duckduckgo.com/ip3/${noWww}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];

  for (const candidate of candidates) {
    try {
      const result = await tryFetch(candidate);
      if (!result) {
        continue;
      }

      return new Response(result.data, {
        status: 200,
        headers: {
          "content-type": result.contentType,
          "cache-control": `public, max-age=${oneDay}`,
        },
      });
    } catch {
      // Try next candidate.
    }
  }

  return new Response(fallbackSvg(domain), {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": `public, max-age=${oneDay}`,
    },
  });
}
