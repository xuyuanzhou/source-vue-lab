// 前端规则基线：ESLint 只管语言与 Vue 的正确性，行内格式全部交给 Prettier，
// 两者重叠的规则由 eslint-config-prettier 关闭，避免同一处报两次。
// 与各 React 前端仓同构，差别只在「React Hooks 规则」换成「SFC 解析与模板必备规则」——
// 本模块是 Vue 运行时（见 ADR-0020），模板里的变量绑定要能被静态查出未定义。
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // .history 是编辑器本地历史副本，@mf-types 是 Federation 构建期生成的类型产物：两者都不参与门禁。
  // content 是课文正文、mini-vue 是可跑的小实验源码，都不按本仓代码风格要求。
  { ignores: ['dist', 'coverage', '.history', '@mf-types', 'content', 'mini-vue', 'scripts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      // 本模块里 Sidebar / SourcePanel 一类单词组件名是刻意的：名字来自 Lab 既有结构。
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      // 相等判断必须写全，`== null` 例外：它同时判 null 与 undefined，是刻意的写法。
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      // 非空断言在 Lab 源码里是刻意的：数组下标访问与可选参数的收窄都靠它。
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Lab 源码用 any 收口 markdown-it / highlight.js 的第三方形状。
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // 页面与模块代码跑在浏览器里。
    files: ['src/**/*.{ts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  {
    // 构建期脚本与配置文件跑在 Node 上。
    files: ['**/*.{js,mjs,cjs}', '*.config.ts'],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier,
)
