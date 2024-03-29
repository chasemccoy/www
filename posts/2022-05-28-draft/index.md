---
title: Silos and pastures
excerpt: The web doesn’t exist on our client devices, it exists on the servers between us.
image: image.png
hidden: true
---

A few things have come across my desk recently that have prompted thoughts on the evolution of cloud computing and how the barriers between clients and servers are changing.

In the early days of the web, constant access to significant computing power was rare. Webpages existed across a few dozen servers maintained by universities, research groups, the government, and, as time went on, web hosting companies.

Nowadays, we have on-demand access to incredible computing power not only on our client devices, but also on cloud infrastructure that is available for increasingly cheap prices.

It raises two questions: first, if our client devices are so much more powerful now, why isn't it becoming more common to use them to host content on the web? And second, if cloud computing is such a commodity, why are more casual internet users not taking advantage of it as a resource?

[Robin Sloan had some thoughts](https://www.robinsloan.com/lab/bad-hosts/) recently that get at the answer to the first question. Turns out, it's just not easy to use a personal device as a server because of real technical reasons involving [NAT (Network Address Translation)](https://en.wikipedia.org/wiki/Network_address_translation).

Hosting your own internet service from home can be done, but as Robin notes it often requires leveraging some centralized third party to initiate the connection between clients.

> The workarounds are fine as far as they go, but NAT tricks can’t get us the one thing we really want, the foundational internet thing: the ability to simply listen for connections. Therefore, whole classes of possible services and relationships don’t exist; a whole alternate internet history.
>
> As home internet users, we can only speak and request, not listen and serve.
>
> <cite>[Bad hosts, or: how I learned to stop worrying and love the overlay network](https://www.robinsloan.com/lab/bad-hosts/)</cite>

Robin describes NAT as a "one-way mirror," and that's exactly what using the indie web today is often like.

[Robin has previously written about their love for cloud functions](https://www.robinsloan.com/lab/cloud-study/), and it makes sense why they feel so good—they can listen for connections on or behalf. But we don't own the computers those functions run on. What if we could own personal servers that not only hosts these functions but also let's us see them run, visually, in real time.

<hr class='break' />

Most recently I stumbled upon [a project by a student named Jeeyoon Hyun called "Personal Pet Pages"](https://itp.nyu.edu/thesis2022/?jeeyoon-hyun) which is a small, personal web server with a screen displaying what's going on inside the server.

> Ever since we’ve decided that servers are something heavy, enigmatic, gigantic black boxes belonging to corporations - not individuals - we have slowly lost agency towards our own small space on the Internet. But actually, servers are just computers. Just as your favorite cassette player or portable game console, they are something that you can possess and understand and enjoy.
>
> <cite>[Personal Pet Pages, ITP Thesis Archives 2022](https://itp.nyu.edu/thesis2022/?jeeyoon-hyun)</cite>

<hr class='break' />

An increasing amount of personal computing happens on servers nowadays, but we've made hardly any progress on making servers fit into our lives like other devices.

<hr class='break' />

As I was writing this the folks at The Iconfactory released [WorldWideWeb](https://blog.iconfactory.com/2022/06/worldwideweb-part-2/), an ultra-simple app for iOS and Mac that allows you to run a local web server by pointing it at any folder on your device.

> The Mac and Web have a long history together. From the very beginning, Mac OS X included the ability to run an Apache web server by clicking a Start button:
>
> ![Sharing preferences in Mac OS X 10.0](image.png 'Sharing preferences in Mac OS X 10.0. Courtesy 512pixels.net')

<hr class='break' />

Imagine if the most mundane tasks of your personal or professional life could be outsourced to a cloud function which is there, always waiting to spin into action. Now, imagine you could trust the server doing that work because it's one that you own and host yourself.

Having access to our own server would mean that we could finally host others in our digital space. As Robin said, we'd be able to listen and serve rather than just speaking and requesting.

Andy Matuschak asked a great question recently:

https://twitter.com/andy_matuschak/status/1518738033075388416

I'd like to think that the ability to easily host your own server for fun might be like inviting a friend over to your house in this digital "town" that Andy is imagining.

There are some new, experimental browsers ([looking at you, Arc](https://thebrowser.company)) cropping up that I think could have some exciting impact here. Imagine a browser that allows you to _serve_ as well as browse.

<hr class='break' />

Another one—[by way of Robin Sloan](https://www.robinsloan.com/notes/whomst-styles) as well—who has a thread running through his recent work about protocols and "ways of relating" across networks.

Whostyles is a protocol-like-convention where website authors can host some CSS which, when applied on some syndicated content somewhere else, replicates the visual appearance of the original site. It makes quotes from you on the web _look_ like they came from you.

You host your whostyle CSS file at a well known URL, and anyone can pull it in to use your voice on their site. It's like pasting up a hand-written note you received from someone on their own custom letterhead.

CSS as a protocol! Imagine a social media app tapping into this protocol and using it to render your messages in their UI.
