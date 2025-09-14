/* eslint-disable @typescript-eslint/no-unused-vars */
import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  const useMock = env.VITE_USE_MOCK === 'true'


  return {
    plugins: [
      vue(),
      vueDevTools(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_APP_TITLE: env.VITE_APP_TITLE || '越分享，越丰盈'
          }
        }
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: mode === 'development' && useMock, // 只有在开发环境且开启 MOCK 时启用
        watchFiles: true,
        logger: true,
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        // 后台管理API代理 - 使用/ht前缀
        '/ht': {
          target: env.VITE_MALL_ADMIN_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ht/, ''),
          configure: (proxy, options) => {
            // 记录代理请求
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const fullTargetUrl = `${options.target}${req.url}`;
              console.log('\x1b[34m%s\x1b[0m', '------- 后台管理代理请求 -------');
              console.log('\x1b[36m%s\x1b[0m', `原始请求: ${req.method} ${req.url}`);
              console.log('\x1b[32m%s\x1b[0m', `转发到: ${fullTargetUrl}`);
              console.log('\x1b[33m%s\x1b[0m', `目标服务器: ${options.target}`);
            });

            // 记录代理响应
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('\x1b[34m%s\x1b[0m', '------- 后台管理代理响应 -------');
              console.log('\x1b[36m%s\x1b[0m', `请求: ${req.method} ${req.url}`);
              console.log('\x1b[35m%s\x1b[0m', `状态码: ${proxyRes.statusCode}`);
            });

            // 记录代理错误
            proxy.on('error', (err, req, res) => {
              console.log('\x1b[31m%s\x1b[0m', '------- 后台管理代理错误 -------');
              console.log('\x1b[31m%s\x1b[0m', `请求失败: ${req.method} ${req.url}`);
              console.log('\x1b[31m%s\x1b[0m', `错误: ${err.message}`);
              console.log('\x1b[31m%s\x1b[0m', `目标服务器: ${options.target}`);
            });
          }
        },
        // 前台门户API代理 - 使用/qt前缀
        '/qt': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/qt/, ''),
          configure: (proxy, options) => {
            // 记录代理请求
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const fullTargetUrl = `${options.target}${req.url}`;
              console.log('\x1b[34m%s\x1b[0m', '------- 前台门户代理请求 -------');
              console.log('\x1b[36m%s\x1b[0m', `原始请求: ${req.method} ${req.url}`);
              console.log('\x1b[32m%s\x1b[0m', `转发到: ${fullTargetUrl}`);
              console.log('\x1b[33m%s\x1b[0m', `目标服务器: ${options.target}`);
            });

            // 记录代理响应
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('\x1b[34m%s\x1b[0m', '------- 前台门户代理响应 -------');
              console.log('\x1b[36m%s\x1b[0m', `请求: ${req.method} ${req.url}`);
              console.log('\x1b[35m%s\x1b[0m', `状态码: ${proxyRes.statusCode}`);
            });

            // 记录代理错误
            proxy.on('error', (err, req, res) => {
              console.log('\x1b[31m%s\x1b[0m', '------- 前台门户代理错误 -------');
              console.log('\x1b[31m%s\x1b[0m', `请求失败: ${req.method} ${req.url}`);
              console.log('\x1b[31m%s\x1b[0m', `错误: ${err.message}`);
              console.log('\x1b[31m%s\x1b[0m', `目标服务器: ${options.target}`);
            });
          }
        },
        // 腾讯位置服务API代理
        '/tx-api': {
          target: 'https://apis.map.qq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tx-api/, '/ws/district/v1'),
        },
      }
    },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
      __USE_MOCK__: JSON.stringify(useMock),
    }
  }
});


