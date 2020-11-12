module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/tests/**/*.spec.ts"
    ],
    collectCoverageFrom: [
      "*.ts",
      "lib/**/*.ts"
    ],
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json"
      }
    }
};