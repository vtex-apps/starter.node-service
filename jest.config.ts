import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  collectCoverage: true,
  transform: {
    '\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  roots: ['src/__tests__'],
}

export default config
