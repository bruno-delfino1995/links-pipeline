const fromReddit = require('../extractors/fromReddit')
const normalize = require('../transformers/normalize')

module.exports = {
  command: 'reddit <username>',
  desc: 'Extract from reddit saved items',
  builder: (y) => {
    y.positional('username', {
      desc: 'Username on reddit',
      type: 'string'
    }).option('token', {
      alias: 't',
      desc: 'Authentication token',
      type: 'string',
      demandOption: true
    }).option('unsave', {
      alias: 'u',
      desc: 'Delete items once read',
      type: 'boolean',
      default: false
    })
  },
  handler: (argv) => {
    const opts = {
      username: argv.username,
      token: argv.token,
      unsave: argv.unsave
    }

    return fromReddit(opts)
      .pipe(...normalize)
  }
}
