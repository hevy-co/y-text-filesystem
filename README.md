# Filesystem Persistence Adapter for [Yjs](https://github.com/y-js/yjs)

Persist Yjs text documents to the filesystem. Only text document types are supported.

## Installation
Install with `npm` or `yarn`.

```sh
yarn add y-filesystem
```

## Usage

Attach a `FilesystemPersistance` to a `Y.Doc` and it will be written to disk using the string passed into `getText()` as the filename.
For example:

```typescript
  let doc = new Y.Doc()
  let persist = new FilesystemPersistence(doc)
  let filename = 'src/somedoc.js'
  let txt = doc.getText(filename)
  txt.insert(0, 'text data from the user')
```

At this point, the file `src/somedoc.js` contains 'text data from the user'.