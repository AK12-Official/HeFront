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
  export const ElMessage: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
  export const ElMessageBox: {
    confirm: (message: string, title?: string, options?: Record<string, unknown>) => Promise<unknown>
    alert: (message: string, title?: string, options?: Record<string, unknown>) => Promise<unknown>
    prompt: (message: string, title?: string, options?: Record<string, unknown>) => Promise<unknown>
  }
  export const ElNotification: {
    success: (options: Record<string, unknown>) => void
    error: (options: Record<string, unknown>) => void
    warning: (options: Record<string, unknown>) => void
    info: (options: Record<string, unknown>) => void
  }
  // 等等...
}

declare module 'element-plus/dist/index.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

//该文件用于处理编辑器堆ep的报错
