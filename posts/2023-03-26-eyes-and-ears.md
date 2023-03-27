---
title: The eyes and ears of AI
---

It's hard to keep up with the progress of AI. It seems as though every week there's a new breakthrough or advancement that seemingly changes the game. Each step forward brings both a sense of wonder and a feeling of dread. 

This past week, OpenAI [introduced ChatGPT plugins](https://openai.com/blog/chatgpt-plugins) which "help ChatGPT access up-to-date information, run computations, or use third-party services." 

> Though not a perfect analogy, plugins can be “eyes and ears” for language models, giving them access to information that is too recent, too personal, or too specific to be included in the training data.
>
> <cite>[OpenAI](https://openai.com/blog/chatgpt-plugins#code-interpreter:~:text=Though%20not%20a%20perfect%20analogy%2C%20plugins%20can%20be%20%E2%80%9Ceyes%20and%20ears%E2%80%9D%20for%20language%20models%2C%20giving%20them%20access%20to%20information%20that%20is%20too%20recent%2C%20too%20personal%2C%20or%20too%20specific%20to%20be%20included%20in%20the%20training%20data.)</cite>

OpenAI themselves have published two plugins:

- A [web browser plugin](https://openai.com/blog/chatgpt-plugins#browsing) which allows the AI gather information from the internet that was not originally part of its training corpus by searching the web, clicking on links, and reading the contents of webpages. 
- A [code interpreter plugin](https://openai.com/blog/chatgpt-plugins#code-interpreter) which gives ChatGPT access to a sandboxed Python environment that can execute code as well as handle file uploads and downloads. 

Both of these plugins are pretty astonishing in their own right, and unlock even more potential for AI to be a helpful tool (or a dangerous actor).

But what caught my eye the most from OpenAI's announcement is the ability for developers to [create their own ChatGPT plugins](https://platform.openai.com/docs/plugins/introduction) which interact with your own APIs, and more specifically the way in which they're created.

Here's how you create a third party plugin:

- You create a JSON manifest on your website at `/.well-known/ai-plugin.json` which includes some basic information about your plugin including a natural language description of how it works. As an example, here's [the manifest for the Wolfram Alpha plugin](https://www.wolframalpha.com/.well-known/ai-plugin.json). 
- You host an [OpenAPI](https://www.openapis.org) specification for your API and point to it in your plugin manifest. 

That's it! ChatGPT uses your natural language description and the OpenAPI spec to understand how to use your API to perform tasks and answer questions on behalf of a user. The AI figures out how to handle auth, chain subsequent calls, process the resulting data, and format it for display in a human-friendly way. 

And just like that, APIs are accessible to anyone with access to an AI.

Importantly, that AI is not only regurgitating information based on a static set of training data, but is an actor in and of itself. It's browsing the web, executing code, and making API requests on behalf of users (hopefully).

The implications of this are hard to fathom, and much will be discussed, prototyped, and explored in the coming months as people get early access to the plugin feature. But what excites me the most about this model is how easily it will allow for [digital bricoleurs](https://tomcritchlow.com/2023/01/20/digital-bricolage) to plug artificial intelligence into their homemade tools for personal use. 

Have a simple API? You now have the ability to engage with it conversationally. The hardest part is generating an OpenAPI spec (which is not very hard to do, it's just a `.yaml` file describing your API), and you can even get ChatGPT to generate that bit for you. Here's an example of someone successfully [generating a spec for the Twilio API using ChatGPT](https://twitter.com/danielgross/status/1639040289816866818). 

It seems to me that this will greatly incentivize companies and products to create interfaces and APIs that are AI-friendly. Consumers will grow to expect AI tools to be able to interface with the other digital products and services they use in the same way that early iPhone users expected their favorite websites to have apps in the App Store. 

There are certainly many negative and hard-to-predict consequences of opening up APIs to AI actors, but I am excited about the positives that might come from it, such as software products becoming more malleable via end-user programming and automation.

Don't want to futz around with complex video editing software? Just [ask your AI to extract the first 5 seconds](https://twitter.com/gdb/status/1638971232443076609) of an MP4 and download the result with a single click. This type of abstraction of code, software, and interface will become ubiquitous. 

Of course, I don't think graphical interfaces are in trouble just yet. Geoffrey Litt points out that [trimming video is actually much more intuitive via direct manipulation than via chat](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html#chat-is-an-essentially-limited-interaction). 

But when you consider that ChatGPT can write code to build GUIs and can even interact with them programmatically on a user's behalf, the implications become clear. Everyone will benefit in some way from their own personal interface assistant.

I wonder also how many future products will be APIs only with the expectation that AIs are how users will interact with them?

Simon Willison wrote [a great blog post demonstrating this](https://simonwillison.net/2023/Mar/24/datasette-chatgpt-plugin/). He wired up a ChatGPT plugin to query data via SQL, and the results, though technically returned as JSON, get displayed in a rich format much more friendly for human consumption.

I wonder if future "social networks" might operate simply as a backend with a set of exposed APIs. Instead of checking an app you might simply ask your AI "what's up with my friend Leslie?" Or you could instruct your AI to put together a GUI for a social app that's exactly to your specification. 

This will certainly lead to entirely new [ways of relating to one another online](https://chasem.co/2022/06/ways-of-relating).

It would be interesting to try this today with good old RSS, which could be easily wired up as a ChatGPT plugin via a JSON feed. Alas, I don't yet have access to the plugins feature, but I've joined [the waitlist](https://openai.com/waitlist/plugins).

I'm both excited and nervous to see what happens when we combine AI with a medium like the web.