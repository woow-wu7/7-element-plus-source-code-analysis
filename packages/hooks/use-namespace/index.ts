import { computed, unref } from 'vue'
import { useGlobalConfig } from '../use-global-config'

// 重要改变
// - 这里把 element2 中的 theme-chalk 整个换成了函数的形式，然后直接注入到标签上
export const defaultNamespace = 'el'
const statePrefix = 'is-'

// _bem
const _bem = (
  namespace: string,
  block: string, // B
  blockSuffix: string, // B 后缀
  element: string, // E
  modifier: string // M
) => {
  let cls = `${namespace}-${block}` // class
  if (blockSuffix) {
    cls += `-${blockSuffix}` // 后缀
  }
  if (element) {
    cls += `__${element}` // E
  }
  if (modifier) {
    cls += `--${modifier}` // M
  }
  return cls
}

// unref
// - 是一个语法糖
// - 相当于：val = isRef(val) ? val.value : val

// useNamespace
export const useNamespace = (block: string) => {
  const globalConfig = useGlobalConfig('namespace')
  const namespace = computed(() => globalConfig.value || defaultNamespace)
  // b e m
  const b = (blockSuffix = '') =>
    _bem(unref(namespace), block, blockSuffix, '', '') // 参数分别是：namespace block suffixBlock element modifier

  const e = (element?: string) =>
    element ? _bem(unref(namespace), block, '', element, '') : ''

  const m = (modifier?: string) =>
    modifier ? _bem(unref(namespace), block, '', '', modifier) : ''

  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(unref(namespace), block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(unref(namespace), block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(unref(namespace), block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(unref(namespace), block, blockSuffix, element, modifier)
      : ''


  // is
  // - 比如 ns.is(contentPosition) 是 ns.is('center') 时，结果就是 ( is-center )
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      styles[`--${namespace.value}-${key}`] = object[key]
    }
    return styles
  }

  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      styles[`--${namespace.value}-${block}-${key}`] = object[key]
    }
    return styles
  }

  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`


  // useNamespace 的返回值
  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>
