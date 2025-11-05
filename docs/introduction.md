# React 最佳实践 与 哲学 分享

> 从 setState 到性能优化, 如何写出更可靠、更高效的 React 代码

---

## 分享目标

- 理解 React 的核心设计理念( 数据驱动 UI );
- 掌握常见开发陷阱与应对方案( 如 state异步、闭包陷阱 );
- 拆分 `复杂组件逻辑` 与 `性能优化思路`;
- 分享 `真实业务实践` 与 `踩坑经验`;

---

## Part 1:React 的核心思想

- React 的数据驱动模型: func(state) => UI

> 不需要手动告诉 React "如何修改UI"; \
> 只需要告诉 React:当 state 是这样时, UI 应该长什么样;\
> 当 state 改变时, React 会自动重新执行函数 return/render 新UI ( 将最新的 state 更新界面中 );

```text



```

- "纯渲染 + 副作用"的核心设计( 函数式组件哲学 )

```text



```

- Hooks 的出现与意义: 逻辑复用与闭包管理

```text




```

---

## Part 2: State 与闭包陷阱

setState 是异步的,不会立刻更新值

为什么更新后拿不到最新 state?(闭包问题) 几种解决方式:

useEffect:状态驱动副作用

函数式更新:同步拿新值

useRef :异步环境中保持最新值

X不推荐:更新后立即使用I state 实战案例:

点击按钮更新分页后立刻调接口(错误＆正确对比)

结论:副作用要声明式地响应状态,而不是命令式触发;

---

## Part 3:状态管理与逻辑拆分

什么时候该用 useState

什么时候该用 useReducer 如何避免"状态提升过度"

Context 的正确使用姿势

自定义Hook:
封装复用逻辑(例:useFetch、usePagination)
状态同步陷阱(父子组件、props 传值、昇步更新)

---

## Part 4:性能优化

React 渲染机制简述(虚拟 DOM、Fiber) 避免不必要渲染的关键点:

• React;memo

useCallback / useMemo

key 的使用与 diff 算法

大型表格/列表优化(虚拟滚动、分页)
批量更新 ＆并发模式(React 18+)

---

## Part 5:常见坑 & 实战经验

useEffect 无限循环依赖问题

async/await + useEffect 的坑

setTimeout、事件监听中读不到最新值

form 状态同步＆ 双向绑定陷阱

测试与 mock 工具(Jest + MSW)

---

## Part 6:前端工程化与团队实践

模块化与代码规范 (ESLint、Prettier、Husky)
类型安全:TypeScript 在React 中的最佳实践
组件库抽象与 Storybook
CI/CD 与单测覆盖率

---

## Part 7:总结与问答

- React 思维方式: 数据 ＋ UI + 副作用
- 拥抱 Hooks, 但要理解底层机制
- 避免命令式代码, 写出更"React 风格"的组件

---
