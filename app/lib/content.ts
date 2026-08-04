import rawContent from "../data/content.json";

export type ContentLink = {
  href: string;
  label: string;
  document: boolean;
};

export type KnowledgePage = {
  id: number;
  slug: string;
  title: string;
  section: string;
  excerpt: string;
  paragraphs: string[];
  links: ContentLink[];
  source: string;
  images: string[];
};

export type NewsPost = {
  id: number;
  slug: string;
  title: string;
  date: string;
  year: number;
  excerpt: string;
  paragraphs: string[];
  links: ContentLink[];
  categories: string[];
  image: string | null;
  source: string;
};

type ContentDatabase = {
  generatedAt: string;
  source: string;
  logo: string;
  pages: KnowledgePage[];
  posts: NewsPost[];
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
  }>;
};

export const content = rawContent as ContentDatabase;

function normalizePreviewText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/([a-ząćęłńóśźż0-9])([A-ZĄĆĘŁŃÓŚŹŻ])/g, "$1 $2")
    .replace(/([.!?])([A-ZĄĆĘŁŃÓŚŹŻ])/g, "$1 $2")
    .replace(/([A-ZĄĆĘŁŃÓŚŹŻ]{2,})([a-ząćęłńóśźż]{2,})/g, "$1 $2")
    .trim();
}

const navigationMarkers = [
  "O KRDIG",
  "O NAS",
  "STATUT",
  "ZARZĄD I RADA IZBY",
  "KOMISJE",
  "CZŁONKOSTWO",
  "WYDARZENIA",
  "AKTUALNOŚCI",
  "KONTAKT",
  "POLITYKA PRYWATNOŚCI",
  "POLITYKA COOKIES",
  "TA STRONA KORZYSTA Z CIASTECZEK",
];

function normalizeLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasNavigationLeak(paragraphs: string[]) {
  const firstParagraphs = paragraphs.slice(0, 80).map((line) =>
    normalizeLine(line).toLocaleUpperCase("pl"),
  );

  let markerHits = 0;
  for (const line of firstParagraphs) {
    for (const marker of navigationMarkers) {
      if (line.includes(marker)) {
        markerHits += 1;
        break;
      }
    }
  }

  return markerHits >= 8;
}

function hasArchiveLeak(links: ContentLink[]) {
  const readMoreCount = links.filter((link) =>
    /czytaj\s+dalej/i.test(link.label),
  ).length;
  return readMoreCount >= 25;
}

function sanitizeNewsPost(post: NewsPost): NewsPost {
  const normalizedParagraphs = post.paragraphs
    .map(normalizeLine)
    .filter(Boolean);

  const looksCorrupted =
    normalizedParagraphs.length > 220 ||
    post.links.length > 350 ||
    hasNavigationLeak(normalizedParagraphs) ||
    hasArchiveLeak(post.links);

  if (!looksCorrupted) {
    return post;
  }

  return {
    ...post,
    paragraphs: [
      "Treść tej aktualności została automatycznie oczyszczona, ponieważ wykryto uszkodzony zrzut z elementami nawigacji lub archiwum.",
      "Skorzystaj z odnośnika do oryginalnego materiału źródłowego, aby zobaczyć pełną i bieżącą treść.",
    ],
    links: [],
  };
}

export const knowledgePages = content.pages.map((page) => ({
  ...page,
  title:
    page.slug === "czlonkowie"
      ? page.title.replace(/KRDIG/g, "KRD-IG")
      : page.title,
  excerpt: normalizePreviewText(page.excerpt),
}));

export const newsPosts = content.posts.map((post) => ({
  ...sanitizeNewsPost(post),
  excerpt: normalizePreviewText(post.excerpt),
}));

export function isTenderPost(post: NewsPost) {
  return (
    post.categories.includes("Zapytania ofertowe") ||
    post.title.toLocaleUpperCase("pl").startsWith("WYBÓR WYKONAWCY")
  );
}

export function tenderPosts() {
  return newsPosts.filter(isTenderPost);
}

export function pageBySlug(slug: string) {
  return knowledgePages.find((page) => page.slug === slug);
}

export function postBySlug(slug: string) {
  return newsPosts.find((post) => post.slug === slug);
}

export function pagesFor(slugs: string[]) {
  const position = new Map(slugs.map((slug, index) => [slug, index]));
  return knowledgePages
    .filter((page) => position.has(page.slug))
    .sort(
      (left, right) =>
        (position.get(left.slug) ?? 0) - (position.get(right.slug) ?? 0),
    );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const primaryNavigation = [
  { href: "/o-izbie", label: "O IZBIE" },
  { href: "/aktualnosci", label: "AKTUALNOŚCI" },
  { href: "/rynek", label: "RYNEK I HANDEL" },
  { href: "/hodowla", label: "HODOWLA I OCENA" },
  { href: "/zrownowazony-rozwoj", label: "JAKOŚĆ I ROZWÓJ" },
  { href: "/baza-wiedzy", label: "BAZA WIEDZY" },
  { href: "/zapytania-ofertowe", label: "ZAPYTANIA OFERTOWE" },
];
