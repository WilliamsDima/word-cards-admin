import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
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
		plugins: {
			react,
		},
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
			"react/forbid-component-props": [
				"error",
				{
					forbid: [
						{
							propName: "style",
							message: "Не используйте инлайн-стили, используйте CSS/модули/styled-компоненты",
						},
					],
				},
			],
			"react/forbid-dom-props": [
				"error",
				{
					forbid: [
						{
							propName: "style",
							message: "Не используйте инлайн-стили, используйте CSS/модули/styled-компоненты",
						},
					],
				},
			],
		},
	},
])
