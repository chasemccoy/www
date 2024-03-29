---
title: Gatsby schema customization is pretty cool
---

Today on their blog, Gatsby announced the release of [new schema customization APIs in version 2.2.0](https://www.gatsbyjs.org/blog/2019-03-18-releasing-new-schema-customization/).

I've been using these new APIs in [the alpha release](https://www.gatsbyjs.org/blog/2019-03-04-new-schema-customization/) on my site for a bit now, and I've come to realize how great they are thanks to [an example by Jason Lengstorf](https://github.com/jlengstorf/theme-blog-schema). He uses the new APIs to create a generic `blog` schema, and then creates nodes based on data _from multiple sources_.

This is brilliant because it means your UI can be completely agnostic of where your data is coming from. Jason's example sources data from multiple file types locally and creates a set of generic nodes that represent a blog post. The query to get the data you need to populate your UI is very clear:

```graphql
allBlog(sort: { fields: date, order: DESC }) {
  nodes {
    title
    date
    content
  }
}
```

I adapted my site to do the same things, but in my case I am sourcing most of my data from WordPress, and also pulling in MDX files locally. This solves a big issue I had been facing — how could I merge and sort data from many sources by a common factor (like a date field) in a way that is abstracted from the UI code of my site. This totally solves that.

What's great is that, as long as my schema doesn't change drastically, I can feed in as many data sources as I want in the future and I will never have to change any of my queries or UI to support the new data sources. That's a huge win especially when you consider [the upcoming themes feature](https://www.gatsbyjs.org/blog/2018-11-11-introducing-gatsby-themes/), which allows us to abstract away parts of our sites (configurations, data sources, UI, etc) entirely. These new APIs paired with themes is next level.

Congrats and terrific work to all the contributors over at Gatsby that made this possible. It's incredible how easy it's becoming to build great developer experiences on top of Gatsby.
