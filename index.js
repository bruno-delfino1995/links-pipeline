const yargs = require('yargs')

const pkg = require('./package.json')
const toStdio = require('./loaders/toStdio')

yargs
  .scriptName('links-from')
  .version(`${pkg.name} ${pkg.version}`)
  .commandDir('./pipelines', {
    recurse: false,
    extensions: 'js',
    visit: (pipeline) => ({
      ...pipeline,
      handler: (argv) => toStdio(pipeline.handler(argv))
    }),
  })
  .demandCommand()
  .help()
  .argv
