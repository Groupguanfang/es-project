import type { ActionType, Context } from 'es-project'
import path from 'node:path'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  ctx.setHelper('includes', (value: any, array: any[]) => array.includes(value))

  const generator = ctx.setGenerator('@es-project-template/unplugin', {
    description: `Create a unplugin with unplugin-starter`,
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the package name:',
      },
      {
        type: 'input',
        name: 'short',
        message: 'Please enter the plugin short name, for example: `unplugin-swc`\'s short name is `swc`:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please enter the plugin description:',
      },
      {
        type: 'checkbox',
        name: 'support',
        message: 'What framework do you want to support?',
        choices: [
          { name: 'astro', value: 'astro', checked: true },
          { name: 'esbuild', value: 'esbuild', checked: true },
          { name: 'farm', value: 'farm', checked: true },
          { name: 'nuxt', value: 'nuxt', checked: true },
          { name: 'rollup', value: 'rollup', checked: true },
          { name: 'rspack', value: 'rspack', checked: true },
          { name: 'vite', value: 'vite', checked: true },
          { name: 'webpack', value: 'webpack', checked: true },
        ],
      },
    ],

    actions: (data: any): ActionType[] => {
      const actions: ActionType[] = [
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'package.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'package.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), '.gitignore'),
          templateFile: path.resolve(__dirname, '..', 'template', '.gitignore.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), '.npmrc'),
          templateFile: path.resolve(__dirname, '..', 'template', '.npmrc.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'eslint.config.js'),
          templateFile: path.resolve(__dirname, '..', 'template', 'eslint.config.js.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'tsconfig.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'tsconfig.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'tsup.config.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'tsup.config.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'README.md'),
          templateFile: path.resolve(__dirname, '..', 'template', 'README.md.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'src/index.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'index.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'src/types.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'types.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'playground/vite.config.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'vite.config.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'playground/package.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'playground-package.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'playground/main.ts'),
          templateFile: path.resolve(__dirname, '..', 'template', 'main.ts.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), 'playground/index.html'),
          templateFile: path.resolve(__dirname, '..', 'template', 'index.html.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), '.vscode/settings.json'),
          templateFile: path.resolve(__dirname, '..', 'template', 'settings.json.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), '.github/workflows/release.yml'),
          templateFile: path.resolve(__dirname, '..', 'template', 'release.yml.hbs'),
        },
        {
          type: 'add',
          path: path.resolve(ctx.getBasePath(), '.github/workflows/ci.yml'),
          templateFile: path.resolve(__dirname, '..', 'template', 'ci.yml.hbs'),
        },
      ]

      if (data.support && Array.isArray(data.support)) {
        for (const framework of data.support) {
          actions.push({
            type: 'add',
            path: path.resolve(ctx.getBasePath(), `src/${framework}.ts`),
            templateFile: path.resolve(__dirname, '..', 'template', `${framework}.ts.hbs`),
          })
        }
      }

      return actions
    },
  })

  ctx.run(generator)
}
