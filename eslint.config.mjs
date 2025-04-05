import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: { globals: globals.browser },
		plugins: { js },
		extends: ["js/recommended"],
		rules: {
			"indent": ["error", "tab"],
			"max-len": ["warn", { "code": 80 }],
		}
	},
]);
