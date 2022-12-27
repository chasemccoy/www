---
title: The details element
tags:
  - html
  - web dev
---

Details can be used to build accessible dialogs and dropdown menus. In this example I am using the custom elements that Github built; you can find them on Github at [`details-dialog-element`](https://github.com/github/details-dialog-element) and [`details-menu-element`](https://github.com/github/details-menu-element).

**Related reading:**

<book-mark url='https://github.com/muan/details-on-details'></book-mark>
<book-mark url='https://css-tricks.com/using-details-for-menus-and-dialogs-is-an-interesting-idea/'></book-mark>
<book-mark url='https://css-tricks.com/quick-reminder-that-details-summary-is-the-easiest-way-ever-to-make-an-accordion/'></book-mark>

## Details menu

```js
<details class='details-reset'>
  <summary>Robots</summary>
  <details-menu>
    <ul>
      <li>
        <button type='button' role='menuitem'>
          Hubot
        </button>
      </li>
      <li>
        <button type='button' role='menuitem'>
          Bender
        </button>
      </li>
      <li>
        <button type='button' role='menuitem'>
          BB-8
        </button>
      </li>
    </ul>
  </details-menu>
</details>
```

```js
<details class='details-reset'>
  <summary>
    Preferred robot: <span data-menu-button>None</span>
  </summary>
  <details-menu>
    <ul>
      <li>
        <button type='button' role='menuitem' data-menu-button-text>
          Hubot
        </button>
      </li>
      <li>
        <button type='button' role='menuitem' data-menu-button-text>
          Bender
        </button>
      </li>
      <li>
        <button type='button' role='menuitem' data-menu-button-text>
          BB-8
        </button>
      </li>
    </ul>
  </details-menu>
</details>
```

## Details dialog

Here's the CSS to make this work:

```css
.details-reset {
  & > summary {
    list-style: none;
  }

  & > summary::before {
    display: none;
  }

  & > summary::-webkit-details-marker {
    display: none;
  }
}

.details-with-dialog[open] > summary {
  cursor: default;
}

.details-with-dialog[open] > summary:before {
  content: ' ';
  background: rgba(0, 0, 0, 0.3);
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
}

details-dialog {
  position: fixed;
  margin: 10vh auto;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  max-height: 80vh;
  width: 448px;
}
```

```js
<details class='details-reset details-with-dialog'>
  <summary>Open dialog</summary>
  <details-dialog>
    <p>But you can click anywhere to dismiss without JS.</p>
    <button data-close-dialog type='button' autofocus>
      Close button only works with JS
    </button>
  </details-dialog>
</details>
```
