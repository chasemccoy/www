---
title: The command line
excerpt: Useful snippets for working in your terminal.
---

## Get the clipboard contents as HTML

<book-mark url='https://stackoverflow.com/questions/2545289/getting-rtf-data-out-of-mac-os-x-pasteboard-clipboard'></book-mark>

```shell
osascript -e 'try' -e 'the clipboard as "HTML"' -e 'end try'|perl -ne 'print chr foreach unpack("C*",pack("H*",substr($_,11,-3)))'
```

## Convert HTML to Markdown with pandoc

```shell
pandoc --from=html-native_divs-native_spans --to=gfm
```

## Get a list of git commits from every repo over the last 7 days

```shell
find ~/Repositories -name .git -maxdepth 2 -execdir git log --author="Chase McCoy" --format="- %s" --since=-7days --reverse --no-merges --all \; | pbcopy
```
