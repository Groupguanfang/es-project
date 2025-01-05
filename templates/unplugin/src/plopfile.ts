import type { Context } from 'es-project'
import path from 'node:path'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  const generator = ctx.setGenerator('@es-project-template/unplugin', {
    description: `Create a unplugin with unplugin-starter`,
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'package.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'package.json.hbs'),
      },
    ],
  })

  ctx.run(generator)
}
