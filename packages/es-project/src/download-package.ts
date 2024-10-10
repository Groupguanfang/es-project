import path from 'node:path'
import fs from 'node:fs'
import type { Stream } from 'node:stream'
import { cwd } from 'node:process'
import type { Options } from './types'
import { useRequest } from './request'
import { Logger } from './logger'
import { useExtractTar } from './extract-tar'
import { useMoveAllFiles } from './move-files'

function useDownloadNpmPackage({
  registry = 'https://registry.npmjs.org',
  size = 999999,
  projectPath = cwd(),
}: Options = {
  registry: 'https://registry.npmjs.org',
  size: 999999,
  projectPath: cwd(),
}) {
  const axios = useRequest({ registry, size })
  const { extract } = useExtractTar()

  async function receivePackageUrl(packageName: string, version = 'latest'): Promise<string | undefined> {
    const receiverLogger = Logger.process(`Receiving package ${packageName}@${version}...`)

    try {
      // 获取包的元数据
      const metadataResponse = await axios.get(`${packageName}/${version}`)
      receiverLogger.succeed(`Received package ${packageName}@${version} successfully`)
      return metadataResponse.data.dist.tarball
    }
    catch (_) {
      receiverLogger.fail(new Error(`Error receiving package ${packageName}@${version}.`))
      return undefined
    }
  }

  function writeNpmPackage(filePath: string, data: Stream): Promise<void> {
    const writerLogger = Logger.process(`Saving package to ${path.isAbsolute(filePath) ? path.relative(cwd(), filePath) : filePath}...`)

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath)
      writer
        .on('error', (err) => {
          writerLogger.fail(new Error(`Error writing file: ${err}`))
          reject(err)
        })
        .on('finish', () => {
          writerLogger.succeed(`Saved package to ${path.isAbsolute(filePath) ? path.relative(cwd(), filePath) : filePath} successfully.`)
          resolve()
        })
      data.pipe(writer)
    })
  }

  async function requestNpmPackageToTaz(url: string, packageName: string, version: string): Promise<Stream> {
    const requesterLogger = Logger.process(`Request package ${packageName}@${version}...`)
    try {
      // 下载 tarball 文件
      const tarballResponse = await axios<Stream>({
        method: 'GET',
        url,
        responseType: 'stream',
      })
      requesterLogger.succeed(`Requested package ${packageName}@${version} successfully`)
      return tarballResponse.data
    }
    catch (_) {
      requesterLogger.fail(new Error(`Error request package ${packageName}@${version}.`))
    }
  }

  async function checkFilePath(packageName: string, version: string): Promise<void> {
    // 保存文件的路径（将包保存为 .tgz 文件）
    const filePath = path.resolve(projectPath || cwd(), `./node_modules/.es-project/${packageName}-${version}.tgz`)
    // 如果目录不存在则创建目录
    if (!fs.existsSync(path.dirname(filePath)))
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
  }

  async function removeNodeModules(showLogger: boolean = true): Promise<void> {
    const removeLogger = showLogger
      ? Logger.process('Removing cache files...')
      : null

    return new Promise<void>((resolve, reject) => {
      const nodeModulesPath = path.resolve(projectPath || cwd(), './node_modules/.es-project')
      if (fs.existsSync(nodeModulesPath)) {
        fs.rm(nodeModulesPath, { recursive: true }, (err) => {
          if (err) {
            if (removeLogger) removeLogger.fail(new Error(`Error removing cache files: ${err}`))
            reject(err)
          }
          if (removeLogger) removeLogger.succeed('Removed cache files successfully.')
          resolve()
        })
      }
    })
  }

  return {
    receivePackageUrl,
    writeNpmPackage,
    requestNpmPackageToTaz,
    checkFilePath,
    extract,
    removeNodeModules,
  }
}

export function useDownloadPackage(options?: Options) {
  const downloader = useDownloadNpmPackage(options)

  async function downloadPackage(packageName: string, version = 'latest') {
    const url = await downloader.receivePackageUrl(packageName, version)
    if (!url) return

    await downloader.checkFilePath(packageName, version)
    const tarball = await downloader.requestNpmPackageToTaz(url, packageName, version)
    await downloader.writeNpmPackage(path.resolve(options.projectPath || cwd(), `./node_modules/.es-project/${packageName}-${version}.tgz`), tarball)
    const extractFolder = path.resolve(options.projectPath || cwd(), `./node_modules/.es-project`)
    await downloader.extract(
      path.resolve(options.projectPath || cwd(), `./node_modules/.es-project/${packageName}-${version}.tgz`),
      extractFolder,
    )

    const { moveAllFiles, moveLogger } = useMoveAllFiles(path.join(extractFolder, 'package'), options.projectPath || cwd())
    await moveAllFiles()
    const text = `Moved files from ${path.relative(cwd(), path.join(extractFolder, 'package'))} to ${path.relative(cwd(), options.projectPath || cwd())} successfully.`
    if (moveLogger) moveLogger.succeed(text)
    else Logger.log(text)
    await downloader.removeNodeModules()
  }

  return {
    downloadPackage,
  }
}
