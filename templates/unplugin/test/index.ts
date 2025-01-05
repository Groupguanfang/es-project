import path from 'node:path'
import { createPlopContext } from 'es-project'
import plopfile from '../src/plopfile'

let __dirname = globalThis.__dirname
if (!__dirname)
  __dirname = new URL('.', import.meta.url).pathname

createPlopContext(path.resolve(__dirname, '..', 'dist'))
  .then(ctx => plopfile(ctx))
