import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'

export const syntaxTheme = HighlightStyle.define([
  // ordered by lowest to highest precedence
  {
    tag: tags.atom,
    color: 'var(--atom, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.meta,
    color: 'var(--meta, hsl(48, 20%, 60%))',
  },
  // comment group
  {
    tag: tags.comment,
    color: 'var(--comment, hsl(48, 20%, 60%))',
    fontStyle: 'italic',
  },
  // name group
  {
    tag: tags.name,
    color: 'var(--name, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.labelName,
    color: 'var(--labelName, var(--name, hsl(48, 20%, 60%)))',
  },
  {
    tag: tags.propertyName,
    color: 'var(--propertyName, var(--name, hsl(48, 20%, 60%)))',
  },
  {
    tag: tags.definition(tags.propertyName),
    color:
      'var(--propertyName-definition, var(--propertyName, var(--name, #e06c75)))',
  },
  {
    tag: tags.variableName,
    color: 'var(--variableName, var(--name, #e06c75))',
  },
  {
    tag: tags.definition(tags.variableName),
    color:
      'var(--variableName-definition, var(--variableName, var(--name, hsl(48, 20%, 60%))))',
  },
  {
    tag: tags.local(tags.variableName),
    color:
      'var(--variableName-local, var(--variableName, var(--name, hsl(48, 20%, 60%))))',
  },
  {
    tag: tags.special(tags.variableName),
    color:
      'var(--variableName-special, var(--variableName, var(--name, inherit)))',
  },
  // headings
  {
    tag: tags.heading,
    fontWeight: 'bold',
  },
  {
    tag: tags.heading1,
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    color: 'var(--heading2, var(--color-caption))',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    fontWeight: 'bold',
  },
  // contextual tag types
  {
    tag: tags.keyword,
    color: 'var(--keyword, #c678dd)',
  },
  {
    tag: tags.number,
    color: 'var(--number, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.operator,
    color: 'var(--operator, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.punctuation,
    color: 'var(--punctuation, #36454f)',
  },
  {
    tag: tags.link,
    color: 'var(--link, var(--color-accent))',
  },
  {
    tag: tags.url,
    color: 'var(--url, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.processingInstruction,
    color: 'var(--processingInstruction, hsl(48, 20%, 60%))',
    fontWeight: 'normal',
  },
  {
    tag: tags.contentSeparator,
    color: 'var(--contentSeparator, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.angleBracket,
    color: 'var(--angleBracket, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.monospace,
    color: 'var(--monospace, var(--color-accent))',
    fontFamily: 'var(--font-code)',
    fontSize: '0.95em',
  },
  // string group
  {
    tag: tags.string,
    color: 'var(--string, hsl(48, 20%, 60%))',
  },
  {
    tag: tags.special(tags.string),
    color: 'var(--string-special, var(--string, inherit))',
  },
  // emphasis types
  {
    tag: tags.emphasis,
    color: 'var(--emphasis, inherit)',
    fontStyle: 'italic',
  },
  {
    tag: tags.strong,
    color: 'var(--strong, inherit)',
    fontWeight: 'bold',
  },
])
