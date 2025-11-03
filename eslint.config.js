// eslint.config.js
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    // JavaScript向け基本ルールセット
    eslint.configs.recommended,

    // TypeScriptサポート
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            // セミコロン必須ルール
            'semi': ['error', 'always'],

            // お好みの追加例
            'quotes': ['warn', 'single'],
            'indent': ['error', 2],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn'],
        },
    },
]
