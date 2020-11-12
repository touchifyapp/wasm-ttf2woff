module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/tests/**/*.spec.ts"
    ],
    collectCoverageFrom: [
      "dist/**/ttf2woff.js"
    ],
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json"
      }
    }
};