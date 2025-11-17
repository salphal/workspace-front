# Vite React Frontend Template

一个现代化的 React + TypeScript + Vite 前端项目模板，集成了微前端、多语言、主题切换、代码质量检查等企业级功能。

## 🚀 技术栈

### 核心框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite 5** - 下一代前端构建工具

### UI 组件库
- **Ant Design 5** - 企业级 UI 设计语言
- **Ant Design Pro Components** - 高级业务组件
- **Tailwind CSS** - 实用优先的 CSS 框架

### 状态管理 & 数据流
- **Zustand** - 轻量级状态管理
- **React Router DOM** - 声明式路由
- **Axios** - HTTP 客户端

### 样式处理
- **Sass/SCSS** - CSS 预处理器
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 自动添加浏览器前缀
- **PostCSS PxToRem** - PX 转 REM 适配

### 开发工具
- **ESLint** - JavaScript/TypeScript 代码检查
- **Prettier** - 代码格式化
- **Stylelint** - CSS/SCSS 代码检查
- **Husky** - Git hooks
- **Commitlint** - 提交信息规范

### 测试框架
- **Jest** - JavaScript 测试框架
- **React Testing Library** - React 组件测试
- **MSW** - API Mock 服务

### 高级功能
- **微前端** - 基于 WuJie 的微前端架构
- **PWA** - 渐进式 Web 应用
- **多语言** - i18next 国际化
- **主题切换** - 明暗主题支持
- **图表库** - D3.js 数据可视化
- **代码检查器** - 开发时快速定位源码

## 📦 项目特性

### 🛠️ 开发体验
- **热重载** - 快速的开发服务器
- **代码检查** - 实时语法和样式检查
- **自动导入** - React 和路由的自动导入
- **SVG 组件** - SVG 文件作为 React 组件使用

### 🚀 构建优化
- **代码分割** - 智能分包策略
- **资源压缩** - 图片、CSS、JS 压缩
- **CDN 加速** - 外部库 CDN 引入
- **浏览器兼容** - 低版本浏览器支持
- **Gzip/Brotli 压缩** - 构建产物压缩

### 🎨 样式系统
- **CSS Modules** - 局部作用域样式
- **主题变量** - 统一的样式变量管理
- **响应式设计** - 移动端适配
- **REM 适配** - 灵活的尺寸单位

### 🔧 工具集成
- **Docker** - 容器化部署
- **Nginx** - 生产环境配置
- **环境变量** - 多环境配置支持
- **Git Hooks** - 自动化代码质量检查

## 📁 项目结构

```
vite-react-front-temp/
├── src/
│   ├── api/              # API 接口层
│   ├── components/       # 公共组件
│   ├── hook/            # 自定义 Hooks
│   ├── layout/          # 布局组件
│   ├── pages/           # 页面组件
│   ├── route/           # 路由配置
│   ├── store/           # 状态管理
│   ├── style/           # 样式文件
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── locale/          # 国际化配置
│   ├── microservice/    # 微前端配置
│   └── constant/        # 常量定义
├── public/              # 静态资源
├── docs/               # 项目文档
├── nginx/              # Nginx 配置
└── plugin/             # 自定义插件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.20.4
- npm >= 9.9.3 或 pnpm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式
```bash
pnpm dev
```
访问 http://localhost:8182

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
# ESLint 检查
pnpm lint

# 样式检查
pnpm style:lint

# 格式化代码
pnpm prettier:lint
```

### 测试
```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 监听模式
pnpm test:watch
```

## ⚙️ 配置说明

### 环境变量
项目支持多环境配置：
- `.env` - 默认环境变量
- `.env.test` - 测试环境变量

### Vite 配置
- 开发服务器代理配置
- PWA 离线缓存
- 图片压缩优化
- 代码分割策略

### 样式配置
- SCSS 全局变量和混入
- Tailwind CSS 配置
- PostCSS 插件链
- CSS Modules 命名规则

## 🎯 核心功能

### 微前端支持
基于 WuJie 框架实现微前端架构，支持子应用独立开发和部署。

### 多语言国际化
使用 i18next 实现多语言支持，支持中英文切换。

### 主题切换
支持明暗主题切换，基于 CSS 变量和状态管理。

### 状态管理
使用 Zustand 进行轻量级状态管理，支持持久化存储。

### API 管理
统一的 HTTP 请求封装，支持 GraphQL 和 RESTful API。

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 创建页面组件
2. 在 `src/route/index.tsx` 配置路由
3. 在 `src/types/` 添加类型定义

### 添加新组件
1. 在 `src/components/` 创建组件
2. 使用 TypeScript 和 CSS Modules
3. 编写单元测试

### 添加 API 接口
1. 在 `src/api/` 创建接口文件
2. 使用统一的请求封装
3. 添加类型定义

## 📝 代码规范

### Git 提交规范
使用 Conventional Commits 规范：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具变动

### 代码风格
- 使用 ESLint + Prettier 统一代码风格
- 遵循 TypeScript 严格模式
- 使用函数式组件和 Hooks

## 🐛 故障排除

### 常见问题
1. **端口占用**: 修改 `vite.config.ts` 中的端口配置
2. **依赖安装失败**: 清除 node_modules 重新安装
3. **类型错误**: 检查 TypeScript 配置和类型定义

### 调试工具
- React Developer Tools
- Redux DevTools (Zustand 支持)
- Vue DevTools (微前端调试)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 这是一个企业级前端项目模板，集成了现代前端开发的最佳实践。根据实际项目需求进行适当调整。
