import { withInstall } from '@element-plus/utils'

import Divider from './src/divider.vue'

// withInstall
// - 包装成vue插件：给组件添加上 vue-plugins 的逻辑，即 ( 包装成vue插件 )
// - 返回组件
export const ElDivider = withInstall(Divider)
export default ElDivider // 默认导出

export * from './src/divider' // 导出其他声明
