import "@/assets/styles/index.scss";
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn' //配置国际化 引入中文语言包
import router from '@/router' //引入路由器对象
import 'element-plus/dist/index.css';
import pinia from "./store";

const app = createApp(App);
app.use(pinia)
//安装ElementPlus插件
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router) //安装路由器对象
app.mount('#app')
