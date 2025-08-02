import js from '@eslint/js'
import pluginRouter from '@tanstack/eslint-plugin-router'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		extends: [
			react.configs.flat.recommended,
			react.configs.flat['jsx-runtime'],
			js.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylistic,
			...pluginRouter.configs['flat/recommended'],
		],
		files: ['client/src/**/*.{ts,tsx}'],
		ignores: [
			'node_modules',
			'dist',
			'pnpm-lock.yaml',
			'routeTree.gen.ts',
			'client/src/components/ui/**/*',
		],
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.serviceworker,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				projectService: true,
			},
		},
		settings: { react: { version: 'detect' } },
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			...prettier.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-require-imports': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-useless-empty-export': 'error',
			'@typescript-eslint/prefer-enum-initializers': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{ allowNumber: true },
			],
			'@typescript-eslint/return-await': 'error',
			'no-console': 'warn',
			'no-await-in-loop': 'error',
			'no-constant-binary-expression': 'error',
			'no-duplicate-imports': 'error',
			'no-new-native-nonconstructor': 'error',
			'no-promise-executor-return': 'error',
			'no-self-compare': 'error',
			'no-template-curly-in-string': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unreachable-loop': 'error',
			'no-unused-private-class-members': 'error',
			'require-atomic-updates': 'error',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: {
						attributes: false,
					},
				},
			],
			'@typescript-eslint/consistent-type-definitions': 'off', // Allow both type and interface
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/array-type': [
				'error',
				{
					default: 'array',
				},
			],
		},
	},
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
		],
		files: ['server/src/**/*.{ts,tsx}', 'shared/schemas/**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
		},
		rules: {
			...prettier.rules,
			'no-console': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off', // Allow both type and interface
		},
	},
)
