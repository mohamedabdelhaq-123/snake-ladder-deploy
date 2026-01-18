// eslint.config.js
// eslint-disable-next-line no-undef
module.exports = [
	{
		files: ["**/*.js"],
		ignores: ["node_modules/**", "dist/**", "build/**"],

		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				window: "readonly",
				document: "readonly",
				console: "readonly",
				fetch: "readonly",
			},
		},

		rules: {
			// Prevent bugs
			"no-debugger": "error",
			"no-duplicate-case": "error",
			"no-extra-semi": "error",
			"no-unreachable": "error",
			"no-unused-vars": ["error", {
				varsIgnorePattern: "^[A-Z][a-z]",
				argsIgnorePattern: "^_"
			}],
			"no-undef": "error",

			// Code quality
			"eqeqeq": ["error", "always"],
			"no-eval": "error",
			"no-var": "error",
			"curly": ["error", "all"],

			// Formatting
			"indent": ["error", "tab"],
			"quotes": ["error", "double", { avoidEscape: true }],
			"semi": ["error", "always"],
			"no-trailing-spaces": "error",
			"keyword-spacing": "error",
		},
	},
];