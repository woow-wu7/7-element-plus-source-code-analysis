// @ts-nocheck
import { nextTick } from 'vue'
import { isFunction } from '@vue/shared'
import { throttle } from 'lodash-unified'
import {
  getOffsetTopDistance,
  getScrollContainer,
  throwError,
} from '@element-plus/utils'

import type { ComponentPublicInstance, ObjectDirective } from 'vue'

export const SCOPE = 'ElInfiniteScroll'
export const CHECK_INTERVAL = 50
export const DEFAULT_DELAY = 200
export const DEFAULT_DISTANCE = 0

const attributes = {
  delay: {
    type: Number,
    default: DEFAULT_DELAY,
  },
  distance: {
    type: Number,
    default: DEFAULT_DISTANCE,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  immediate: {
    type: Boolean,
    default: true,
  },
}

type Attrs = typeof attributes
type ScrollOptions = { [K in keyof Attrs]: Attrs[K]['default'] }
type InfiniteScrollCallback = () => void
type InfiniteScrollEl = HTMLElement & {
  [SCOPE]: {
    container: HTMLElement | Window
    containerEl: HTMLElement
    instance: ComponentPublicInstance
    delay: number // export for test
    lastScrollTop: number
    cb: InfiniteScrollCallback
    onScroll: () => void
    observer?: MutationObserver
  }
}

const getScrollOptions = (
  el: HTMLElement,
  instance: ComponentPublicInstance
): ScrollOptions => {
  return Object.entries(attributes).reduce((acm, [name, option]) => {
    const { type, default: defaultValue } = option

    // attrVal
    // - 获取被绑元素的 各个属性
    // - infinite-scroll-disabled 是否禁用
    // - infinite-scroll-delay 节流时延，单位为ms
    // - infinite-scroll-distance 触发加载的距离阈值，单位为px
    // - infinite-scroll-immediate 是否立即执行加载方法，以防初始状态下内容无法撑满容器
    const attrVal = el.getAttribute(`infinite-scroll-${name}`) 

    let value = instance[attrVal] ?? attrVal ?? defaultValue // 没传入的属性，就使用默认值
    value = value === 'false' ? false : value
    value = type(value) // 格式化
    acm[name] = Number.isNaN(value) ? defaultValue : value
    return acm
  }, {} as ScrollOptions)
}

const destroyObserver = (el: InfiniteScrollEl) => {
  const { observer } = el[SCOPE]

  if (observer) {
    observer.disconnect()
    delete el[SCOPE].observer
  }
}

const handleScroll = (el: InfiniteScrollEl, cb: InfiniteScrollCallback) => {
  const { container, containerEl, instance, observer, lastScrollTop } =
    el[SCOPE]
  const { disabled, distance } = getScrollOptions(el, instance)
  const { clientHeight, scrollHeight, scrollTop } = containerEl
  const delta = scrollTop - lastScrollTop

  el[SCOPE].lastScrollTop = scrollTop

  // trigger only if full check has done and not disabled and scroll down
  if (observer || disabled || delta < 0) return

  let shouldTrigger = false

  if (container === el) {
    shouldTrigger = scrollHeight - (clientHeight + scrollTop) <= distance
  } else {
    // get the scrollHeight since el might be visible overflow
    const { clientTop, scrollHeight: height } = el
    const offsetTop = getOffsetTopDistance(el, containerEl)
    shouldTrigger =
      scrollTop + clientHeight >= offsetTop + clientTop + height - distance
  }

  if (shouldTrigger) {
    cb.call(instance)
  }
}

function checkFull(el: InfiniteScrollEl, cb: InfiniteScrollCallback) {
  const { containerEl, instance } = el[SCOPE]
  const { disabled } = getScrollOptions(el, instance)

  if (disabled || containerEl.clientHeight === 0) return

  if (containerEl.scrollHeight <= containerEl.clientHeight) {
    cb.call(instance)
  } else {
    destroyObserver(el)
  }
}

const InfiniteScroll: ObjectDirective<
  InfiniteScrollEl,
  InfiniteScrollCallback
> = {
  async mounted(el, binding) {
    // instance 被绑组件实例
    // value 指令的值
    const { instance, value: cb } = binding

    // cb 必须是函数
    if (!isFunction(cb)) {
      throwError(SCOPE, "'v-infinite-scroll' binding value must be a function")
    }

    // ensure parentNode mounted
    // 确保 父组件 存在
    await nextTick()

    const { delay, immediate } = getScrollOptions(el, instance)
    const container = getScrollContainer(el, true) // 获取具有滚动条的元素，el 或者 距离最近的具有滚动条的祖先元素
    const containerEl =
      container === window
        ? document.documentElement
        : (container as HTMLElement)
    const onScroll = throttle(handleScroll.bind(null, el, cb), delay)

    if (!container) return

    el[SCOPE] = {
      instance,
      container,
      containerEl,
      delay,
      cb,
      onScroll,
      lastScrollTop: containerEl.scrollTop,
    }

    if (immediate) {
      const observer = new MutationObserver(
        throttle(checkFull.bind(null, el, cb), CHECK_INTERVAL)
      )
      el[SCOPE].observer = observer
      observer.observe(el, { childList: true, subtree: true })
      checkFull(el, cb)
    }

    container.addEventListener('scroll', onScroll)
  },
  unmounted(el) {
    const { container, onScroll } = el[SCOPE]

    container?.removeEventListener('scroll', onScroll) // 清除 scroll 事件
    destroyObserver(el) // 停止观察
  },
  async updated(el) {
    if (!el[SCOPE]) {
      await nextTick()
    }
    const { containerEl, cb, observer } = el[SCOPE]
    if (containerEl.clientHeight && observer) {
      checkFull(el, cb)
    }
  },
}

export default InfiniteScroll
