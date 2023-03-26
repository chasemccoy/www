---
title: AI bricolage
hidden: true
---

It's hard to keep up with the progress of AI. It seems as though every week there's a new breakthrough or advancement that seemingly changes the game. Each step forward brings both a sense of wonder and a feeling of dread. 

This past week, OpenAI [introduced ChatGPT plugins](https://openai.com/blog/chatgpt-plugins) which "help ChatGPT access up-to-date information, run computations, or use third-party services." 

OpenAI themselves have published two plugins:

- A [web browser plugin](https://openai.com/blog/chatgpt-plugins#browsing) which allows the AI gather information from the internet that was not originally part of its training corpus by searching the web, clicking on links, and reading the contents of webpages. 
- A [code interpreter plugin](https://openai.com/blog/chatgpt-plugins#code-interpreter) which gives ChatGPT access to a sandboxed Python environment that can execute code as well as handle file uploads and downloads. 

Both of these plugins are pretty astonishing in their own right, and unlock even more potential for AI to be a helpful tool (or a dangerous actor).

But what caught my eye the most from OpenAI's announcement is the ability for developers to create their own ChatGPT plugins which interact with your own APIs, and more specifically the way in which they're created.

Here's how you create a third party plugin:

- You create a JSON manifest on your website at `/.well-known/ai-plugin.json` which includes some basic information about your plugin including a natural language description of how it works. As an example, here's [the manifest for the Wolfram Alpha plugin](https://www.wolframalpha.com/.well-known/ai-plugin.json). 
- You host an [OpenAPI](https://www.openapis.org) specification for your API and point to it in your plugin manifest. 

And that's it! ChatGPT uses your natural language description and the OpenAPI spec to understand how to use your API to perform tasks and answer questions on behalf of a user. The AI figures out how to handle auth, chain subsequent calls, process the resulting data, and format it for display in a human-friendly way. 

All of a sudden AI is not only regurgitating information based on a static set of training data, but is an actor in and of itself. It's browsing the web, executing code, and making API requests on behalf of users (hopefully).

The implications of this are hard to fathom, and much will be discussed, prototyped, and explored in the coming months as people get early access to the plugin system. But what excites me the most about this model is how easily it will allow for [digital bricoleurs](https://tomcritchlow.com/2023/01/20/digital-bricolage) to plug artificial intelligence into their homemade tools for personal use. 

Have a simple API? You now have the ability to engage with it conversationally. The hardest part is generating an OpenAPI spec (which is not very hard to do, it's just a `yaml` file describing your API), and you can even get ChatGPT to generate that bit for you. Here's an example of someone successfully [generating a spec for the Twilio API using ChatGPT](https://twitter.com/danielgross/status/1639040289816866818). 



