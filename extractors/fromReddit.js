const R = require('ramda');
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const qs = require('query-string');
const Promise = require('bluebird');
const axios = require('axios');

const afterLens = R.lensPath(['data', 'after']);
const elementsLens = R.lensPath(['data', 'children']);

// FIXME: Flexible stop condition
// chain :: (Maybe r -> Either r e) ->
//  ([a] -> Either r e -> Either ([a], r) ([a], e)) ->
//  r -> [a] ->
//  Either ([a], a) ([a], b)
const chain = (process, link) => (current, acc = []) => {
  const currentId = R.view(afterLens, current);
  const promise = process(current);

  return link(acc, promise).then(([all, next]) => {
    const nextId = R.view(afterLens, next);

    if (!nextId || nextId == currentId) return [all, next];

    return chain(process, link)(next, all);
  });
};

// link :: [a] -> Either r e -> Either ([a], r) ([a], e)
const link = (acc, promise) => {
  return promise
    .then(data => {
      const elements = R.defaultTo([], R.view(elementsLens, data));
      return [R.concat(acc, elements), data];
    })
    .catch(err => {
      throw [acc, err];
    });
};

// retrieve :: Maybe r -> Either r e
const retrieve = user => previous => {
  const after = R.view(afterLens, previous);

  return axios
    .get(`https://oauth.reddit.com/user/${user.username}/saved`, {
      params: {
        after
      },
      headers: {
        Authorization: `bearer ${user.token}`,
        'User-Agent': user.username
      }
    })
    .then(R.prop('data'));
};

const fetch = user => chain(retrieve(user), link)().then(R.view(R.lensIndex(0)));

const process = R.map(
  R.compose(
    R.when(R.propEq('kind', 't3'), post => ({
      kind: 'com.reddit#post',
      title: post.data.title,
      tags: [post.data.subreddit],
      href: `https://reddit.com${post.data.permalink}`
    })),
    R.when(R.propEq('kind', 't1'), comment => ({
      kind: 'com.reddit#comment',
      title: comment.data.body,
      tags: [comment.data.subreddit],
      href: `https://reddit.com${comment.data.permalink}`
    }))
  )
);

const unsave = user => data =>
  Promise.map(data, el => {
    const id = el.data.name;
    // return axios
    //   .post('https://oauth.reddit.com/api/unsave', qs.stringify({ id }), {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       Authorization: `bearer ${user.token}`,
    //       'User-Agent': user.username
    //     }
    //   })
    return Promise.resolve(el.data.name)
      .then(() => `Successfully deleted ${id}`)
      .catch(err => `Unsucessfully deleted ${id}: ${JSON.stringify(err)}`);
  });

const main = ({ username, token, unsave }) => Rx.from(
  fetch({ username, token })
    .then(data => Promise.all(unsave
        ? [process(data), unsave({ username, token })(data)]
        : [process(data)]
    ))
    .then(([data]) => data)
).pipe(Rxo.mergeMap(data => Rx.from(data)))

module.exports = main
