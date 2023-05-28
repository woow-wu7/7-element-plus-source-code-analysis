import { createVNode, render } from 'vue'
import { isClient } from '@vueuse/core'
import {
  debugWarn,
  isElement,
  isFunction,
  isNumber,
  isString,
  isVNode,
} from '@element-plus/utils'
import { useZIndex } from '@element-plus/hooks'
import { messageConfig } from '@element-plus/components/config-provider/src/config-provider'
import MessageConstructor from './message.vue'
import { messageDefaults, messageTypes } from './message'
import { instances } from './instance'

import type { MessageContext } from './instance'
import type { AppContext } from 'vue'
import type {
  Message,
  MessageFn,
  MessageHandler,
  MessageInstance,
  MessageOptions,
  MessageParams,
  MessageParamsNormalized,
  messageType,
} from './message'

let seed = 1

// TODO: Since Notify.ts is basically the same like this file. So we could do some encapsulation against them to reduce code duplication.

const normalizeOptions = (params?: MessageParams) => {
  const options: MessageOptions =
    !params || isString(params) || isVNode(params) || isFunction(params)
      ? { message: params }
      : params

  const normalized = {
    ...messageDefaults,
    ...options,
  }

  if (isString(normalized.appendTo)) {
    let appendTo = document.querySelector<HTMLElement>(normalized.appendTo)

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'ElMessage',
        'the appendTo option is not an HTMLElement. Falling back to document.body.'
      )
      appendTo = document.body
    }

    normalized.appendTo = appendTo
  }

  return normalized as MessageParamsNormalized
}


// element-ui message 源码分析
// - https://github.com/woow-wu7/7-element-source-code-analysis/blob/main/packages/message/src/main.js

// divine-ui message 源码
// - https://github.com/woow-wu7/8-divine-plus/blob/main/packages/components/message/message.ts

// closeMessage
// - 1. 删除 instances 中对应的该 instance
// - 2. vm.visible = false
const closeMessage = (instance: MessageContext) => {
  const idx = instances.indexOf(instance)
  if (idx === -1) return

  instances.splice(idx, 1)
  const { handler } = instance
  handler.close() // 即 vm.visible = false
}

const createMessage = (
  { appendTo, ...options }: MessageParamsNormalized,
  context?: AppContext | null
): MessageContext => {
  const { nextZIndex } = useZIndex()

  const id = `message_${seed++}`
  const userOnClose = options.onClose

  const container = document.createElement('div')

  const props = {
    ...options,
    zIndex: options.zIndex ?? nextZIndex(),
    id,

    // onClose
    // - 对应 message.vue 中的  @before-leave="onClose"
    onClose: () => {
      userOnClose?.() // 用户传入的 onClose
      closeMessage(instance)
    },

    // onDestroy
    // - 对应 message.vue 中的  @after-leave="$emit('destroy')"
    // clean message element preventing mem leak
    onDestroy: () => {
      // since the element is destroy, then the VNode should be collected by GC as well
      // we do not want cause any mem leak because we have returned vm as a reference to users
      // so that we manually set it to false.
      render(null, container)
    },
  }


  // createVNode
  const vnode = createVNode(
    MessageConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? { default: props.message }
      : null
  )
  vnode.appContext = context || message._context

  // render
  render(vnode, container)
  // instances will remove this item when close function gets called. So we do not need to worry about it.
  appendTo.appendChild(container.firstElementChild!) // div的第一个子元素，即不再需要div这个壳，div只是为了vnode提供挂载时的容器

  const vm = vnode.component!.proxy as MessageInstance
  const handler: MessageHandler = {
    // instead of calling the onClose function directly, setting this value so that we can have the full lifecycle
    // for out component, so that all closing steps will not be skipped.
    close: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore `visible` from defineExpose
      vm.visible = false
    },
  }

  const instance: MessageContext = {
    id,
    vnode,
    vm,
    handler,
    props: (vnode.component as any).props,
  }

  return instance
}

const message: MessageFn &
  Partial<Message> & { _context: AppContext | null } = (
  options = {},
  context
) => {
  if (!isClient) return { close: () => undefined }

  if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
    return { close: () => undefined }
  }

  const normalized = normalizeOptions(options)

  if (normalized.grouping && instances.length) {
    const instance = instances.find(
      ({ vnode: vm }) => vm.props?.message === normalized.message
    )
    if (instance) {
      instance.props.repeatNum += 1
      instance.props.type = normalized.type
      return instance.handler
    }
  }

  const instance = createMessage(normalized, context)

  instances.push(instance) // 多个 instances 的 top 处理
  return instance.handler
}

messageTypes.forEach((type) => {
  message[type] = (options = {}, appContext) => {
    const normalized = normalizeOptions(options)
    return message({ ...normalized, type }, appContext)
  }
})

export function closeAll(type?: messageType): void {
  for (const instance of instances) {
    if (!type || type === instance.props.type) {
      instance.handler.close()
    }
  }
}

message.closeAll = closeAll
message._context = null

export default message as Message


// # 需要用到的 vue3 api
//     1
//     createVNode
//     createVNode(type, props, children, patchFlag, dynamicProps, isBlockNode)
//     作用: 用来创建一个 VNode
//     --
//     签名
//     declare function _createVNode(
//       type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
//       props?: (Data & VNodeProps) | null,
//       children?: unknown,
//       patchFlag?: number,
//       dynamicProps?: string[] | null,
//       isBlockNode?: boolean
//     ): VNode;


//     2
//     render
//     render(vnode, container, isSVG)
//     ---
//     签名
//     1.export declare const render: RootRenderFunction<Element | ShadowRoot>;
//     2.export declare type RootRenderFunction<HostElement = RendererElement> = (
//       vnode: VNode | null,
//       container: HostElement,
//       isSVG?: boolean
//     ) => void;


//     3
//     vue2全局属性设置: Vue.prototype.xxx
//     vue2全局属性获取: this.xxx
//     vue3全局属性设置: createApp().config.globalProperties.xxx = xxx
//     vue3全局属性获取: getCurrentInstance().appContext.globalProperties.xxx