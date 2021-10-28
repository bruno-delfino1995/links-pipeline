# Links Pipeline

This project consists of transformers powered by RxJS that act upon an incoming stream of links. I use this to group all links hoarded over many platforms into a single JSONL file. The objective is to gather all of my past "searching knowledge" into a search engine to have "your google."

It starts from YARGS, with a command suited for the input type, which feeds its args into one of the many extractors. This extractor creates an observable that'll emit each incoming link to several transformers to shape the data. Once the data is ready, it's sent to a loader to write it to the given target.

In terms of loaders, we have the `toStdio` loader, which creates a JSONL stream on stdio. The plan is to make loaders that will: create bookmarks files, feed link management platforms (linkding), feed search engines (meilisearch).

# License

MIT © Bruno Delfino
