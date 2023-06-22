<template>
  <div :class="ns.b()" role="tablist" aria-multiselectable="true">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, watch } from 'vue'
import { ensureArray } from '@element-plus/utils'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useNamespace } from '@element-plus/hooks'
import { collapseContextKey } from '@element-plus/tokens'
import { collapseEmits, collapseProps } from './collapse'
import type { CollapseActiveName } from './collapse'

defineOptions({
  name: 'ElCollapse',
})


// export const collapseProps = buildProps({
//   accordion: Boolean, // 是否手风琴
//   modelValue: {
//     type: definePropType<CollapseModelValue>([Array, String, Number]),
//     default: () => mutable([] as const),
//   },
// } as const)
const props = defineProps(collapseProps) // accordion modelValue


// export const collapseEmits = {
//   [UPDATE_MODEL_EVENT]: emitChangeFn, // 'update:modelValue
//   [CHANGE_EVENT]: emitChangeFn, // 'change'
// }
// 1
// export const emitChangeFn = (value: CollapseModelValue) =>
//   typeof isNumber(value) || isString(value) || Array.isArray(value)
// 2
// export const UPDATE_MODEL_EVENT = 'update:modelValue'
// export const CHANGE_EVENT = 'change'
// export const INPUT_EVENT = 'input'

const emit = defineEmits(collapseEmits) // 'update:modelValue' 'change'

const ns = useNamespace('collapse')


// export const ensureArray = <T>(arr: Many<T>): T[] => {
//   if (!arr && (arr as any) !== 0) return []
//   return Array.isArray(arr) ? arr : [arr] // 都转成数组，因为 module-value存在两种类型: 手风琴时string，其他是array
// }
const activeNames = ref(ensureArray(props.modelValue))

const setActiveNames = (_activeNames: CollapseActiveName[]) => {
  activeNames.value = _activeNames
  const value = props.accordion ? activeNames.value[0] : activeNames.value
  emit(UPDATE_MODEL_EVENT, value) // 'update:modelValue'
  emit(CHANGE_EVENT, value) // 'change'，支持change回调，参数就是当前展开的 name 数组，或者手风琴模式下的该name
}

// handleItemClick
// - export type CollapseActiveName = string | number
// - name: 指的是 <el-collapse-item name="1"> 的 name 属性
const handleItemClick = (name: CollapseActiveName) => {
  // 手风琴模式
  if (props.accordion) {
    setActiveNames([
      (activeNames.value[0] || activeNames.value[0] === 0) &&
      activeNames.value[0] === name
        ? ''
        : name,
    ])
  } 
  // 非手风琴模式
  else {
    const _activeNames = [...activeNames.value] // 浅浅拷贝
    const index = _activeNames.indexOf(name)

    if (index > -1) {
      _activeNames.splice(index, 1) // 已经存在，则删除，- 为了触发收起动画
    } else {
      _activeNames.push(name) // 不存在，添加
    }
    setActiveNames(_activeNames) // 响应式
  }
}

// change回调，本身也可以去修改传入的 module-value
watch(
  () => props.modelValue,
  () => (activeNames.value = ensureArray(props.modelValue)), 
  { deep: true }
)

// export const collapseContextKey: InjectionKey<CollapseContext> =
//   Symbol('collapseContextKey')
provide(collapseContextKey, {
  activeNames,
  handleItemClick,
})


defineExpose({
  /** @description active names */
  activeNames,
  /** @description set active names */
  setActiveNames,
})
</script>
