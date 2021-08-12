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
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  roots: ['src/__tests__'],
}

export default config
