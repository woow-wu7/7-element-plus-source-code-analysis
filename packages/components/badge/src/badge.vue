<template>
  <div :class="ns.b()">
    <slot />
    <transition :name="`${ns.namespace.value}-zoom-in-center`">
      <sup
        v-show="!hidden && (content || isDot)"
        :class="[
          ns.e('content'),
          ns.em('content', type), // eg: el-badge__content--primary
          ns.is('fixed', !!$slots.default),
          ns.is('dot', isDot),
        ]"
        v-text="content"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { isNumber } from '@element-plus/utils'
import { badgeProps } from './badge'


defineOptions({
  name: 'ElBadge',
})

const props = defineProps(badgeProps)

const ns = useNamespace('badge')

// 这里 elementPlus 比 element 做的好，因为这里限制成了string，而不是string和number不确定的类型
const content = computed<string>(() => {
  if (props.isDot) return ''

  if (isNumber(props.value) && isNumber(props.max)) {
    return props.max < props.value ? `${props.max}+` : `${props.value}`
  }
  return `${props.value}`
})

defineExpose({
  /** @description badge content */
  content,
})


// 1
// props
// | 属性   | 描述                            | 类型                                                  | 可选值 | 默认值 |
// | ------ | ------------------------------- | --------------------------------------------------- | ------ | ------ |
// | value  | 显示值                          | string/number                                         | -      | ''     |
// | max    | 最大值，超过最大值会显示 {max}+，max 生效的前提是 value 是 number 类型 | number               | -      | number |
// | is-dot | 是否显示小圆点                  | boolean                                                | -      | false  |
// | hidden | 是否隐藏 Badge                  | boolean                                               | -      | false  |
// | type   | badge 类型                      | 'primary' / 'success' / 'warning' / 'danger' / 'info' | -      | -      |

// 2
// sub 下标
// sup 上标
</script>
