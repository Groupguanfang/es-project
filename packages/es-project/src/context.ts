import type { Context, EsProjectContext, I18n, I18nMatcherAsync } from './types'
import { env } from 'node:process'
import { get } from 'lodash-es'
import nodePlop from 'node-plop'

/** @internal */
export function createI18n<T extends Record<string, Record<string, any>>, L extends keyof T>(
  messages: T,
  locale: string,
): I18n<T, L> {
  return {
    t: ((key: string, args?: any[], defaultValue?: string) => {
      const result = get(
        messages,
        `${locale}.${key}`,
        defaultValue,
      ) || defaultValue || key

      // 处理`{0}`, `{1}`, `{2}` (以此类推) 等占位符
      return result.replace(/\{(\d+)\}/g, (_: string, index: string) => {
        return (args || [])[Number(index)]
      })
    }) as any,
  }
}

function defaultMatcher(locale: string, allLocales: string[]): string {
  let matchedLocale = allLocales[0]
  for (const currentLocale of allLocales) {
    if (locale.includes(currentLocale)) {
      matchedLocale = currentLocale
      break
    }
  }
  return matchedLocale
}

export async function createPlopContext(basePath: string): Promise<Context> {
  const plop = await nodePlop()

  const ctx: EsProjectContext = {
    getBasePath: () => basePath,
    run: async (generator) => {
      await generator.runActions(await generator.runPrompts())
    },
    get locale() {
      return env.LANG || 'en'
    },
    createI18n(messages, matcher: (locale: string, allLocales: string[]) => string = defaultMatcher) {
      return createI18n(messages, matcher(ctx.locale, Object.keys(messages)))
    },
    async createI18nAsync(messages, matcher = defaultMatcher as unknown as I18nMatcherAsync) {
      return createI18n(messages, await matcher(ctx.locale, Object.keys(messages)))
    },
  }

  return Object.assign(plop, ctx)
}
