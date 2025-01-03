import type { PackageJson } from 'type-fest'

export interface PackageJsonOptions {
  version: 0 | 1
  generatorScript: string
}

export function resolvePackageJsonOptions(packageJson: Partial<PackageJson> = {}): PackageJsonOptions {
  return (packageJson['es-project'] || {}) as unknown as PackageJsonOptions
}
