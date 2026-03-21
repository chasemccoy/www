import { visit } from 'unist-util-visit';
import { marked } from 'marked';
import { fromHtml } from 'hast-util-from-html';

function parseCaption(text) {
  const html = marked.parseInline(text);
  const tree = fromHtml(html, { fragment: true });
  return tree.children;
}

export default function rehypeFigure() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'img' ||
        !node.properties?.title ||
        !parent ||
        index === undefined
      ) {
        return;
      }

      const title = node.properties.title;
      delete node.properties.title;

      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          node,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: parseCaption(title),
          },
        ],
      };

      if (parent.tagName === 'p' && parent.children.length === 1) {
        parent.tagName = 'figure';
        parent.properties = {};
        parent.children = figure.children;
      } else {
        parent.children[index] = figure;
      }

      return visit.SKIP;
    });
  };
}
