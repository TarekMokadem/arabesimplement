import sanitizeHtmlLib from "sanitize-html";

/**
 * Sanitisation HTML côté serveur (boutique, admin) sans jsdom :
 * `isomorphic-dompurify` charge jsdom et casse le bundle Vercel (ERR_REQUIRE_ESM sur des sous-dépendances).
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "code",
  "pre",
  "span",
  "div",
];

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== "string") {
    return "";
  }
  try {
    return sanitizeHtmlLib(dirty, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        a: ["href", "target", "title", "class", "dir"],
        img: ["src", "alt", "title", "class", "dir"],
        "*": ["class", "dir"],
      },
      allowedSchemes: ["http", "https", "mailto", "tel"],
      allowedSchemesByTag: {
        img: ["http", "https"],
      },
      allowProtocolRelative: false,
    });
  } catch (e) {
    console.error("[sanitizeHtml]", e);
    return "";
  }
}
