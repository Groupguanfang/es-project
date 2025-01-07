import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'es-project',
  description: '模版项目克隆工具。',
  themeConfig: {
    nav: [
      { text: '快速开始', link: '/docs/quick-start' },
      { text: '模版市场', link: '/template-market' },
    ],

    sidebar: {
      '/docs': [
        { text: '快速开始', link: '/docs/quick-start' },
        { text: '创建模版', link: '/docs/create-template' },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/groupguanfang/es-project' },
    ],
  },

  vite: {
    plugins: [
      UnoCSS(),
    ],
  },
})
