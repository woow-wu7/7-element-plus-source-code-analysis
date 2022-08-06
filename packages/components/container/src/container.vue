<template>
  <section :class="[ns.b(), ns.is('vertical', isVertical)]">
    <slot />
  </section>
</template>
<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { useNamespace } from '@element-plus/hooks'

import type { Component, VNode } from 'vue'

defineOptions({
  name: 'ElContainer',
})
const props = defineProps({
  direction: {
    type: String,
  },
})
const slots = useSlots()

const ns = useNamespace('container')

const isVertical = computed(() => {
  if (props.direction === 'vertical') {
    return true
  } else if (props.direction === 'horizontal') {
    return false
  }

  // 没传 direction 时，继续往下
  // default存在
  if (slots && slots.default) {
    const vNodes: VNode[] = slots.default()
    return vNodes.some((vNode) => {
      const tag = (vNode.type as Component).name
      return tag === 'ElHeader' || tag === 'ElFooter' // 包含 header 或 footer，vertical竖直排列
    })
  } else {
    // default 不存在
    return false
  }
})
</script>
