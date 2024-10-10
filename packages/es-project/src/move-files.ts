import * as fs from 'node:fs'
import * as path from 'node:path'
import { cwd } from 'node:process'
import { Logger } from './logger'

export function useMoveAllFiles(source: string, destination: string, showLogger: boolean = false) {
  const moveLogger = showLogger
    ? Logger.process(`Moving files from ${path.isAbsolute(source) ? path.relative(cwd(), source) : source} to ${path.isAbsolute(destination) ? path.relative(cwd(), destination) : destination}...`)
    : null

  async function moveAllFiles(): Promise<void> {
    try {
      // 检查目标文件夹是否存在，如果不存在则创建
      if (!fs.existsSync(destination))
        fs.mkdirSync(destination, { recursive: true })

      // 读取源文件夹中的所有文件和文件夹
      const items = await fs.promises.readdir(source)

      // 遍历源文件夹中的所有内容
      for (const item of items) {
        const oldPath = path.join(source, item)
        const newPath = path.join(destination, item)

        // 检查是否是文件夹还是文件
        const stat = await fs.promises.stat(oldPath)

        if (stat.isDirectory()) {
          // 如果是文件夹，递归移动其内容
          const { moveAllFiles: moveChildFiles, moveLogger: moveChildLogger } = useMoveAllFiles(oldPath, newPath)
          await moveChildFiles()
          if (moveChildLogger) moveChildLogger.succeed(`Moved files from ${path.relative(cwd(), oldPath)} to ${path.relative(cwd(), newPath)} successfully.`)

          // 删除空的源文件夹
          await fs.promises.rmdir(oldPath)
        }
        else if (stat.isFile()) {
          // 如果是文件，直接移动
          await fs.promises.rename(oldPath, newPath)
        }
      }
    }
    catch (error) {
      const err = new Error(
        `Error moving files from ${path.isAbsolute(source) ? path.relative(cwd(), source) : source} to ${path.isAbsolute(destination) ? path.relative(cwd(), destination) : destination}: ${error.message}`,
      )
      if (moveLogger) moveLogger.fail(err)
      else Logger.error(err)
    }
  }

  moveAllFiles.moveAllFiles = moveAllFiles
  moveAllFiles.moveLogger = moveLogger

  return moveAllFiles
}
