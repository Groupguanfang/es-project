import type { Ora } from 'ora'
import type { PackageJson } from 'type-fest'
import type { FetchedTemplate, ResolvedTemplate } from './template-resolver'
import type { Awaitable, Context, EsProjectContext } from './types'
import { clear } from 'node:console'
import fs from 'node:fs'
import path from 'node:path'
import { cwd, env, exit } from 'node:process'
import { importx } from 'importx'
import k from 'kleur'
import nodePlop from 'node-plop'
import ora from 'ora'
import prompts from 'prompts'
import { resolvePackageJsonOptions } from './package-json-options'
import { downloadTemplate, fetchTemplate, fetchTemplates } from './template-resolver'
import { typeAssert } from './utils'

export async function startCreateProject(basePath: string = cwd(), baseURL: string = 'https://registry.npmjs.org'): Promise<void> {
  clear()

  const templates = await unwrapFetchTemplates(baseURL)
  const result = await prompts([
    {
      type: 'autocomplete',
      name: 'packageName',
      message: 'Select a template:',
      choices: templates.map(template => ({
        title: template.title,
        description: template.description,
        value: template.name,
      })),
    },
  ])
  if (!result.packageName)
    return exit(0)

  const { info, spinner } = await unwrapFetchTemplate(result.packageName)
  clear()
  spinner.start(`Template information fetched, checking the template...`)
  const options = resolvePackageJsonOptions(info)
  if (options.version !== 1 && !env.DEBUG) {
    const errorMessage
    = `The template version is ${options.version}, but only version 1 is supported, please contact the template author to upgrade it.`
    spinner.fail(k.red(errorMessage))
    throw new Error(errorMessage)
  }
  clear()
  spinner.succeed(k.green('Template checked, here is the template information:'))
  console.log(`
  Name: ${info.name}
  Version: ${info.version}
  Description: ${info.description}
  License: ${info.license || 'None'}
  Where to generate: ${basePath}
  `)

  const confirmPrompts = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to generate the project?',
  })

  if (!confirmPrompts.confirm) {
    console.log(k.red('The project generation is canceled.'))
    return exit(0)
  }

  const outputDir = await downloadTemplate(info)
  const generatorScriptPath = path.resolve(outputDir, options.generatorScript)
  if (!fs.existsSync(generatorScriptPath))
    throw new Error(`Generator script not found: ${generatorScriptPath}`)

  const context = await createPlopContext(basePath)
  const mod = await importx(generatorScriptPath, cwd())
  const fn = getModuleDefaultFn(mod)
  await fn(context)
}

export type ModuleDefaultFn = (ctx: Context) => Awaitable<unknown>
function getModuleDefaultFn(mod: any): ModuleDefaultFn {
  if (typeof mod === 'function')
    return mod as () => Awaitable<unknown>
  else if (typeof mod === 'object' && typeof mod.default === 'function')
    return mod.default as ModuleDefaultFn
  else if (typeof mod === 'object' && typeof mod.default === 'object' && typeof mod.default.default === 'function')
    return mod.default.default as ModuleDefaultFn
  else
    throw new Error('Invalid generator script, the default export must be a function.')
}

async function createPlopContext(basePath: string): Promise<Context> {
  const plop = await nodePlop()
  return Object.assign(plop, {
    getBasePath: () => basePath,
  } as EsProjectContext)
}

async function unwrapFetchTemplate(name: string, version: string = 'latest', baseURL: string = 'https://registry.npmjs.org'): Promise<{
  info: FetchedTemplate
  spinner: Ora
}> {
  const spinner = ora(k.blue('Fetching template information...')).start()
  let info: Partial<PackageJson>

  try {
    info = await fetchTemplate(name, version, baseURL)
    return { info, spinner }
  }
  catch (error) {
    typeAssert<Error>(error)
    spinner.fail(k.red(`Failed to fetch template information: ${error.message}`))
    throw new Error(`Failed to fetch template's information: ${error.message}`)
  }
}

async function unwrapFetchTemplates(baseURL: string = 'https://registry.npmjs.org'): Promise<ResolvedTemplate[]> {
  const spinner = ora(k.blue('Fetching templates...')).start()
  let templates: ResolvedTemplate[]

  try {
    templates = await fetchTemplates(baseURL)
    spinner.succeed(k.green('Template fetched.'))
    return templates
  }
  catch (error) {
    typeAssert<Error>(error)
    spinner.fail(k.red(`Failed to fetch templates: ${error.message}`))
    throw new Error(`Failed to fetch templates: ${error.message}`)
  }
}
