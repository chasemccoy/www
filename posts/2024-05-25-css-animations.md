---
title: New magic for animations in CSS
---

There are two new features coming to CSS that will make it much easier to further avoid JavaScript when implementing animations:

1. Animating to and from `display: none;` for the sake of enter/exit animations.
2. Animating to and from the intrinsic size of an element (such as `height: auto;`).

Traditionally, animating something into or out of the screen (as opposed to just hiding it visually) required JavaScript to remove the element from the page after waiting for the animation or transition to complete. No longer!

When these new features land in browsers, you'll be able to animate to `display: none` like any other property using a keyframe animation:

```css
.item {
  animation: fade-out 0.5s forwards;
}

@keyframes fade-out {
  100% {
    opacity: 0;
    display: none;
  }
}
```

Neat!

You can also do the same thing with a CSS transition, but you'll need to set the new [`transition-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) property to `allow-discrete` for that to work. I can see something like `* {transition-behavior: allow-discrete}` becoming a part of my CSS reset in the future to enable this behavior by default.

But what about the opposite case? You have an element that's currently not displayed and you want to animate it as it appears. Again, we typically use JavaScript for this today to ensure the initial styles are set properly and our element doesn't display visually on the page before it has animated. 

Now, we can specify the starting style like this:

```css
.item {
	@starting-style {
    opacity: 0;
	}
	
	opacity: 1;
  transition: opacity 0.5s;
}
```

Elegant and useful. If you want to learn more about these new powers, I recommend checking out [this post on the Chrome for Developers blog](https://developer.chrome.com/blog/entry-exit-animations).

The second new feature coming to CSS is the ability to animate to and from an element's intrinsic size. The most common use case for this is collapsible areas: we want them to be `height: 0px` when closed, and when opened their height should be automatic based on the contents. 

Because CSS has historically not allowed for animating to `height: auto;`, we've had to use JavaScript to measure the height of the contents and animate to that pixel value. 

When this feature lands in browsers, we'll instead be able achieve this like so:

```css
.item { 
  height: 0; 
}

.item.open { 
  height: calc-size(auto);
}
``` 

The magic comes from the `calc-size` function, which is a curious API choice—why not just use the existing `calc()` function? [Here's a comment on the CSS working group's draft for this feature that explains why](https://github.com/w3c/csswg-drafts/issues/626#issuecomment-1869828293).

---

These features are just a few of the many ways that CSS is growing and becoming more powerful and expressive. To learn about all of the other great new things coming, check out [this excellent video by Una Kravets from Google I/O](https://www.youtube.com/watch?v=_-6LgEjEyzE). 

Una says that we're in the golden era for web UI, and I couldn't agree more.