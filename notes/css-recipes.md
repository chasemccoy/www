---
title: CSS recipes
excerpt: Helpful techniques and snippets for working with my favorite language.
tags:
  - css
  - web dev
---

## Accordions

Use the `<details>` element

<book-mark url='https://css-tricks.com/quick-reminder-that-details-summary-is-the-easiest-way-ever-to-make-an-accordion/'></book-mark>

## Borders on images that match the background color

If your website has a white background and you're displaying images (such as user avatars), it's likely that some images might have a white or near-white background as well, which can make them hard to distinguish. Using a subtle inset box shadow will create a visible border for these cases that is not really noticeable otherwise like a normal border would be:

```css
box-shadow: inset 0 0 0 1px rgba(0 0 0 / 10%);
```

## Checkboxes

Instead of trying to get the styling right for IE 11, just add custom styles for browsers that support it well. You can do that by checking for support for the `-webkit-appearance` property:

```css
@supports (-webkit-appearance: none) {
  input[type='checkbox'] {
    /* style up your checkbox for browsers that can handle it */
  }
}
```

Of course, [this idea comes from the great Jen Simmons](https://twitter.com/jensimmons/status/1162106783642595328).

## Dropdown menus

Here's how to make them simply and accessibly, with no JavaScript, using the `:focus-within` pseudo selector:

<book-mark url='https://css-tricks.com/solved-with-css-dropdown-menus'></book-mark>

You can also use the `<details>` element:

<book-mark url='https://css-tricks.com/using-details-for-menus-and-dialogs-is-an-interesting-idea/'></book-mark>

Read more about this on [the `<details>` page](/notes/details-element).

## Grid

https://twitter.com/tjholowaychuk/status/1150741110886735872

<book-mark url='https://css-tricks.com/responsive-grid-magazine-layout-in-just-20-lines-of-css/'></book-mark>

<book-mark url='https://css-tricks.com/a-responsive-grid-layout-with-no-media-queries/'></book-mark>

---

<book-mark url='https://bricampgomez.com/blog/how-to-overlap-images-in-css'></book-mark>

## Horizontal scrolling sections

Thanks to [this tweet from Cassie Evans](https://twitter.com/cassiecodes/status/1094984738480316416).

```css
.container {
  width: 100vw;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.item {
  flex: 0 0 auto;
}
```

<book-mark url='https://www.chenhuijing.com/blog/flexbox-and-padding'></book-mark>

## Layout

<book-mark url='https://web.dev/one-line-layouts'></book-mark>

## Responsive tiled layout with CSS Grid and no media queries

This is great for making grid layouts of even-sized tiles where each tile never gets narrower than the specified min-width. But this _does not_ work if you want to have items of varying widths. Stolen from [this tweet by @thekitze](https://twitter.com/thekitze/status/1131821007629692929).

```js
const autoGrid = (minColumnWidth = 250, gap = 0) => css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${minColumnWidth}px, 1fr));
  grid-gap: ${gap};
`
```

Also [detailed here by Andy Bell](https://hankchizljaw.com/wrote/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid).

This does have a bug though if the user resizes their browser to be less than `minColumnWidth`. You can fix it using a breakpoint, or using the `min` CSS function [as detailed in this post by Evan Minto](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min), which is beginning to see good browser support.

I wrote a bit about this technique here:

<book-mark url='https://chasem.co/2020/04/gap-problem'></book-mark>

## Text dividers

https://twitter.com/CodyWebHouse/status/1233058458297143296

## Typography

<book-mark url="https://piccalil.li/tutorial/improve-the-readability-of-the-content-on-your-website/"></book-mark>

---

## Misc

<book-mark url="https://defensivecss.dev/tips"></book-mark>
