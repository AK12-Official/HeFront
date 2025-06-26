import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_APP_TITLE: env.VITE_APP_TITLE
          }
        }
      }),
      viteMockServe({
        // mock 文件夹地址，默认为根目录下的 mock 文件夹
        mockPath: 'mock',
        enable: mode === 'development', // 开发环境启用
        watchFiles: true, // 监视 mock 文件夹内文件变化
        logger: true, // 是否在控制台显示请求日志
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {     //代理跨域
      proxy: {
        [env.VITE_APP_API_URL]: {
          target: env.VITE_SERVE, // 使用环境变量-暂时未配置，开发期间会先用mock代替
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE), // 注入全局变量
    }
  }

})


