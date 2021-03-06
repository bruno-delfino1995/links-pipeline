const R = require('ramda')

const playlists = () => {
  const lens = {
    id: R.lensPath(['snippet', 'resourceId', 'videoId']),
    title: R.lensPath(['snippet', 'title'])
  }

  const transform = R.compose(
    R.map(R.evolve({
      href: (id) => `https://www.youtube.com/watch?v=${id}`
    })),
    R.map(R.applySpec({
      kind: R.always('#video'),
      tags: R.always(['favorites']),
      href: R.view(lens.id),
      title: R.view(lens.title)
    })),
    R.prop('items')
  )
}

const liked = () => {
  const lens = {
    id: R.lensPath(['id']),
    title: R.lensPath(['snippet', 'title'])
  }

  const transform = R.compose(
    R.map(R.evolve({
      href: (id) => `https://www.youtube.com/watch?v=${id}`
    })),
    R.map(R.applySpec({
      kind: R.always('#video'),
      tags: R.always(['liked']),
      href: R.view(lens.id),
      title: R.view(lens.title)
    })),
    R.prop('items')
  )
}
