<template>
  <span :class="ns.e('item')">
    <span
      ref="link"
      :class="[ns.e('inner'), ns.is('link', !!to)]"
      role="link"
      @click="onClick"
    >
      <slot />
    </span>
    <el-icon v-if="separatorIcon" :class="ns.e('separator')">
      <component :is="separatorIcon" />
    </el-icon>
    <span v-else :class="ns.e('separator')" role="presentation">
      {{ separator }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, ref, toRefs } from 'vue'
import ElIcon from '@element-plus/components/icon'
import { breadcrumbKey } from '@element-plus/tokens'
import { useNamespace } from '@element-plus/hooks'
import { breadcrumbItemProps } from './breadcrumb-item'

import type { Router } from 'vue-router'

defineOptions({
  name: 'ElBreadcrumbItem',
})

// 1
// props
// - to
// - replace
const props = defineProps(breadcrumbItemProps)

// 2
// getCurrentInstance()!
// - 作用：
//  - 1. 获取当前组件实例
//  - 2. ! 表示非空断言，去除 undefined 和 null
// - 使用：
//  - getCurrentInstance 只能在 ( setup ) 或 ( 生命周期钩子 ) 中调用
// - 官网
//  - https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance
const instance = getCurrentInstance()!

// 3
// inject
// - provide(breadcrumbKey, props)

// 4
// breadcrumbKey
// - export const breadcrumbKey: InjectionKey<BreadcrumbProps> = Symbol('breadcrumbKey')
const breadcrumbContext = inject(breadcrumbKey, undefined)!

const ns = useNamespace('breadcrumb')

// toRefs
// - 将 inject 转成响应式，因为 provide/inject不保证响应式
const { separator, separatorIcon } = toRefs(breadcrumbContext)

// instance.appContext.config.globalProperties
// - 作用：获取全局配置属性
// - 获取router实例：instance.appContext.config.globalProperties.$router
const router = instance.appContext.config.globalProperties.$router as Router

const link = ref<HTMLSpanElement>()

const onClick = () => {
  if (!props.to || !router) return
  props.replace ? router.replace(props.to) : router.push(props.to)
}

// ----
// 内置组件
// 1. 内置组件有哪些？
//    - keep-alive transition transition-group teleport component
// 2. 特点
//    - tree-shake: 只有在被使用的时才会被引入

// ----
// component
// - props
//  - is: string | Component | VNode
//  - is: is 的值是一个字符串，它既可以是 ( HTML标签名 ) 也可以是 ( 组件名 )。
// - 用法
//  - 渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。
//  - 在本组件中，通过 ICON名 来渲染 ICON组件
</script>
