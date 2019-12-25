const R = require("ramda");
const qs = require("query-string");
const Promise = require("bluebird");
const axios = require("axios");

const token = "<YOUR_TOKEN>";
const username = "<YOUR_USERNAME>";

const afterLens = R.lensPath(["data", "after"]);
const elementsLens = R.lensPath(["data", "children"]);

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
const retrieve = previous => {
  const after = R.view(afterLens, previous);

  return axios
    .get(`https://oauth.reddit.com/user/${username}/saved`, {
      params: {
        after
      },
      headers: {
        Authorization: `bearer ${token}`,
        "User-Agent": username
      }
    })
    .then(R.prop("data"));
};

const fetch = () => chain(retrieve, link)().then(R.view(R.lensIndex(0)));

const process = R.map(
  R.compose(
    R.when(R.propEq("kind", "t3"), post => ({
      type: "com.reddit#post",
      title: post.data.title,
      subreddit: post.data.subreddit,
      permalink: `https://reddit.com${post.data.permalink}`,
      url: post.data.url
    })),
    R.when(R.propEq("kind", "t1"), comment => ({
      type: "com.reddit#comment",
      body: comment.data.body,
      subreddit: comment.data.subreddit,
      permaling: `https://reddit.com${comment.data.permalink}`
    }))
  )
);

const unsave = data =>
  Promise.map(data, el => {
    const id = el.data.name;
    return axios
      .post(`https://oauth.reddit.com/api/unsave`, qs.stringify({ id }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `bearer ${token}`,
          "User-Agent": username
        }
      })
      .then(() => `Successfully deleted ${id}`)
      .catch(err => `Unsucessfully deleted ${id}: ${JSON.stringify(err)}`);
  });

const main = () =>
  fetch()
    .then(data => Promise.all([process(data), unsave(data)]))
    .then(([data, unsaved]) => {
      console.error(JSON.stringify(unsaved));
      return data;
    });

main()
  .then(data => console.log(JSON.stringify(data)))
  .catch(err => console.error(JSON.stringify(err)));
