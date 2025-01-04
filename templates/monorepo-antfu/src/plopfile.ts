import type { Context } from 'es-project'
import path from 'node:path'
import i18n from './i18n.json'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  const { t } = ctx.createI18n(i18n)

  const generator = ctx.setGenerator('@es-project-template/monorepo-antfu', {
    description: `Create a monorepo with antfu's code style.`,
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: t('project-name'),
      },
      {
        type: 'input',
        name: 'description',
        message: t('project-description'),
      },
      {
        type: 'list',
        name: 'projectType',
        message: t('project-type'),
        choices: [
          { name: t('project-type-lib'), value: 'lib' },
          { name: t('project-type-app'), value: 'app' },
        ],
      },
      {
        type: 'confirm',
        name: 'edit-readme',
        message: t('edit-readme'),
      },
      {
        type: 'editor',
        name: 'readme',
        message: t('readme-content'),
        default: t('readme-content-default'),
        when: answers => answers['edit-readme'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'package.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'package.json.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'eslint.config.js'),
        templateFile: path.resolve(__dirname, '..', 'template', 'eslint.config.js.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'packages', 'README.md'),
        templateFile: path.resolve(__dirname, '..', 'template', 'packages-readme.md.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'tsconfig.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'tsconfig.json.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'README.md'),
        templateFile: path.resolve(__dirname, '..', 'template', 'README.md.hbs'),
        transform(template, data) {
          if (data['edit-readme'])
            return template
          return t('readme-content-default')
        },
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), '.gitignore'),
        templateFile: path.resolve(__dirname, '..', 'template', '.gitignore.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), '.editorconfig'),
        templateFile: path.resolve(__dirname, '..', 'template', '.editorconfig.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), '.npmrc'),
        templateFile: path.resolve(__dirname, '..', 'template', '.npmrc.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'vitest.workspace.ts'),
        templateFile: path.resolve(__dirname, '..', 'template', 'vitest.workspace.ts.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), 'pnpm-workspace.yaml'),
        templateFile: path.resolve(__dirname, '..', 'template', 'pnpm-workspace.yaml.hbs'),
      },
      {
        type: 'add',
        path: path.resolve(ctx.getBasePath(), '.vscode', 'settings.json'),
        templateFile: path.resolve(__dirname, '..', 'template', 'settings.json.hbs'),
      },
    ],
  })

  await ctx.run(generator)
}
