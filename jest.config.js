const jestJupyterLab = require('@jupyterlab/testutils/lib/jest-config');

const jlabConfig = jestJupyterLab('jupyterlab-telemetry', __dirname);

const {
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles,
  testPathIgnorePatterns,
  transform
} = jlabConfig;

module.exports = {
  coverageDirectory: 'coverage',
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles,
  testPathIgnorePatterns,
  transform,
  automock: false,
  collectCoverageFrom: ['src/**.ts', '!src/*.d.ts'],
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: `./tsconfig.json`
    }
  },
  reporters: ['default'],
  testRegex: 'src/.*/.*.spec.ts$',
  transformIgnorePatterns: ['/node_modules/(?!(@?jupyterlab.*)/)']
};
