const yargs = require('yargs')

const pkg = require('./package.json')
const toStdio = require('./loaders/toStdio')

const asCLICommand = (pipeline) => ({
  ...pipeline,
  handler: (argv) => toStdio(pipeline.handler(argv))
})

yargs
  .command(asCLICommand(require('./pipelines/bookmarks')))
  .command(asCLICommand(require('./pipelines/reddit')))
  .command(asCLICommand(require('./pipelines/json')))
  .command(asCLICommand(require('./pipelines/normalize')))
  .scriptName('links-from')
  .version(`${pkg.name} ${pkg.version}`)
  .demandCommand()
  .help()
  .argv
