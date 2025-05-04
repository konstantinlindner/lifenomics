import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylistic,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	{
		ignores: [
			'**/dist',
			'eslint.config.mjs',
			'client/vite.config.ts',
			'client/postcss.config.js',
			'client/tailwind.config.js',
			'client/src/components/ui',
		],
	},
	{
		files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks,
		},
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: [
					'client/tsconfig.json',
					'client/tsconfig.node.json',
					'server/tsconfig.json',
				],
			},
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
		},
		settings: { react: { version: 'detect' } },
		rules: {
			...eslint.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...prettier.rules,
			'no-undef': 'off', // not needed with typescript
			'no-unused-vars': 'off', // doesn't work for function parameters defined in a type
			'react/react-in-jsx-scope': 'off', // not required in newer versions of react
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
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/array-type': [
				'error',
				{
					default: 'array',
				},
			],
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/consistent-type-imports': 'off', // not needed
			'@typescript-eslint/explicit-function-return-type': 'off', // implicit is okay
			'@typescript-eslint/explicit-module-boundary-types': 'off', // implicit is okay
			'@typescript-eslint/explicit-member-accessibility': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'off', // not needed
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
		},
	},
)
