---
title: Minimum viable dark mode
date: 2019-09-23
excerpt: How to create a quick and dirty dark mode for simple apps and websites using pure CSS.
---

When I recently redesigned this site, I removed the light/dark mode toggle that I had before. It was difficult to iterate on the new design quickly while supporting both light/dark mode and thinking about both when adding new features to my site was annoying.

And then I saw [this tweet from Daniel Eden](https://mobile.twitter.com/_dte/status/1166378957081436170):

https://twitter.com/_dte/status/1166378957081436170

Cool! I added this bit of CSS to my site:

```css
@media (prefers-color-scheme: dark) {
  filter: invert(90%) hue-rotate(25deg);
}
```

I don't care for "pure black" dark modes, so instead of inverting by 100% (like Daniel suggested), I went with 90% to make the dark colors a bit softer.

Daniel's tweet suggests rotating the hue by `180deg`, but I wanted to change my colors palette entirely in dark mode, from white and yellow to gray and purple. So I played with the value in the browser until I found a value for `hue-rotate` that I liked.

And, of course, I applied some styles to remove the inversion on things that shouldn't be inverted (like images):

```css
@media (prefers-color-scheme: dark) {
  img,
  video,
  iframe {
    filter: invert(100%) hue-rotate(-25deg);
  }
}
```

All in all, I really like this solution! It's not perfect, but I never have to think about supporting both modes when I built something new. I've also noticed that having a filter on the whole page isn't great for performance in some browsers, but I'm semi-okay with that since this is just a personal site.

Probably don't use this for an app (or anything that someone pays for or relies on).
