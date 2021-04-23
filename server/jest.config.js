module.exports = {
  testEnvironment: "node",
  moduleDirectories: [
    "node_modules",
    "src",
    "tests"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  rootDir: "./",
  roots: ["<rootDir>/src/", "<rootDir>/tests/"]
};
