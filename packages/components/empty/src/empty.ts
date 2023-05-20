import type { ExtractPropTypes } from 'vue'
import type Empty from './empty.vue'

export const emptyProps = {
  image: {
    type: String,
    default: '',
  },
  imageSize: Number,
  description: {
    type: String,
    default: '',
  },
} as const

// 1
// ExtractPropTypes
// - 1. 从运行时的 props 选项对象中提取 props 类型。提取到的类型是面向内部的，也就是说组件接收到的是解析后的 props
// - 2. 这意味着 boolean 类型的 props 和带有默认值的 props 总是一个定义的值，即使它们不是必需的
// - 3.列子
// const propsOptions = {
//   foo: String,
//   bar: Boolean,
//   baz: {
//     type: Number,
//     required: true
//   },
//   qux: {
//     type: Number,
//     default: 1
//   }
// } as const
// type Props = ExtractPropTypes<typeof propsOptions>
// // {
// //   foo?: string,
// //   bar: boolean,
// //   baz: number,
// //   qux: number
// // }

// 内部 ExtractPropTypes<T> --------- 组件接收到的是解析后的 props, 即 ( 不一定全部接受父组件传递的props )
// 外部 ExtractPublicPropTypes<T> --- 父组件允许传递的 props
// - extract 是提取的意思

export type EmptyProps = ExtractPropTypes<typeof emptyProps>
// EmptyProps
// 相当于
// {
//   image: String,
//   imageSize?: number,
//   description: string,
// }


// 2
// InstanceType
// - 获取构造函数类型的实例类型
// - 是 typescript 内置工具类型
// - InstanceType的实现
// type InstanceType<T extends new (...args: any[]) => any> = T extends new (
//    ...args: any[]
// ) => infer R
//    ? R
//    : never;
export type EmptyInstance = InstanceType<typeof Empty>
