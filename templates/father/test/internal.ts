import path from 'node:path'
import { cac } from 'cac'
import { createPlopContext } from 'es-project'
import plopfile from '../src/plopfile'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

const cli = cac()

cli.command('new <path>', 'Create a new project')
  .action(async (projectPath) => {
    createPlopContext(path.resolve(projectPath))
      .then(ctx => plopfile(ctx))
  })

cli.help().parse()
