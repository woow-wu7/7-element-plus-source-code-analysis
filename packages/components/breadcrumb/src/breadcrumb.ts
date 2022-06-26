import { buildProps, iconPropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Breadcrumb from './breadcrumb.vue'

// 1
// buildProps
// export const buildProps = <
//   Props extends Record<
//     string,
//     | { [epPropKey]: true }
//     | NativePropType
//     | EpPropInput<any, any, any, any, any>
//   >
// >(
//   props: Props
// ): {
//   [K in keyof Props]: IfEpProp<
//     Props[K],
//     Props[K],
//     IfNativePropType<Props[K], Props[K], EpPropConvert<Props[K]>>
//   >
// } =>
//   fromPairs(
//     Object.entries(props).map(([key, option]) => [
//       key,
//       buildProp(option as any, key),
//     ])
//   ) as any


// props
// - separator
// - separator-icon
//   - 在element2中是传入的 separator separator-class
export const breadcrumbProps = buildProps({
  separator: {
    type: String,
    default: '/',
  },
  separatorIcon: {
    type: iconPropType,
    default: '',
  },
} as const)

// 导出两个 type
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>
