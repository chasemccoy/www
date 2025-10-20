---
title: Bookshelf
excerpt: A few excellent reads that have shaped who I am, how I work, or how I think about the world around me.
layout: 'layouts/page.jsx'
templateClass: bookshelf
templateEngineOverride: njk
hidden: true
---

<article class='prose'>
  <h1>Starter kit</h1>
  <p class='lead color-caption'>{{excerpt}}</p>

  <h2>Books</h2>
  {%- include "books.njk" -%}

  <h2>Articles</h2>

  <h2>Movies</h2>

  <h2>Television</h2>
</article>
