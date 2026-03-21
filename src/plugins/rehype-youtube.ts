import type { Root, Element, ElementContent } from "hast";
import { visit, SKIP } from "unist-util-visit";

const YOUTUBE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/,
  /(?:https?:\/\/)?youtu\.be\/([\w-]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]+)/,
];

function getVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function isYouTubeLink(node: ElementContent): node is Element {
  if (node.type !== "element" || node.tagName !== "a") return false;
  const href = node.properties?.href;
  if (typeof href !== "string") return false;
  return getVideoId(href) !== null;
}

function isParagraphWithOnlyYouTubeLink(node: Element): boolean {
  if (node.tagName !== "p") return false;

  const meaningful = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );

  return meaningful.length === 1 && meaningful[0] !== undefined && isYouTubeLink(meaningful[0]);
}

export default function rehypeYouTube() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (!isParagraphWithOnlyYouTubeLink(node)) return;

      const link = node.children.find((child): child is Element => child.type === "element");
      if (!link) return;

      const videoId = getVideoId(link.properties.href as string);

      node.tagName = "lite-youtube";
      node.properties = { videoid: videoId };
      node.children = [];

      return SKIP;
    });
  };
}
