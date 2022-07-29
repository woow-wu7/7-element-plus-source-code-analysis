import type { ConfigProviderProps } from '@element-plus/components/config-provider'
import type { InjectionKey, Ref } from 'vue'

// Partial
// - 将 ( 类型 ) 定义的 ( 所有属性 ) 都修改为 ( 可选的 )
// type Coord = Partial<Record<'x' | 'y', number>>;
// 等同于
// type Coord = { x?: number; y?: number; }
export type ConfigProviderContext = Partial<ConfigProviderProps>

export const configProviderContextKey: InjectionKey<
  Ref<ConfigProviderContext>
> = Symbol()
