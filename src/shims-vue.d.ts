/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// 为基于 @ 别名的导入提供类型支持
declare module '@/views/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}


declare module 'element-plus' {

  export const ElNotification: any;
  export const ElMessage: any;
  // 可以添加更多组件
}

// 为全局变量提供类型声明
declare const __APP_TITLE__: string


//用该文件处理一些奇怪的编译器报错
