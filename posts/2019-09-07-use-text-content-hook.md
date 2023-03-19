---
title: Creating a useTextContent hook
excerpt: How to create a custom React hook that can read the text content of a tree of nodes.
---

In JavaScript, you can use [the `textContent` property of a node](https://developer.mozilla.org/en/docs/Web/API/Node/textContent) to get the text representation of the node and all of its descendent nodes. For instance, if your node looked like this:

```html
<p>This is some text with <a href="/">a link nested within it</a>.</p>
```

Then `node.textContent` would give you the string representation of all the text within: "This is some text with a link nested within it."

This property can be useful in a lot of scenarios, but it only works on DOM nodes, so you can't use it to get a the text content of a tree of React components. However, you _can_ create a custom hook that does just that:

```js
const useTextContent = (initial) => {
  const [textContent, setTextContent] = useState(initial)

  const ref = useCallback((node) => {
    if (node !== null) {
      setTextContent(node.textContent)
    }
  }, [])

  ref.current = textContent
  return ref
}
```

In the code above, we define what's called [a "callback ref"](https://reactjs.org/docs/hooks-faq.html?source=post_page-----eb7c15198780----------------------#how-can-i-measure-a-dom-node) in React. This function will get called whenever the ref gets attached to the node, or when the ref value changes.

If the node exists, we grab the `textContent` and set the `current` property of our ref to that value. Then, we return the ref for our consumers.

In the consuming code, the user calls the hook (with an optional initial value) and then attaches the resulting ref to whatever node they would like to read the text content of. The text content itself can be accessed through the `current` property of the ref:

```js
const textContainer = useTextContent(null)

return (
  <div>
    <SomeComponent ref={textContainer}This is some text with <a href='/'>a link nested within it</a>.</SomeComponent>
    {textContainer.current}
  </div>
)
```

<aside class='callout mb-16'>

You can see this hook in action in [this example I've created on CodePen](https://codepen.io/chasemccoy/pen/WNeXLQW).

</aside>

One of my favorite uses for this hook is to ensure that React components have accessible title attributes without requiring the consumer of the component to pass an explicit value for the title. For instance, imagine a Card component:

```js
<Card title={someReactNode} href='/details' />
```

that renders this structure:

```js
<div>
  <h3>{props.title}</h3>
  <a href={props.href}>View more</a>
</div>
```

The contents of the anchor tag here isn't enough to be fully accessible (view more of what?), but we could fix that by using the `textContent` of the card title:

```js
const textContainer = useTextContent(null)

return (
  <div>
    <h3 ref={textContainer}>{props.title}</h3>
    <a
      href={props.href}
      title={`View more info about ${textContainer.current}`}
    >
      View more
    </a>
  </div>
)
```

Now, users relying on a screen reader get an alternate title that describes _what_ they will be viewing more of if they choose to follow this link. And even better, the consumers of the component don't have to worry about passing a string specifically for this purpose.
