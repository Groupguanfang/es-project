import { clear } from 'node:console'
import path from 'node:path'
import { type ActionType, type Context, typeAssert } from 'es-project'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  ctx.setHelper('split', (value: string) => value.split(','))

  const generator = ctx.setGenerator('tsup', {
    description: 'Create a project with tsup.',
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
      {
        type: 'input',
        name: 'entry',
        message: 'Please enter the entry filename, you can enter multiple files separated by `,` like `index,main`:',
        default: 'index',
      },
      {
        type: 'confirm',
        name: 'dts',
        message: 'Generate d.ts file?',
        default: true,
      },
      {
        type: 'list',
        name: 'sourcemap',
        message: 'Generate sourcemap file?',
        choices: [
          { value: true, name: 'yes' },
          { value: false, name: 'no' },
          { value: 'inline', name: 'inline' },
        ],
        default: true,
      },
      {
        type: 'confirm',
        name: 'clean',
        message: 'Clean build directory?',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'format',
        message: 'What do you want to build?',
        choices: [
          { value: 'cjs', name: 'commonjs' },
          { value: 'esm', name: 'esm' },
          { value: 'iife', name: 'iife' },
        ],
        default: ['cjs', 'esm'],
      },
    ],
    actions(answers) {
      const { entry } = (answers || {})
      typeAssert<string>(entry)

      const actions: ActionType[] = [
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'tsup.config.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'tsup.config.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'package.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'package.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'tsconfig.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'tsconfig.json.hbs'),
        },
      ]

      const files = (entry || '').split(',')
      for (const file of files) {
        actions.push({
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'src', `${file}.ts`),
          templateFile: path.resolve(__dirname, '..', 'template', 'index.ts.hbs'),
        })
      }

      return actions
    },
  })

  clear()
  await ctx.run(generator)
}
