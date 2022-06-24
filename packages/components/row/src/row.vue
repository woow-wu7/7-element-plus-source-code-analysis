<template>
  <component
    :is="tag"
    :class="[
      ns.b(),
      ns.is(`justify-${props.justify}`, justify !== 'start'),
      ns.is(`align-${props.align}`, align !== 'top'),
    ]"
    :style="style"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { rowContextKey } from '@element-plus/tokens'
import { rowProps } from './row'
import type { CSSProperties } from 'vue'

// 1
// defineOptions
// - 是一个插件 unplugin-vue-define-options
// - 官网：https://github.com/sxzz/unplugin-vue-define-options
// - 文章：https://segmentfault.com/a/1190000021945187
// - 作用：定义options
//  - 1. 就不用每次 defineProps 和 defineEmits 了
//  - 2. 还可定义其他选项
// defineOptions({
//   name: 'Foo',
//   inheritAttrs: false,
//   props: {
//     msg: { type: String, default: 'bar' },
//   },
//   emits: ['change', 'update'],
// })

// 2
// inheritAttrs
// - 把 $attrs 对象上没在子组件 props 中声明的属性加在子组件的根 html 标签上

// 3
// 重要改变
// - element-plus 里把 element2 中的 theme-chalk 整个换成了函数的形式，然后直接注入到标签上

defineOptions({
  name: 'ElRow',
})

const props = defineProps(rowProps)

const ns = useNamespace('row')
const gutter = computed(() => props.gutter)

// 像 el-col 中注入 gutter
provide(rowContextKey, {
  gutter,
})

const style = computed(() => {
  const styles: CSSProperties = {}
  if (!props.gutter) {
    return styles
  }

  styles.marginRight = styles.marginLeft = `-${props.gutter / 2}px`
  return styles
})
</script>
