import { NOOP } from '@vue/shared'

import type { App } from 'vue'
import type { SFCInstallWithContext, SFCWithInstall } from './typescript'


// 1
// 插件
// - 类型:
//  - object ----> 一个具有 ( install方法的对象 ) ---- 参数 install(app, options)
//  - function --> 或者是一个 ( function ) ---------- 参数 function(app, options)
// - 参数:
//  - app -------> createApp 生成的 app 对象，app中包含了 ( component,config,mixin,directive,provide,use,mount,unmount ) 等属性
//  - options ---> 用户传入的选项
// - 使用插件:
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

// 5
// app.component()
// 1.如果同时传递一个 ( 组件名字符串 )，( 及其定义 )，则 ( 注册一个全局组件 ) ---- 存
// 2.如果 ( 只传递一个名字 )，则会返回用该名字注册的组件 (如果存在的话) ---------- 取

// 1
// withInstall
// - 从命名上就知道是注册组件，的同时返回组件
// - effect: install component and return component
// - advantage:
//   - 1. 注册插件: 比如 breadcrumb 和 breadcrumb-item，利用 withInstall 在单独注册插件时，只需要 app.use(breadcrumb) 而不用再写 app.use(breadcrumb.item)
//   - 2. 使用组件: 在 Breadcrumb.BreadcrumbItem 就可以调用到 BreadcrumbItem

export const withInstall = <T, E extends Record<string, any>>(
  // 1
  // E extends Record<string, any>
  // 表示 ( 对象 E ) 的 ( key是string类型 )，( value是any类型 )
  main: T,
  extra?: E
) => {

  // 2
  // () 和 []
  // - 在用js结尾不加分号的写法时，小括号() 或 中括号[] 开头的前一条语句，需要加上分号

  // 3
  // SFC 是 vue 的语法规范
  // export type SFCWithInstall<T> = T & Plugin
  ;(main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp) // ----- 注册全局组件
      // app.component()
      // 1.如果同时传递一个 ( 组件名字符串 )，( 及其定义 )，则 ( 注册一个全局组件 ) ---- 存
      // 2.如果 ( 只传递一个名字 )，则会返回用该名字注册的组件 (如果存在的话) ---------- 取
    }
  }

  // 注意: 上面的for只是注册 main 和 extra 中的所有组件
  // 当一个组件中，有多个组件导出时，将额外导出的组件绑定在默认导出的组件上
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }

  // 返回组件
  return main as SFCWithInstall<T> & E
}

// withInstallFunction
// - 函数组件
// - 作用
//   - 1.当 组件 是 函数类型 时 ( 比如Message )，注册为Vue插件
//   - 2.把 该组件 册能够被应用内所有组件实例访问到的 全局属性的对象 上，在任意 ( 组件模版 ) 和 ( 组件实例 ) 上都能访问到
// - app.config.globalProperties
//   - 一个用于注册能够被应用内所有组件实例访问到的全局属性的对象
//   - 这是对 Vue 2 中 Vue.prototype 使用方式的一种替代，此写法在 Vue 3 已经不存在了
//   - 如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级
//   - 示例
//     - app.config.globalProperties.msg = 'hello'
//     - 1.这使得 msg 在应用的任意组件模板上都可用
//     - 2.并且也可以通过任意组件实例的 this 访问到 => this.msg
// - app._context
//     - app 上下文环境 VNode树挂在上面
export const withInstallFunction = <T>(fn: T, name: string) => {
  ;(fn as SFCWithInstall<T>).install = (app: App) => {
    ;(fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}

// - SFCInstallWithContext
// export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
//   _context: AppContext | null
// }

// export type SFCWithInstall<T> = T & Plugin

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
