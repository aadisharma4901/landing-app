const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Define the root directories for test discovery to avoid picking up worktree files
  roots: ['<rootDir>/src'],
  // Ignore the Next.js build output directories and any worktree directories to prevent haste map naming collisions
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.next/standalone/', '<rootDir>/.kilo/'],
  // Exclude external worktree directories and node_modules from test discovery
  testPathIgnorePatterns: ['/node_modules/', '/.kilo/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/app/**/*.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
}

module.exports = createJestConfig(customJestConfig)
