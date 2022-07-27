<template>
  <div
    :class="[ns.b(), ns.m(direction)]"
    :style="dividerStyle"
    role="separator"
  >
    <div
      v-if="$slots.default && direction !== 'vertical'"
      :class="[ns.e('text'), ns.is(contentPosition)]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { dividerProps } from './divider'
import type { CSSProperties } from 'vue'

// 1
// defineOptions
// - 是 unplugin-vue-define-options 依赖，用来定义组件名
defineOptions({
  name: 'ElDivider',
})

// 2
// dividerProps
// - direction: 设置分割线方向 ---------------- string -> horizontal / vertical
// - border-style: 设置分隔符样式 ------------- string
// - content-position: 自定义分隔线内容的位置 -- string

// export const dividerProps = buildProps({
//   direction: {
//     type: String,
//     values: ['horizontal', 'vertical'],
//     default: 'horizontal',
//   },
//   contentPosition: {
//     type: String,
//     values: ['left', 'center', 'right'],
//     default: 'center',
//   },
//   borderStyle: {
//     type: definePropType<BorderStyle>(String),
//     default: 'solid',
//   },
// } as const)
const props = defineProps(dividerProps)

const ns = useNamespace('divider')
// ns

// (1)
// ns.b = _bem(unref(namespace), block, blockSuffix, '', '') = 'el-divider'

// (2)
// ns.m = _bem(unref(namespace), block, '', '', modifier) = 'el-divider--direction'
// - 注意 direction 是 props 中的属性


const dividerStyle = computed(() => {

  // ns.cssVar
  // 相当于下面的一个对象
  // {
  //   '--el-border-style':  props.borderStyle,
  // }
  return ns.cssVar({
    'border-style': props.borderStyle,
  }) as CSSProperties
})
</script>
