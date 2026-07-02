import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { globalIgnores } from "eslint/config"

export default tseslint.config([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"no-restricted-syntax": [
				"error",
				{
					selector: "VariableDeclaration[kind=\"let\"]",
					message: "Использование `let` запрещено. Используйте `const`; если значение действительно должно переприсваиваться, пересмотрите подход (например, вынесите логику в функцию или используйте `reduce`).",
				},
			],
		},
	},
])
