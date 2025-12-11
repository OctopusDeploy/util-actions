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
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/init-declarations": ["error"],
            "init-declarations": "off",
            "@typescript-eslint/no-dupe-class-members": ["error"],
            "no-dupe-class-members": "off",
            "no-eq-null": ["error"],
            "no-undef": "off",
            "no-extra-boolean-cast": "off",
            "no-multi-spaces": "error",
            "no-irregular-whitespace": "off",
            "no-prototype-builtins": "off",
            "prefer-rest-params": "off",
            "prefer-spread": "off",
            "no-case-declarations": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "quotes": [
                "error",
                "double",
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true,
                },
            ],
            "prettier/prettier": "error",

            "no-console": "off",
            "camelcase": "off",
            "github/filenames-match-regex": "off",
            "github/no-then": "off",
            "import/no-namespace": "off",
            "import/no-unresolved": "off",
            "import/no-dynamic-require": "off",
            "object-shorthand": "off",
            "no-shadow": "off",
            "prefer-template": "off",
        },
    },
    {
        files: ["__tests__/**/*.ts"],

        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node,
            },
        },

        rules: {
            "filenames/match-regex": 0,
        },
    },
];