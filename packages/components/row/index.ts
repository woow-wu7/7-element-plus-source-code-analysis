import { withInstall } from '@element-plus/utils'
import Row from './src/row.vue'

// withInstall
// - 作用：给 ( 参数组件 ) 添加 install 方法，即 vue 插件都有的 install 方法
// - 其实：就是 element2 中的下面一段代码
// Row.install = function(Vue) {
//   Vue.component(Row.name, Row);
// };

export const ElRow = withInstall(Row)

export default ElRow

export * from './src/row'
