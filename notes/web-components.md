---
title: Web components
excerpt: New APIs allow us to build web experiences using a component model, but without the cost of a framework.
tags:
  - html
  - js
  - web dev
---

## Shadow DOM

For the longest time, if you wanted to use the shadow DOM (and thus scoped CSS styles) you needed JavaScript:

```js
const host = document.getElementById('host')
const opts = { mode: 'open' }
const shadowRoot = host.attachShadow(opts)
const html = '<h1>Hello Shadow DOM</h1>'
shadowRoot.innerHTML = html
```

But with [declarative shadow DOM](https://developer.chrome.com/en/blog/new-in-chrome-90/#declarative), you can do all of this without JS:

```html
<host-element>
  <template shadowroot="open">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

<book-mark url='https://web.dev/declarative-shadow-dom/'></book-mark>

## Resources

<book-mark url='https://css-tricks.com/web-components-are-easier-than-you-think/'></book-mark>

https://twitter.com/matthewcp/status/1085595926100692994

<book-mark url='https://gist.github.com/matthewp/7aad10707e460ddf9d3cfe3f7f71241d'></book-mark>

<book-mark url='https://lit-element.polymer-project.org'></book-mark>

<book-mark url='https://lit-html.polymer-project.org'></book-mark>

<book-mark url='https://github.com/matthewp/haunted'></book-mark>

<book-mark url='https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/'></book-mark>

<book-mark url='https://css-tricks.com/web-component-for-a-code-block/'></book-mark>
