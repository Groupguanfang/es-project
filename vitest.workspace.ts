import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { load } from 'js-yaml'
import { defineWorkspace } from 'vitest/config'

function loadPnpmWorkspace(): string[] {
  const workspaceFilePath = path.join('pnpm-workspace.yaml')
  if (!fs.existsSync(workspaceFilePath))
    return []

  const workspaceFile = fs.readFileSync(workspaceFilePath, 'utf-8')
  const parsedFile = load(workspaceFile) as { packages?: string[] } || {}
  const packages = parsedFile.packages || []

  return fg.sync(packages, { onlyDirectories: true, onlyFiles: false })
}

export default defineWorkspace(loadPnpmWorkspace())
