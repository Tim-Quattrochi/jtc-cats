export default {
  testEnvironment: "node",
  setupFiles: ["./jest.setup.js"],
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
};
