Wherever I can I prefer to work in the browser vs. tools like Figma. As the web platform grows (we seem to be in a sort of golden age at the moment) it becomes easier and easier to do my job with only the raw materials of the web.

Recently I've been working on a project at the day job that requires the use of something akin to [layout grids in Figma](https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-grids-with-grids-columns-and-rows). I was curious how difficult it would be to recreate this on the web.

It took longer than I'd like to admit to figure out the math, but with a single `repeating-linear-gradient` we can overlay a representation of our grid onto the page. I whipped up a class for this with support for specifying your own number of columns and gutter width.

In the spirit of blogging the things I want to remember:

```css
.grid-overlay {
  --n: var(--columns, 12);
  --g: var(--gap, 16px);
  --c: var(--overlay-color, rgb(255 0 0 / 0.08));
  --column-width: calc(((100% + var(--g)) / var(--n)) - var(--g));

  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(
      to right,
      var(--c),
      var(--c) var(--column-width),
      transparent var(--column-width),
      transparent calc(var(--column-width) + var(--g))
    );
  }
}
```

Slap that class onto your grid container and presto, you've got some rails in place to keep everything lined up nice and neat.

![A screenshot of a webpage showing a 12 column grid.](grid.png 'repeating-linear-gradient invokes strange powers')

Once again I'm left marvelling at the humble power of CSS, and feeling grateful that we live during times when such an expressive yet simple visual language is spoken so ubiquitously.

[Check out the demo on Codepen](https://codepen.io/chasemccoy/pen/KKJNLBM).
