import { argv, cwd } from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import prompts from 'prompts'
import { program } from 'commander'
import chalk from 'chalk'
import type { Options } from './types'
import { useTemplateResolver } from './templates-resolver'
import { Logger } from './logger'
import { useDownloadPackage } from './download-package'

export async function startPrompts({
  registry = 'https://registry.npmjs.org',
  projectPath = cwd(),
  size = 999999,
}: Options = {
  registry: 'https://registry.npmjs.org',
  projectPath: cwd(),
  size: 999999,
}) {
  const { resolveTemplates } = useTemplateResolver({ registry, size, showLogger: true, projectPath })
  const { downloadPackage } = useDownloadPackage({ registry, projectPath, size })

  const templates = await resolveTemplates()
  if (templates instanceof Error) return

  const result = await prompts([
    {
      type: 'autocomplete',
      name: 'project_template_name',
      message: 'Choose or enter some keywords to search for a template:',
      choices: templates.objects.map(item => ({
        title: item.package.name,
        value: item.package.name,
        description: item.package.description || 'No description',
      })),
    },
  ])

  if (!path.isAbsolute(projectPath)) {
    projectPath = path.resolve(cwd(), projectPath)
    if (fs.existsSync(projectPath)) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: `The directory ${chalk.blue(path.relative(cwd(), projectPath))} already exists, do you want to overwrite it? If you choose not to overwrite, program will exit.`,
      })
      if (!overwrite) return
    }
  }

  const findPackageInfo = templates.objects.find(item => item.package.name === result.project_template_name)
  if (!findPackageInfo) return
  Logger.logPackageInfo(findPackageInfo.package, {
    'Project Path': (path.isAbsolute(projectPath) ? path.relative(cwd(), projectPath) : projectPath) || chalk.dim('Current directory'),
  })

  await downloadPackage(findPackageInfo.package.name, findPackageInfo.package.version)
}

export function start() {
  program.version('0.0.1', '-v,--version').description('es-project CLI').name('es-project')
    .option('-registry, --registry <registry>', 'Set the registry')
    .option('-size, --size <size>', 'Set the size')
    .argument('[project_path]', 'Project path', cwd())
    .action((path: string, options: Options) => {
      console.clear()
      startPrompts({
        ...options,
        projectPath: path,
      })
    })
    .parse(argv)
}
