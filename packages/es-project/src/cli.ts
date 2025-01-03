import cac from 'cac'
import { version } from '../package.json'
import { startCreateProject } from './create'

const cli = cac('es-project').version(version)

cli.command('create [path]', 'Create a new project.')
  .option('--registry [registry]', 'The registry to fetch templates from.', {
    default: 'https://registry.npmjs.org',
  })
  .option('--open', 'Open a webpage to select the template.')
  .action(async (path, options) => {
    if (options.open) {
      return console.warn('Currently, the --open option is not supported, please wait in future.')
    }
    await startCreateProject({
      basePath: path,
      baseURL: options.registry,
    })
  })

cli.help().parse()
