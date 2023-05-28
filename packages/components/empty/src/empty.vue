<template>
  <div :class="ns.b()">
    <div :class="ns.e('image')" :style="imageStyle">
      <img v-if="image" :src="image" ondragstart="return false" />
      <slot v-else name="image">
        <img-empty />
      </slot>
    </div>

    <!-- description 可以是属性出入的字符串，也可以是slot传入 -->
    <div :class="ns.e('description')">
      <slot v-if="$slots.description" name="description" />
      <p v-else>{{ emptyDescription }}</p>
    </div>
    <div v-if="$slots.default" :class="ns.e('bottom')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale, useNamespace } from '@element-plus/hooks'
import ImgEmpty from './img-empty.vue'
import { emptyProps } from './empty'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElEmpty',
})

const props = defineProps(emptyProps)

const { t } = useLocale()
const ns = useNamespace('empty')
const emptyDescription = computed(
  () => props.description || t('el.table.emptyText') // 18n
)
const imageStyle = computed<CSSProperties>(() => ({
  width: props.imageSize ? `${props.imageSize}px` : '',
}))

// 1
// 禁止鼠标拖动图片 ondragstart="return false"
// 禁止树鼠标右键保存图片 oncontextmenu="return false"
// img v-if="image" :src="image" ondragstart="return false" />

// 2
// export const emptyProps = {
//   image: {
//     type: String,
//     default: '',
//   },
//   imageSize: Number,
//   description: {
//     type: String,
//     default: '',
//   },
// } as const
</script>
