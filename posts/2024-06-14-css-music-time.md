---
title: A visual language for music and time
---

I've [remarked before](/2023/11/gradient-grid/#:~:text=Once%20again%20I%E2%80%99m%20left%20marveling%20at%20the%20humble%20power%20of%20CSS%2C%20and%20feeling%20grateful%20that%20we%20live%20during%20times%20when%20such%20an%20expressive%20yet%20simple%20visual%20language%20is%20spoken%20so%20ubiquitously.) on my gratefulness for CSS as the ubiquitous and expressive visual language of our times, a sort of design Esperanto (that is actually widely spoken).

One would struggle to find a more perfect example of this than [Scribe](https://labs.cruncher.ch/scribe), by [Stephen Band](https://stephen.band). Scribe is a custom element (`<scribe-music>`) which renders _responsive_ music notation in HTML and CSS grid.

Here's an example, rendered inline via Scribe:

<scribe-music type="sequence" clef="treble" meter="4/4">
  0 meter 4 1
  0 chord D maj 4
  0 note F#5 0.2 2
  1 note A4  0.2 1
  4 note D4  0.2 1
</scribe-music>

To really understand the magic happening here, you must read [Stephen's excellent blog post about how it all works](https://cruncher.ch/blog/printing-music-with-css-grid).

It's remarkable that this is possible using CSS, and even more remarkable that the language itself morphs to become a syntax not for describing elements on a web page, but to describe pitch over time. CSS as interface for the natural world.

Under the hood, Scribe uses markup like this to represent music in time:

```html
<div class="stave bar">
  <svg class="clef" data-pitch="B4">…</svg>
  <svg class="flat" data-beat="1" data-pitch="Bb4">…</svg>
  <svg class="head" data-beat="1" data-pitch="Bb4">…</svg>
  <svg class="head" data-beat="2" data-pitch="D4">…</svg>
  <svg class="head" data-beat="3" data-pitch="G5">…</svg>
  <svg class="rest" data-beat="4" data-pitch="B4">…</svg>
</div>
```

Elegant, useful, and thanks to the hard-won stability of the web platform: durable for generations to come.

One might wonder, what other natural or mathematical systems might we be able to represent in CSS? Another example that crossed my feeds recently is [time-based CSS animations by Yuan Chuan](https://yuanchuan.dev/time-based-css-animations).

Yuan creates a variable in CSS representing time, and uses keyframe animations to increment the value of the variable by 1 every millisecond. Suddenly CSS has a timer, something powerful for generative art and animation where time itself is used as an input variable.

Need to adjust the frame rate? Easy:

```css
/* 8 fps */
animation-timing-function: step(calc(86400000 / (1000 / 8)));
```

Yuan has some great examples of how this can be combined with functions in CSS like `min()`, `round()`, and newly added trigonometric functioned like `sin()`, `cos()`, etc. to create all sorts of useful effects. My favorite example is using all of this to create [a clock with a perfectly ticking second hand](https://yuanchuan.dev/time-based-css-animations#:~:text=How%20can%20we%20make%20a%20jumping%20motion%20for%20the%20second%20hand).

In terms of representing natural systems in CSS, this reminds me of how often I've wanted to be able to generate and use random numbers in CSS _at runtime_. To my delight, [it looks like that's in the works](https://drafts.csswg.org/css-values-5/#randomness).

<link rel="stylesheet" href="https://stephen.band/scribe/build/scribe-music/module.css" />
<script type="module" src="https://stephen.band/scribe/build/scribe-music/module.js"></script>
