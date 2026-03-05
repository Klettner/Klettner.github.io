import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ["**/.astro/**", "**/dist/**", "**/node_modules/**"],
  },
  // Base recommended configurations for JS/TS
  ...tseslint.configs.recommended,
  // Base recommended configurations for Astro
  ...eslintPluginAstro.configs['flat/recommended'],
  
  // Apply TypeScript rules to Astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  // Prettier config must be last to disable formatting rules that might conflict
  eslintConfigPrettier,
);
