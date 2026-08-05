const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

function isExternalHref(value: string) {
  return /^(?:[a-z]+:)?\/\//i.test(value);
}

export function withBasePath(value: string) {
  if (!value || isExternalHref(value)) {
    return value;
  }

  if (
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("#") ||
    !value.startsWith("/")
  ) {
    return value;
  }

  if (!BASE_PATH || value === BASE_PATH || value.startsWith(`${BASE_PATH}/`)) {
    return value;
  }

  return `${BASE_PATH}${value}`;
}
