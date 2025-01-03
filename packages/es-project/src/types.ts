import type { NodePlopAPI, PlopGenerator } from 'node-plop'

export interface EsProjectContext {
  getBasePath: () => string
  run: (generator: PlopGenerator) => Promise<void>
}

export interface Context extends NodePlopAPI, EsProjectContext {}

export type Awaitable<T> = T | Promise<T>
