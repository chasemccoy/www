---
title: The gap problem
excerpt: Exploring techniques and trade offs for creating reusable grid components using modern CSS best practices.
featured: true
---

Simple collections of items laid out in rows and columns is perhaps one of the most common UI patterns. Whether you're showing a literal grid of items, or building the layout of your site, grids are a fundamental element of design on the web (and you could say the same about print, too).

Given that this pattern is so common, you would expect that a good component library would have a component to encapsulate this behavior. Surprisingly though, I haven't seen many open source libraries that have flexible but primitive grid layout components. In fact, my team's component library, [Seeds](https://seeds.sproutsocial.com), doesn't have one either (yet). It turns out this might be the case because getting this pattern right in a way that's responsive and flexible is not always obvious to everyone.

Maybe that's because for a while there wasn't a really clean way to add gaps between CSS flexbox items. This will get better with [the gap property for flexbox](https://caniuse.com/#feat=flexbox-gap), but that's not ready for prime time yet in all browsers (you could [progressively enhance, though](https://medium.com/@schofeld/mind-the-flex-gap-c9cd1b4b35d8)). You can work around this however, and this tweet from Devon Govett shows how very succinctly:

https://twitter.com/devongovett/status/1244679626162450432

The basic idea here is that each child item in the grid has spacing around it, which creates the desired gap between items. A negative margin around the parent is applied to cancel out the unwanted spacing around the outer edges of the child items. Voila, you've got gaps between items with no errant spacing.

Combined with `flex-wrap`, your grid will effortlessly wrap into multiple rows, and the child items can be sized explicitly or implicitly. I prefer to use child items that are explicitly sized with percentages, which makes things nice and flexible. If you do this, you'll want to use padding instead of margin for the child items.

Some form of this technique is what I have landed on for grid components in my personal projects, and it works really well. It's also responsive as long as the child items are, which is nice.

However, it _is_ 2020 and we do have CSS grid in our tool belt now. [Andy Bell has an article explaining the technique for doing this with grid](https://hankchizljaw.com/wrote/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid). The secret sauce is in this line:

```css
grid-template-columns: repeat(
  auto-fill,
  minmax(var(--auto-grid-min-size), 1fr)
);
```

With this technique, instead of using breakpoints to specify the screen size where your items should stack, you specify the minimum size an element should be before it stacks. I like this because it encourages developers to think about responsive design in terms of _behaviors_ instead of screen sizes.

The code above will flow items into the grid with as many as it can fit on one row while keeping each item above the minimum width. Pretty cool.

It's important to note that this only really works if you want every item in the grid to be an equal width. I use a lot of grids with variable-width items, so I tend to prefer the flexbox technique. This use case is a great example of where flex still has its places, even though we have CSS grid—flexbox was made for flexible children, and CSS grid was made for well-defined grids.

I want to be clear there—CSS grid can totally handle grids whose children have varying widths, but you need to specify those widths up front, whereas I prefer to use percentage widths and have items flow to the next row automatically. Some are okay with this tradeoff, and have grid components that have you specify the `grid-template-columns` property for the row. [GitHub Primer, for instance](https://primer.style/components/Grid). If you want auto-flow rows in CSS Grid (which I do), all the columns have to be the same width.

There is one subtle bug with the implementation of the CSS grid technique above, though. If the minimum width of your items is larger than the viewport width, items will overflow and be clipped. You see this on smaller screen sizes particularly. Lucky for us, the fix is simple, we can simply change the variable that controls our minimum width on small screens using a media query:

```css
@media screen and (max-width: 30rem) {
  --auto-grid-min-size: 100%;
}
```

This ruins the clean, "0 breakpoints" aesthetic of the original solution, but it is just _one_ breakpoint and the logic is pretty self explanatory. The value you use for that breakpoint totally be a token from your design system, of course.

So which technique should you use when building a grid component? I would ask myself: are the child items of the grid all the same width?

- If the answer is yes, I'd recommend going for the CSS grid solution.
- If the answer is no, you're better of going with the flexbox method and having each child define its own width.

Hopefully once the `gap` property in flexbox is supported by most browsers we can simplify our implementation a bit. I'd definitely recommend wrapping this pattern up into a component so that consumers could upgrade down the road without a breaking change.

I'm also not the only person thinking about this right now. [Max Stoiber has been thinking it through](https://mxstbr.com/thoughts/margin) recently, and also has some interesting ideas about how to solve this with a reusable component.

Any way you go — it's so nice how much easier this has gotten over the years with tools like flexbox and CSS grid, and it will only get easier in the future with properties like `gap`.

**Update:** I discovered [this post by Evan Minto](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min) that describes how to use the CSS Grid technique above without using a breakpoint. His technique takes advantage of the `min` function in CSS, which has good but not universal browser support. Keep this in mind for future implementations.
