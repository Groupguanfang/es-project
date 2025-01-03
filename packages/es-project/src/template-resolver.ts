import type { Stream } from 'node:stream'
import type { PackageJson } from 'type-fest'
import fs from 'node:fs'
import path from 'node:path'
import { cwd, env } from 'node:process'
import axios from 'axios'
import { x } from 'tar'

export interface ResolvedTemplate {
  name: string
  title: string
  description: string
}

export async function fetchTemplates(baseURL: string = 'https://registry.npmjs.org'): Promise<ResolvedTemplate[]> {
  const response = await axios.get('/-/v1/search', {
    baseURL,
    params: {
      text: 'keywords:es-project-template',
      cacheBust: Date.now(),
    },
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  const objects: any[] = (response.data?.objects || [])

  const result: ResolvedTemplate[] = objects.map((obj: any) => ({
    name: obj.package.name,
    title: obj.package.name.replace(/@es-project-template\//, '').replace(/es-project-template-/, ''),
    description: obj.package.description,
  })).filter((template: any) =>
    template.name.includes('es-project-template-')
    || template.name.includes('@es-project-template'),
  )

  if (env.DEBUG) {
    // TODO: DEBUG mode, add some no included templates
  }

  return result
}

export interface FetchedTemplate extends Partial<PackageJson> {
  dist?: {
    tarball?: string
  }
}

export async function fetchTemplate(
  name: string,
  version: string = 'latest',
  baseURL: string = 'https://registry.npmjs.org',
): Promise<FetchedTemplate> {
  const response = await axios.get(`${name}/${version}`, {
    headers: {
      'Cache-Control': 'no-cache',
    },
    baseURL,
  })

  return response.data
}

export async function downloadTemplate(packageJson: FetchedTemplate): Promise<string> {
  if (!packageJson.dist?.tarball)
    throw new Error(`No tarball found in package ${packageJson.name}, cannot download template.`)

  const response = await axios.get<Stream>(packageJson.dist.tarball, {
    responseType: 'stream',
  })
  const cachePath = await writeNpmPackage(response.data)
  const outputDir = path.resolve('.es-project')
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir, { recursive: true })
  await extract(cachePath, outputDir)
  return outputDir
}

function writeNpmPackage(data: Stream): Promise<string> {
  return new Promise((resolve, reject) => {
    const cachePath = path.resolve(cwd(), `./node_modules/.cache/${randomId()}.tgz`)
    if (!fs.existsSync(path.dirname(cachePath)))
      fs.mkdirSync(path.dirname(cachePath), { recursive: true })

    data.pipe(
      fs.createWriteStream(cachePath)
        .on('error', reject)
        .on('finish', () => resolve(cachePath)),
    )
  })
}

function randomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

async function extract(filePath: string, outputDir: string): Promise<void> {
  await x({
    file: filePath,
    cwd: outputDir,
  })
}
