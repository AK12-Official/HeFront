import "@/assets/styles/index.scss";
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn' //配置国际化 引入中文语言包
import router from '@/router' //引入路由器对象
import 'element-plus/dist/index.css';
import pinia from "./store";
// 导入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import useMallUserStore from '@/store/modules/mallUser';
// 导入权限指令
import { permission } from '@/directives/permission';

const app = createApp(App);
app.use(pinia)
//安装ElementPlus插件
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router) //安装路由器对象

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册权限指令
app.directive('permission', permission);

// 启动token刷新检查
const mallUserStore = useMallUserStore();
let tokenRefreshTimer: number | null = null;

// 启动定时检查token是否需要刷新
const startTokenRefreshCheck = () => {
  if (tokenRefreshTimer) {
    clearInterval(tokenRefreshTimer);
  }

  // 每5分钟检查一次token是否需要刷新
  tokenRefreshTimer = setInterval(async () => {
    if (mallUserStore.isLoggedIn && mallUserStore.shouldRefreshToken()) {
      console.log('Token即将过期，开始刷新...');
      const success = await mallUserStore.refreshAccessToken();
      if (!success) {
        console.warn('Token刷新失败，用户需要重新登录');
        mallUserStore.mallLogout();
        router.push('/mall/login');
      }
    }
  }, 5 * 60 * 1000); // 5分钟
};

// 页面加载时启动检查
startTokenRefreshCheck();

// 页面可见性变化时重新启动检查
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    startTokenRefreshCheck();
  }
});

app.mount('#app')
