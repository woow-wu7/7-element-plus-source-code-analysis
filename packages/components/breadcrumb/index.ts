import { withInstall, withNoopInstall } from '@element-plus/utils'

import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'

export const ElBreadcrumb = withInstall(Breadcrumb, {
  BreadcrumbItem,
}) // 注册 Breadcrumb 和 BreadcrumbItem

export const ElBreadcrumbItem = withNoopInstall(BreadcrumbItem) // 单独将 ElBreadcrumbItem 注册成空函数
export default ElBreadcrumb

export * from './src/breadcrumb'
export * from './src/breadcrumb-item'
