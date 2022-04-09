const R = require('ramda')
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const parser = require('bookmark-parser')

const expand = ({ path, bookmark }) => {
  const { type, children, name } = bookmark

  if (type !== 'folder') {
    return Rx.EMPTY
  } else {
    return Rx.from(children)
      .pipe(Rxo.map(bk => ({ path: R.append(name, path), bookmark: bk })))
  }
}

const clean = R.evolve({
  bookmark: R.pick(['name', 'url', 'tags'])
})

const toLink = ({ path, bookmark }) => {
  const { name, tags, url } = bookmark

  return {
    title: name,
    tags: R.compose(
      R.concat(path),
      R.split(','),
      R.defaultTo('')
    )(tags),
    href: url
  }
}

const isBookmark = ({ bookmark }) => bookmark.type === 'bookmark'

const convert = bookmarks => {
  let [{ children }] = R.values(bookmarks)

  return Rx.from(children)
    .pipe(Rxo.map(bk => ({ path: [], bookmark: bk })))
    .pipe(Rxo.expand(expand))
    .pipe(Rxo.filter(isBookmark))
    .pipe(Rxo.map(clean))
    .pipe(Rxo.map(toLink))
}

const main = path => Rx.from(parser.readFromHTMLFile(path))
  .pipe(Rxo.mergeMap(convert))

module.exports = main
