# element-plus

# 任务清单
- [x] el-breadcrumb el-breadcrumb-item
- [x] divider



# 其他源码

#### (1) redux 和 react-redux 源码分析 [redux^4.0.5]
- [redux源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/REDUX)
- [redux源码分析-我的掘金博客](https://juejin.cn/post/6844904137952329742)

#### (2) 手写 webpack Compiler 源码 [webpack^4.42.0]
- [手写Compiler源码-仓库](https://github.com/woow-wu7/7-compiler)
- [手写Compiler源码-我的掘金文章](https://juejin.cn/post/6844903973002936327)

#### (3) axios 源码分析 [axios^0.20.0]
- [axios源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/AXIOS)
- [axios源码分析-我的掘金文章](https://juejin.cn/post/6844904147532120072)
- [cancel取消请求的原理，interceptor拦截器的原理 - 两个重点掌握](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/pages/admin-system/interview-cancel/index.tsx)

#### (4) vue 源码分析 [vue^2.6.12]
- [vue源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/VUE)
- [vue源码分析-新建仓库](https://github.com/woow-wu7/7-vue2-source-code-analysis)
- [vue源码分析-我的掘金文章](https://juejin.cn/post/6844904181094957069)

#### (5) vuex 源码分析 [v2.6.10]
- [vuex源码分析-我的掘金文章](https://juejin.cn/post/6844904166293241863)

#### (6) react 源码分析 [react^17.0.3]
- [react源码分析-仓库](https://github.com/woow-wu7/7-react-source-code-analysis)
- [react源码分析-我的掘金文章](https://juejin.cn/post/6993980489463758855)
- [js实现单向链表 - 源码](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/manual/linked-list.js)
- [手写hook调度-useState实现 - 源码仓库](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/manual/hooks-manual.js)
- [手写hook调度-useState实现 - 思维导图](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/images/hook-useState.png)

#### (7) a-hooks2.0 源码分析 [a-hooks^2.10.9]
- [a-hooks源码分析 - 仓库](https://github.com/woow-wu7/7-a-hooks-source-code-analysis)

#### (8) a-hooks3.0 源码分析 [a-hooks^2.10.9]
- [a-hooks源码分析 - 仓库](https://github.com/woow-wu7/7-a-hooks3.0-source-code-analysis)

#### (9) koa 源码分析 [koa^2.13.1]
- [koa源码分析 - 仓库](https://github.com/woow-wu7/7-koa-source-code-analysis)
- [koa源码调试 - 仓库](https://github.com/woow-wu7/7-koa-source-code-analysis)
- 注意分析：( axios拦截器 + redux中间件 + koa中间件 ) 三者的相同点和区别

#### (10) badJs-report 源码分析
- [badJs-report源码分析-仓库](https://github.com/woow-wu7/7-badjs-report-analysis)

#### (11) element-ui 源码分析
- [element-ui 源码分析-仓库](https://github.com/woow-wu7/8-element-source-code-analysis)

#### (12) element-plus 源码分析 [element-plus^2.26]
- [element-plus 源码分析-仓库](https://github.com/woow-wu7/8-element-plus-source-code-analysis)

#### (13) vant [vant^3.4.5]
- [vant3 源码分析-仓库](https://github.com/woow-wu7/8-vant-source-code-analysis)

#### (14) Diff-virtualDOM
- [手写diff算法-snabbdom](https://github.com/woow-wu7/7-vue2-source-code-snabbdom)


# 细节


### (1) el-breadcrumb el-breadcrumb-item
```
el-breadcrumb el-breadcrumb-item
---

1. provide 和 inject -> 跨级传递数据
2. getCurrentInstance().appContext.config.globalProperties.$router -> 获取router实例
3. ref + element.querySelectorAll() -> 获取所有子元素
4. aria-current='page' vs is-active -> https://codepen.io/scottohara/pen/PmOaKm
```
