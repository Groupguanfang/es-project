import type { Context } from 'es-project'
import { execSync } from 'node:child_process'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

export default async function (ctx: Context): Promise<void> {
  const { packageManager } = await ctx.setGenerator('vite', {
    prompts: [
      {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager to use?',
        choices: ['pnpm', 'yarn', 'npm', 'bun'],
        default: 'pnpm',
      },
    ],
  }).runPrompts()

  execSync(`${packageManager} create vite`, { stdio: 'inherit' })
}
