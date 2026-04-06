import type { Root, Element, ElementContent } from "hast";
import { visit, SKIP } from "unist-util-visit";
import { marked } from "marked";
import { fromHtml } from "hast-util-from-html";

function parseCaption(text: string): ElementContent[] {
  const html = marked.parseInline(text) as string;
  const tree = fromHtml(html, { fragment: true });
  return tree.children as ElementContent[];
}

export default function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img" || !node.properties?.title || !parent || index === undefined) {
        return;
      }

      const title = node.properties.title as string;
      delete node.properties.title;

      const figureChildren: ElementContent[] = [
        node,
        {
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: parseCaption(title),
        },
      ];

      if (parent.type === "element" && parent.tagName === "p" && parent.children.length === 1) {
        parent.tagName = "figure";
        parent.properties = {};
        parent.children = figureChildren;
      } else if (parent.type === "element") {
        parent.children[index] = {
          type: "element",
          tagName: "figure",
          properties: {},
          children: figureChildren,
        };
      }

      return SKIP;
    });
  };
}
