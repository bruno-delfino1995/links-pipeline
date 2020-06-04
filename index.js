const yargs = require('yargs')

const pkg = require('./package.json')

const toLog = o => o.subscribe(el => console.log(JSON.stringify(el)))
const asCLICommand = (pipeline) => ({
  ...pipeline,
  handler: (argv) => toLog(pipeline.handler(argv))
})

yargs
  .command(asCLICommand(require('./pipelines/bookmarks')))
  .command(asCLICommand(require('./pipelines/reddit')))
  .command(asCLICommand(require('./pipelines/json')))
  .scriptName('links-from')
  .version(`${pkg.name} ${pkg.version}`)
  .demandCommand()
  .help()
  .argv
