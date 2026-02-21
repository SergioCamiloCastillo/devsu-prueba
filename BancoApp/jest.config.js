module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/navigation/**',
    '!src/screens/**',
    '!src/components/**',
    '!src/interfaces/**',
    '!src/presentation/screens/**',
    '!src/presentation/components/**',
    '!src/presentation/navigation/**',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@tanstack/react-query|@tanstack/query-core|react-native-image-picker|@react-native-community/datetimepicker)/)',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
