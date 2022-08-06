<template>
  <!--  :class="ns.b()" 相当于 class="el-breadcrumb" -->
  <div
    ref="breadcrumb"
    :class="ns.b()"
    aria-label="Breadcrumb"
    role="navigation"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import { breadcrumbKey } from '@element-plus/tokens'

import { useNamespace } from '@element-plus/hooks'
import { breadcrumbProps } from './breadcrumb'

defineOptions({
  name: 'ElBreadcrumb',
})

// 1
// props
// - separator
// - separator-icon
//   - 在element2中是传入的 separator separator-class

// export const breadcrumbProps = buildProps({
//   separator: {
//     type: String,
//     default: '/',
//   },
//   separatorIcon: {
//     type: iconPropType,
//     default: '',
//   },
// } as const)

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')


const breadcrumb = ref<HTMLDivElement>()
// ref
// - 注意这里的 ( 变量名 ) 需要和template模版中的 ( ref绑定的值 ) 一样
// - 这里是用来绑定DOM，即 breadcrumb 组件


// 2
// provide
// - 向 el-breadcrumb-item 中注入 props
// - 而props中有 separator separator-icon

// 3
// breadcrumbKey
// - export const breadcrumbKey: InjectionKey<BreadcrumbProps> = Symbol('breadcrumbKey')
provide(breadcrumbKey, props)

// 3
// ref
// - 作用：ref 用来给 ( 元素 ) 或 ( 子组件 ) 注册 ( 引用信息 )，引用信息将被注册到父组件的 $refs 对象上
// - 使用
//  - 1. 作用在普通的DOM元素上：引用指向该DOM元素
//  - 2. 作用在子组件上：引用指向子组件实例
// <p ref="p">hello</p> -------------------------------------------- <!-- vm.$refs.p 会是 DOM 节点 -->
// <child-component ref="child"></child-component> ----------------- <!-- vm.$refs.child 会是子组件实例 -->
// <child-component :ref="(el) => child = el"></child-component> --- <!-- 当动态绑定时，我们可以将 ref 定义为回调函数，显式地传递元素或组件实例 -->
// - 官网
//  - https://v3.cn.vuejs.org/api/special-attributes.html#ref

// 4
// 非空断言 !
// - 作用：后缀表达式操作符 ! 可以用于断言操作对象是 ( 非null 和 非undefined  )类型
// - 具体：typescript -> 非空断言 -> x! 将从 x 值域中排除 null 和 undefined
onMounted(() => {

  const items = breadcrumb.value!.querySelectorAll(`.${ns.e('item')}`)
  // items
  // - 查找所有 el-breadcrumb-item

  // 思考
  // - 这里提供了一种获取所有子元素的方法，即 父元素.querySelectorAll(相同子元素的css选择器)

  // 扩展
  // - document.querySelectorAll()
  // - element.querySelectorAll()
  // - 在 document 和 element 上都部署了 querySelectorAll，所以这里是 el-breadcrumb.querySelectorAll()

  // 扩展
  // 问题：获取所有子元素的方法有哪些？
  // - 1. element.children ----------------------- 当前元素节点的所有子元素，HTMLCollection
  // - 2. Node.childNodes ------------------------ 当前节点的所有子节点，NodeList
  // - 3. element.querySelectorAll(css选择器)

  // 标记
  // - 标记最后一个孩子节点
  // - 作用：标记后，比如可以让最后一个孩子不出现分隔符，设置最后一个元素的颜色，不可点击等
  // - 扩展：除了在父组件上标记，还可以在子组件上通过 :last-child 来标记
  if (items.length) {
    items[items.length - 1].setAttribute('aria-current', 'page')
  }
})
</script>
