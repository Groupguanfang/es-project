import axios from 'axios'
import type { RequestOptions } from './types'

export function useRequest({
  registry = 'https://registry.npmjs.org',
  size = 999999,
}: RequestOptions = {
  registry: 'https://registry.npmjs.org',
  size: 999999,
}) {
  return axios.create({
    baseURL: registry,
    params: { size },
  })
}
