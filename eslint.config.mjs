import jest from "eslint-plugin-jest";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    {
        ignores: [
            "**/dist/",
            "**/lib/",
            "**/node_modules/",
            "**/jest.config.js",
            "**/out/",
            "**/coverage/",
            "eslint.config.mjs",
            "esbuild.js",
            "esbuild.mjs",
            "rollup.config.js",
            "step-package.config.js",
            "add-changeset/",
            "current-branch-name/",
            "extract-package-details/",
            "find-and-replace-all/",
            "renovate-config.js"
        ],
    },
    prettierConfig,
    {
        files: ["**/*.ts"],
        plugins: {
            jest,
            "@typescript-eslint": typescriptEslint,
            prettier,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
                NodeJS: true,
            },

            parser: tsParser,
            ecmaVersion: 9,
            sourceType: "module",

            parserOptions: {
                project: ["./packages/*/tsconfig.json", "./packages/*/*.tsconfig.json"],
            },
        },

        rules: {
            // consider enabling as error
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            // this rule is a bit buggy atm, it picks up things as unused when they are
            "@typescript-eslint/no-unused-vars": "off",
            // https://github.com/typescript-eslint/typescript-eslint/issues/1856
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/adjacent-overload-signatures": "error",
            // The typescript version adds extra checks on top of the eslint version, so we disable the eslint version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/init-declarations.md
            "@typescript-eslint/init-declarations": ["error"],
            "init-declarations": "off",
            "@typescript-eslint/no-dupe-class-members": ["error"],
            "no-dupe-class-members": "off",
            "no-eq-null": ["error"],
            // typescript will catch these
            "no-undef": "off",
            "no-extra-boolean-cast": "off",
            "no-multi-spaces": "error",
            "no-irregular-whitespace": "off",
            // should enable, although very unlikely to break in our case
            "no-prototype-builtins": "off",
            // should consider setting this to warn
            "prefer-rest-params": "off",
            // should consider setting this to warn
            "prefer-spread": "off",
            // should consider enabling
            "no-case-declarations": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "prettier/prettier": "error",
        },
    }
];