module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    globals: {
        "ts-jest": {
            tsConfig: "<rootDir>/jest.tsconfig.json",
        },
    },
    projects: [
        {
            displayName: "test",
            transform: {
                ".(ts)": "ts-jest",
            },
            testRegex: "__tests__/.*\\.(test|spec)\\.(ts)$",
            moduleDirectories: ["<rootDir>/src/", "node_modules"],
            moduleFileExtensions: ["ts", "js"],
            setupFilesAfterEnv: ["jest-expect-message", "jest-extended"],
            resetMocks: true,
        },
    ],
};
