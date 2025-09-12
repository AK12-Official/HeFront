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
        // 默认API代理
        [env.VITE_APP_API_URL]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            // 记录代理请求
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const fullTargetUrl = `${options.target}${req.url}`;
              console.log('\x1b[34m%s\x1b[0m', '------- 代理请求信息 -------');
              console.log('\x1b[36m%s\x1b[0m', `原始请求: ${req.method} ${req.url}`);
              console.log('\x1b[32m%s\x1b[0m', `转发到: ${fullTargetUrl}`);

              // 记录请求头信息
              console.log('\x1b[33m%s\x1b[0m', '请求头:');
              Object.keys(proxyReq.getHeaders()).forEach(key => {
                console.log(`  ${key}: ${proxyReq.getHeader(key)}`);
              });
            });

            // 记录代理响应
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('\x1b[34m%s\x1b[0m', '------- 代理响应信息 -------');
              console.log('\x1b[36m%s\x1b[0m', `请求: ${req.method} ${req.url}`);
              console.log('\x1b[35m%s\x1b[0m', `状态码: ${proxyRes.statusCode}`);
              console.log('\x1b[33m%s\x1b[0m', `内容类型: ${proxyRes.headers['content-type'] || '未知'}`);
            });

            // 记录代理错误
            proxy.on('error', (err, req, res) => {
              console.log('\x1b[31m%s\x1b[0m', '------- 代理错误 -------');
              console.log('\x1b[31m%s\x1b[0m', `请求失败: ${req.method} ${req.url}`);
              console.log('\x1b[31m%s\x1b[0m', `错误: ${err.message}`);

              // 尝试创建目标URL
              try {
                if (typeof options.target === 'string') {
                  //@ts-expect-error：类型限定 不管他先
                  const targetUrl = new URL(req.url, options.target);
                  console.log('\x1b[31m%s\x1b[0m', `尝试访问: ${targetUrl.toString()}`);
                } else {
                  console.log('\x1b[31m%s\x1b[0m', `无法构建目标URL: options.target 未定义`);
                }
              } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', `无法构建目标URL`);
              }
            });
          }
        },
        // 电商管理后台API代理
        '/api/admin': {
          target: env.VITE_MALL_ADMIN_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/admin/, '/admin'),
        },
        // 电商搜索功能API代理
        '/api/esProduct': {
          target: env.VITE_MALL_SEARCH_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // 电商前台门户API代理
        '/api/cart': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/order': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/member': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/alipay': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/product': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/home': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/returnApply': {
          target: env.VITE_MALL_PORTAL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
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


