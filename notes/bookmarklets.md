---
title: Bookmarklets
tags:
  - js
  - web dev
---

Here's a cool little [web app that will take some JavaScript and turn it into a bookmarklet](http://bookmarklets.org/maker/) that you can drag into your bookmarks bar.

## Copy text to clipboard

This is a little function you can call to copy text to the clipboard from within a bookmarklet (this might not work in some browsers). Helpful for creaating bookmarklets that take your text selection, do something with it, and then copy the results back to the clipboard.

```js
function copy(text) {
  var node = document.createElement('textarea')
  var selection = document.getSelection()

  node.textContent = text
  document.body.appendChild(node)

  selection.removeAllRanges()
  node.select()
  document.execCommand('copy')

  selection.removeAllRanges()
  document.body.removeChild(node)
}
```

Hats off to Tom Critchlow for the idea of making bespoke bookmarklets to assist with blogging/note-taking:

<book-mark url='https://tomcritchlow.com/2019/06/19/bookmarklets-static-sites/'></book-mark>

Also to Max Böck for taking it a step further and having a bookmarklet pre-fill a custom form that submits to a serverless function:

<book-mark url='https://mxb.dev/blog/indieweb-link-sharing/'></book-mark>
