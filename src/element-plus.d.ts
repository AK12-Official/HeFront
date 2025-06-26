declare module 'element-plus/es/locale/lang/zh-cn' {
  const zhCn
  export default zhCn
}

declare module 'element-plus' {
  import { Component } from 'vue'

  const ElementPlus: {
    install: (app, ...options) => void
    version: string
  }

  export default ElementPlus

  // 可以根据需要添加更多类型
  export const ElButton: Component
  export const ElInput: Component
  // 等等...
}

declare module 'element-plus/dist/index.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

//该文件用于处理编辑器堆ep的报错
