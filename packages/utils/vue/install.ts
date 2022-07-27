import { NOOP } from '@vue/shared'

import type { App } from 'vue'
import type { SFCInstallWithContext, SFCWithInstall } from './typescript'


// 1
// 插件
// - 类型：
//  - object ----> 一个具有 ( install方法的对象 ) ---- 参数 install(app, options)
//  - function --> 或者是一个 ( function ) ---------- 参数 function(app, options)
// - 参数：
//  - app -------> createApp 生成的 app 对象，app中包含了 ( component, provide, directive, mixin, config ) 等很多属性
//  - options ---> 用户传入的选项
// - 使用插件
//  - const app = createApp(Root)
//  - app.use(插件名称）


// 2
// export type SFCWithInstall<T> = T & Plugin
// - 即插件类型 和 T 类型的 ( 交叉类型 )

// 3
// Record
// - Record 是 typescript 中的一种工具类
// - Record<Keys， Type>
//   - keys: 表示对象的 ( 属性键 )
//   - type: 表示对象的 ( 属性值 )
//   - 用于将 ( 一种类型属性 ) 映射到 ( 另一种类型 )
// ---
// 例1
// type roles = 'tester' | 'developer' | 'manager'
// const staffCount: Record<roles, number> = {
//   tester: 10,
//   developer: 20,
//   manager: 1
// }
// 表示：roles联合类型的每个 (属性值) 的类型都是number
// ---
// 例2
// interface Staff { name: string; salary: number;}
// type StaffJson = Record<keyof Staff, string>; // keyof获取interface的所有属性名的联合类型
// const product: StaffJson = {
//   name: "John",
//   salary: "3000",
// };
// 表示：interface中的所有属性名的联合类型中的 ( 每个属性的属性值 ) 的类型是 string
// ---
// - type Record<K extends string | number | symbol, T> = { [P in K]: T; }


// 4
// extends
// - 表示继承，案例如下
// interface Shape {
//   color: string;
// }
// interface Square extends Shape { // 接口继承接口后，就具有了接口中的属性类型
//   sideLength: number;
// }
// let square = <Square>{};
// square.color = "blue";
// square.sideLength = 10;


// withInstall
// - 从命名上就知道是注册组件，的同时返回组件
export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp) // ----- 注册组件
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp // --------- 当一个组件中，有多个组件导出时，将额外导出的组件绑定在默认导出的组件上
    }
  }
  return main as SFCWithInstall<T> & E // --- 返回组件
}


// - SFCInstallWithContext
// export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
//   _context: AppContext | null
// }

// withInstallFunction
// - 函数组件
export const withInstallFunction = <T>(fn: T, name: string) => {
  ;(fn as SFCWithInstall<T>).install = (app: App) => {
    ;(fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}

// withInstallDirective
// - 指令
export const withInstallDirective = <T>(directive: T, name: string) => {
  ;(directive as SFCWithInstall<T>).install = (app: App): void => {
    app.directive(name, directive)
  }

  return directive as SFCWithInstall<T>
}

// withNoopInstall
// - 空函数
export const withNoopInstall = <T>(component: T) => {
  ;(component as SFCWithInstall<T>).install = NOOP

  return component as SFCWithInstall<T>
}
