import type { Options } from './types'
import { useRequest } from './request'
import { Logger } from './logger'

export interface SearchResult {
  objects: {
    package: {
      name: string
      description?: string
      version: string
      keywords?: string[]
      [key: string]: any
    }
    [key: string]: any
  }[]
  total: number
  time: string
}

export interface UseTemplateResolverOptions extends Options {
  showLogger?: boolean
}

export function useTemplateResolver({
  registry = 'https://registry.npmjs.org',
  showLogger = true,
}: UseTemplateResolverOptions = {
  registry: 'https://registry.npmjs.org',
  size: 999999,
  showLogger: true,
}) {
  const axios = useRequest({ registry })

  async function resolveTemplates() {
    const logger = showLogger ? Logger.process('Fetching templates...') : null

    try {
      const res = await axios.get<SearchResult>('/-/v1/search', {
        params: { text: 'keywords:malagu-component' },
      })
      if (logger) logger.succeed(`Fetched templates successfully, total: ${res.data.total}`)
      return res.data
    }
    catch (_err) {
      const err = new Error(`Failed to fetch templates, please check your registry url.`)
      if (logger) logger.fail(err)
      return err
    }
  }

  return {
    resolveTemplates,
  }
}
