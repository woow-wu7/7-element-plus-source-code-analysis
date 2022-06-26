import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type BreadcrumbItem from './breadcrumb-item.vue'

// props
// - to
// - replace
export const breadcrumbItemProps = buildProps({
  to: {
    type: definePropType<RouteLocationRaw>([String, Object]),
    default: '',
  },
  replace: {
    type: Boolean,
    default: false,
  },
} as const)

// type
export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>
export type BreadcrumbItemInstance = InstanceType<typeof BreadcrumbItem>
