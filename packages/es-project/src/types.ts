import type { NodePlopAPI } from 'node-plop'

export interface EsProjectContext {
  getBasePath: () => string
}

export interface Context extends NodePlopAPI, EsProjectContext {}

export type Awaitable<T> = T | Promise<T>
