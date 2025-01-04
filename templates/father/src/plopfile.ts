import type { Context } from 'es-project'
import path from 'node:path'
import process from 'node:process'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  ctx.setHelper('raw', (value: string) => `{{${value}}}`)

  const generator = ctx.setGenerator('tsup', {
    description: 'Create a es-project template.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Template name:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Template description:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'tsup.config.ts'),
        templateFile: path.resolve(__dirname, '..', 'template', 'tsup.config.ts.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'package.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'package.json.hbs'),
        data: {
          isInEsProject: !!process.env.IS_IN_ES_PROJECT,
        },
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'tsconfig.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'tsconfig.json.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'src', 'plopfile.ts'),
        templateFile: path.resolve(__dirname, '..', 'template', 'plopfile.ts.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'template', 'package.json.hbs'),
        templateFile: path.resolve(__dirname, '..', 'template', 'template-package.json.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'test', 'index.ts'),
        templateFile: path.resolve(__dirname, '..', 'template', 'index.ts.hbs'),
      },
    ],
  })

  await ctx.run(generator)
}
