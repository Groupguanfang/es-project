import cac from 'cac'
import { startCreateProject, version } from 'es-project'

const cli = cac('es-project').version(version)

cli
  .option('--registry [registry]', 'The registry to fetch templates from.', {
    default: 'https://registry.npmjs.org',
  })
  .option('--open', 'Open a webpage to select the template.')

cli.help().parse()

;(async () => {
  if (cli.options.open) {
    return console.warn('Currently, the --open option is not supported, please wait in future.')
  }
  await startCreateProject({
    basePath: cli.options.path,
    baseURL: cli.options.registry,
  })
})()
