import type { Ora } from 'ora'
import type { PackageJson } from 'type-fest'
import type { FetchedTemplate, ResolvedTemplate } from './template-resolver'
import type { Awaitable, Context, I18n } from './types'
import { clear } from 'node:console'
import fs from 'node:fs'
import path from 'node:path'
import process, { cwd, env, exit } from 'node:process'
import { importx } from 'importx'
import k from 'kleur'
import ora from 'ora'
import prompts from 'prompts'
import { createPlopContext } from './context'
import { i18nMessage } from './i18n'
import { resolvePackageJsonOptions } from './package-json-options'
import { downloadTemplate, fetchTemplate, fetchTemplates } from './template-resolver'
import { typeAssert } from './utils'

export interface CreateProjectOptions {
  basePath?: string
  baseURL?: string
  templates?: ResolvedTemplate[]
}

export async function startCreateProject(createOptions: CreateProjectOptions = {}): Promise<void> {
  clear()

  const ctx = await createPlopContext(createOptions.basePath || cwd())
  const i18n = ctx.createI18n(i18nMessage)

  const templates = await unwrapFetchTemplates(createOptions.baseURL, i18n)
  const result = await prompts({
    type: 'autocomplete',
    name: 'packageName',
    message: i18n.t('select-template'),
    choices: (createOptions.templates || templates).map(template => ({
      title: template.title,
      description: template.description,
      value: template.name,
    })),
  })
  if (!result.packageName)
    return exit(0)

  const { info, spinner } = await unwrapFetchTemplate(result.packageName, i18n)
  clear()
  spinner.start(`Template information fetched, checking the template...`)
  const options = resolvePackageJsonOptions(info)
  if (options.version !== 1 && !env.DEBUG) {
    const errorMessage = i18n.t('template-version-not-supported', [options.version])
    spinner.fail(k.red(errorMessage))
    throw new Error(errorMessage)
  }
  clear()
  spinner.succeed(k.green(i18n.t('template-information-fetched')))
  console.log(`
  ${i18n.t('name')}: ${info.name}
  ${i18n.t('version')}: ${info.version}
  ${i18n.t('description')}: ${info.description}
  ${i18n.t('license')}: ${info.license || 'None'}
  ${i18n.t('where-to-generate')}: ${createOptions.basePath || cwd()}
  `)

  const confirmPrompts = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: i18n.t('do-you-want-to-generate-the-project'),
  })

  if (!confirmPrompts.confirm) {
    console.log(k.red(i18n.t('the-project-generation-is-canceled')))
    return exit(0)
  }

  const outputDir = await downloadTemplate(info, i18n)
  const generatorScriptPath = path.resolve(outputDir, options.generatorScript)
  if (!fs.existsSync(generatorScriptPath))
    throw new Error(i18n.t('generator-script-not-found', [generatorScriptPath]))

  const mod = await importx(generatorScriptPath, cwd())
  const fn = getModuleDefaultFn(mod, i18n)
  process.on('exit', () => fs.rmSync(outputDir, { recursive: true, force: true }))
  await fn(ctx)
}

export type ModuleDefaultFn = (ctx: Context) => Awaitable<unknown>
function getModuleDefaultFn<T extends Record<string, Record<string, any>>, L extends keyof T>(mod: any, i18n: I18n<T, L>): ModuleDefaultFn {
  if (typeof mod === 'function')
    return mod as () => Awaitable<unknown>
  else if (typeof mod === 'object' && typeof mod.default === 'function')
    return mod.default as ModuleDefaultFn
  else if (typeof mod === 'object' && typeof mod.default === 'object' && typeof mod.default.default === 'function')
    return mod.default.default as ModuleDefaultFn
  else
    throw new Error(i18n.t('invalid-generator-script'))
}

async function unwrapFetchTemplate<T extends Record<string, Record<string, any>>, L extends keyof T>(
  name: string,
  i18n: I18n<T, L>,
  version: string = 'latest',
  baseURL: string = 'https://registry.npmjs.org',
): Promise<{
    info: FetchedTemplate
    spinner: Ora
  }> {
  const spinner = ora(k.blue(i18n.t('fetching-template-information'))).start()
  let info: Partial<PackageJson>

  try {
    info = await fetchTemplate(name, version, baseURL)
    return { info, spinner }
  }
  catch (error) {
    typeAssert<Error>(error)
    spinner.fail(k.red(i18n.t('failed-to-fetch-template-information', [error.message])))
    throw new Error(i18n.t('failed-to-fetch-template-information', [error.message]))
  }
}

async function unwrapFetchTemplates<T extends Record<string, Record<string, any>>, L extends keyof T>(
  baseURL: string = 'https://registry.npmjs.org',
  i18n: I18n<T, L>,
): Promise<ResolvedTemplate[]> {
  const spinner = ora(k.blue(i18n.t('fetching-templates'))).start()
  let templates: ResolvedTemplate[]

  try {
    templates = await fetchTemplates(baseURL)
    spinner.succeed(k.green(i18n.t('template-fetched')))
    return templates
  }
  catch (error) {
    typeAssert<Error>(error)
    spinner.fail(k.red(i18n.t('failed-to-fetch-templates', [error.message])))
    throw new Error(i18n.t('failed-to-fetch-templates', [error.message]))
  }
}
