import type { Root, Element, ElementContent } from "hast";
import { visit, SKIP } from "unist-util-visit";

const TWITTER_PATTERN =
  /(?:https?:\/\/)?(?:(?:www|mobile)\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,15})\/status\/(\d+)/;

function getTweetInfo(url: string): { user: string; id: string } | null {
  const match = url.match(TWITTER_PATTERN);
  if (match?.[1] && match?.[2]) return { user: match[1], id: match[2] };
  return null;
}

function isTwitterLink(node: ElementContent): node is Element {
  if (node.type !== "element" || node.tagName !== "a") return false;
  const href = node.properties?.href;
  if (typeof href !== "string") return false;
  return getTweetInfo(href) !== null;
}

function isParagraphWithOnlyTwitterLink(node: Element): boolean {
  if (node.tagName !== "p") return false;

  const meaningful = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );

  return meaningful.length === 1 && meaningful[0] !== undefined && isTwitterLink(meaningful[0]);
}

export default function rehypeTwitter() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (!isParagraphWithOnlyTwitterLink(node)) return;

      const link = node.children.find((child): child is Element => child.type === "element");
      if (!link) return;

      const href = link.properties.href as string;
      const tweetInfo = getTweetInfo(href);
      if (!tweetInfo) return;

      const tweetUrl = `https://twitter.com/${tweetInfo.user}/status/${tweetInfo.id}`;

      node.tagName = "blockquote";
      node.properties = { class: "twitter-tweet" };
      node.children = [
        {
          type: "element",
          tagName: "a",
          properties: { href: tweetUrl },
          children: [{ type: "text", value: tweetUrl }],
        },
      ];

      return SKIP;
    });
  };
}
