import path from 'node:path'
import { cwd } from 'node:process'
import { x } from 'tar'
import { Logger } from './logger'

export function useExtractTar() {
  async function extract(filePath: string, outputDir: string) {
    // 解压 tar.gz 文件的函数
    try {
    // 使用 tar 解压 .tgz 文件到指定目录
      await x({
        file: filePath, // 指定要解压的文件
        cwd: outputDir, // 指定解压的输出目录
      })
      Logger.log(`Extracted ${path.isAbsolute(filePath) ? path.relative(cwd(), filePath) : filePath} to ${outputDir}`)
    }
    catch (error) {
      Logger.error(new Error(`Error extracting ${path.isAbsolute(filePath) ? path.relative(cwd(), filePath) : filePath}: ${error.message}`))
    }
  }

  return {
    extract,
  }
}
