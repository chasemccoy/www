---
title: Svelte
excerpt: I spent a little bit of time diving into Svelte and walking through the official tutorial. Here are some things that stood out to me.
tags:
  - web dev
  - js
---

Here's how [Svelte][svelte] describes iteself:

> Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.

## What I like

I just love how... vanilla Svelte feels. Every `.svelte` file is a component. You can put JavaScript in a `<script>` tag. You can put CSS in a `<style>` tag. The rest is HTML + a templating syntax similiar to JSX.

Just look at it:

```html
<script>
  const name = 'world'
</script>

<style>
  p {
    color: red;
  }
</style>

<p>Hello {world}!</p>
```

Other great things:

- Styles are scoped to components by default.
- Often times, you set a prop with a variable that has the same name as the prop (i.e. `<img src={src}>`). In Svelte, you can short-hand it like this: `<img {src}>`. Love that.
- Notice in those examples above, I'm not including a trailing `/` slash for single HTML tags like React forces you to do (you still need them for custom components).

## What I'm not sure about

That's where the "plainness" ends though. Reactivity in Svelte is... weird. For instance, to make a value or statement "reactive" you have to use this syntax:

```html
<script>
  const foo = 1
  $: reactiveValue = foo * 2
</script>

<button on:click={() => count += 1}
```

Without that `$:`, the `reactiveValue` variable won't update whenever `foo` changes. If you wanna make multiple statements reactive, you can wrap them like this:

```html
$: { console.log(`the count is ${count}`); alert(`I SAID THE COUNT IS
${count}`); }
```

Other examples of weird (maybe not weird, but... unexpected?) syntax includes blocks within the HTML itself:

{% raw %}

```html
{#if user.loggedIn}
<button on:click="{toggle}">Log out</button>
{:else}
<button on:click="{toggle}">Log in</button>
{/if}
```

{% endraw %}

This bit from the Svelte docs makes it easier to understand:

> A `#` character always indicates a block opening tag. A `/` character always indicates a block closing tag. A `:` character, as in `{:else}`, indicates a _block continuation tag_.

## Asynchronous markup

This feature is really great:

{% raw %}

```html
{#await promise}
<p>...waiting</p>
{:then number}
<p>The number is {number}</p>
{:catch error}
<p style="color: red">{error.message}</p>
{/await}
```

{% endraw %}

## Event bindings

Instead of assigning values and updating state based on events, you can just do this:

```html
<script>
  let name = 'world'
</script>

<input bind:value="{name}" />

<h1>Hello {name}!</h1>
```

Which I love. React should add this.

[svelte]: https://svelte.dev

## Styles

Here's a good write-up on some of the features Svelte has around writing styles for component:

<book-mark url='https://css-tricks.com/what-i-like-about-writing-styles-with-svelte/'></book-mark>
