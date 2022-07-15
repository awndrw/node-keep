module.exports = {
	$schema: 'http://json.schemastore.org/eslintrc',
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	rules: {
		'prefer-arrow-callback': ['warn'],
		'comma-spacing': ['error'],
		'no-multi-spaces': ['error'],
		'no-trailing-spaces': ['error'],
		'@typescript-eslint/semi': ['warn'],
		'@typescript-eslint/member-delimiter-style': ['warn'],
		'prefer-const': 'error',
		'no-unused-vars': 'off',
		'no-cond-assign': ['error', 'always'],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ ignoreRestSiblings: true },
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/consistent-type-imports': ['error'],
		'tsdoc/syntax': 'warn',
		'prettier/prettier': 'error',
	},
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'no-undef': 'off',
			},
		},
	],
};
