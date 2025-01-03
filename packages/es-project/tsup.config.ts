import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    cli: './src/cli.ts',
    index: './src/index.ts',
  },
  dts: true,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
})
