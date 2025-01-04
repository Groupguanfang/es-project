/* eslint-disable ts/method-signature-style */
import type { NodePlopAPI, PlopGenerator } from 'node-plop'

export interface I18n<
  T extends Record<string, Record<string, any>> = Record<string, Record<string, any>>,
  L extends keyof T = keyof T,
> {
  /**
   * Get the translated value.
   *
   * @param key - The key to translate.
   * @param args - The arguments to replace the placeholders.
   * @param defaultValue - The default value if the key is not found.
   * @returns The translated value.
   * @note Overload 1: Use Path and PathValue to get the value.
   */
  t(key: Path<T[L]>, args?: any[], defaultValue?: any): PathValue<T[L], Path<T[L]>>
  /**
   * Get the translated value.
   *
   * @param key - The key to translate.
   * @param args - The arguments to replace the placeholders.
   * @param defaultValue - The default value if the key is not found.
   * @returns The translated value.
   * @note Overload 2: Match no key.
   */
  t(key: string, args?: any[], defaultValue?: any): any
}

export type I18nMatcher = (locale: string, allLocales: string[]) => string
export type I18nMatcherAsync = (locale: string, allLocales: string[]) => Promise<string>

export interface EsProjectContext {
  /**
   * Get the base path.
   *
   * @returns The base path.
   */
  getBasePath(): string
  /**
   * Directly run a generator.
   *
   * @param generator - The generator to run.
   */
  run(generator: PlopGenerator): Promise<void>
  /**
   * Create an i18n instance.
   *
   * @param messages - The messages to translate.
   * @returns The i18n instance.
   */
  createI18n<T extends Record<string, Record<string, any>>, L extends keyof T>(
    messages: T,
    matcher?: I18nMatcher,
  ): I18n<T, L>
  createI18nAsync<T extends Record<string, Record<string, any>>, L extends keyof T>(
    messages: T,
    matcher?: I18nMatcherAsync,
  ): Promise<I18n<T, L>>
  /**
   * Get the current locale.
   *
   * @readonly
   * @returns The current locale.
   * @default 'en'
   */
  readonly locale: string
}
export interface Context extends NodePlopAPI, EsProjectContext {}
export type Awaitable<T> = T | Promise<T>

/**
 * Evaluates to `true` if `T` is `any`. `false` otherwise.
 * (c) https://stackoverflow.com/a/68633327/5290447
 */
type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
      ? false
      : true
  : false

export type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
      ?
      | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
      string}`
      | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
      : never
  : never

export type PathImpl2<T> = PathImpl<T, keyof T> | keyof T

export type Path<T> = keyof T extends string
  ? PathImpl2<T> extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never

export type PathValue<
  T,
  P extends Path<T>,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never
