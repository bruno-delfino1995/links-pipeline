const yargs = require('yargs')

const pkg = require('../package.json')
const toStdio = require('./loaders/toStdio')
const normalize = require('./transformers/normalize')

yargs
  .scriptName('links-from')
  .version(`${pkg.name} ${pkg.version}`)
  .commandDir('./pipelines', {
    recurse: false,
    extensions: 'js',
    visit: (pipeline) => ({
      ...pipeline,
      handler: (argv) => {
        const observable = pipeline.handler(argv)
          .pipe(...normalize)

        return toStdio(observable)
      }
    })
  })
  .demandCommand()
  .help()
  .parse(process.argv.slice(2))
