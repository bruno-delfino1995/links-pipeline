const R = require('ramda')
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const qs = require('query-string')
const Promise = require('bluebird')
const axios = require('axios')

const afterLens = R.lensPath(['data', 'after'])
const elementsLens = R.lensPath(['data', 'children'])

const convert = R.cond([
  [R.propEq('kind', 't3'), post => ({
    title: post.data.title,
    tags: [post.data.subreddit],
    href: `https://reddit.com${post.data.permalink}`
  })],
  [R.propEq('kind', 't1'), comment => ({
    title: comment.data.body,
    tags: [comment.data.subreddit],
    href: `https://reddit.com${comment.data.permalink}`
  })],
  [R.T, R.identity]
])

const fetch = ({ user, noAfter }) => (previous = null) => {
  const after = R.view(afterLens, previous)

  if (R.isNil(after) && !R.isNil(previous)) {
    return Rx.EMPTY
  }

  const promise = axios
    .get(`https://oauth.reddit.com/user/${user.username}/saved`, {
      params: {
        // noAfter prevents us from stabbing ourselfs in the back because of
        // backpressure, which prevents us from using a valid `after` because it was
        // deleted when unsaving
        after: noAfter ? null : after
      },
      headers: {
        Authorization: `bearer ${user.token}`,
        'User-Agent': user.username
      }
    })
    .then(R.prop('data'))

  return Rx.from(promise)
}

const unsave = user => el => {
  const id = el.data.name

  return axios
    .post('https://oauth.reddit.com/api/unsave', qs.stringify({ id }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `bearer ${user.token}`,
        'User-Agent': user.username
      }
    })
    .then(() => el)
    .catch(() => { throw new Error(`Failed to unsave ${id}`) })
}

const main = ({ username, token, unsave: del }) => {
  const user = { username, token }
  const fetcher = fetch({ user, noAfter: del })
  const unsaver = del ? unsave(user) : Promise.resolve

  return fetcher()
    .pipe(
      Rxo.expand(fetcher),
      Rxo.mergeMap(R.compose(R.defaultTo([]), R.view(elementsLens))),
      Rxo.mergeMap(unsaver),
      Rxo.map(convert)
    )
}

module.exports = main
