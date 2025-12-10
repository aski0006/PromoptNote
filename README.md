# PromptNote Tool

<div align="center">
  <p>A Mac-style AI prompt manager with usage analytics, dark mode, and local storage persistence.</p>
</div>

## 📋 项目概述

PromptNote Tool 是一款基于 Electron 开发的桌面应用，旨在帮助用户高效管理、组织和使用 AI 提示词。它提供了直观的界面、强大的功能和良好的用户体验，适用于各类 AI 开发者和使用者。

## ✨ 核心功能

- 📝 **提示词管理**：创建、编辑、分类和搜索提示词
- 📊 **使用分析**：查看提示词使用频率和趋势
- 🌙 **深色模式**：支持明暗主题切换，保护视力
- 💾 **本地存储**：所有数据存储在本地，保障隐私安全
- 🎨 **Mac 风格设计**：简洁优雅的用户界面
- 🔍 **快速搜索**：快速查找所需的提示词
- 📱 **跨平台支持**：支持 Windows、macOS 和 Linux

## 🛠️ 技术栈说明

| 技术/依赖 | 版本 | 用途 |
|---------|------|------|
| React | ^18.2.0 | 用户界面框架 |
| TypeScript | ^5.0.0 | 类型安全的 JavaScript 超集 |
| Vite | ^5.0.0 | 构建工具和开发服务器 |
| Electron | ^28.0.0 | 桌面应用框架 |
| Tailwind CSS | ^3.4.0 | CSS 框架 |
| Recharts | ^2.10.3 | 数据可视化图表库 |
| Lucide React | ^0.300.0 | 图标库 |
| UUID | ^9.0.1 | 生成唯一标识符 |
| Electron Builder | ^24.9.1 | 应用打包工具 |

## 📋 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本
- Git

## 🚀 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/prompt-note-tool.git
cd prompt-note-tool
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并添加必要的环境变量：

### 4. 运行开发服务器

#### 仅运行 Web 应用

```bash
npm start
```

应用将在 http://localhost:5173 启动

#### 运行 Electron 桌面应用

```bash
npm run electron:start
```

## 📖 使用方法

### 基本操作

1. **创建提示词**：点击 "New Prompt" 按钮创建新的提示词
2. **编辑提示词**：点击现有提示词进行编辑
3. **分类管理**：使用标签对提示词进行分类
4. **搜索提示词**：在搜索框中输入关键词查找提示词
5. **查看分析**：在仪表盘查看提示词使用情况
6. **切换主题**：使用设置菜单切换明暗主题

### 构建生产版本

#### 构建 Web 版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

#### 构建 Electron 应用

```bash
# 打包应用（生成目录）
npm run pack

# 构建安装包（生成可执行文件）
npm run dist
```

构建产物将生成在 `dist` 目录

## 📁 目录结构

```
prompt-note-tool/
├── components/          # React 组件
│   ├── Dashboard.tsx    # 仪表盘组件
│   ├── Editor.tsx       # 编辑器组件
│   └── Logo.tsx         # Logo 组件
├── electron/            # Electron 相关文件
│   ├── main.ts          # 主进程代码
│   └── preload.ts       # 预加载脚本
├── services/            # 服务层
│   └── storageService.ts # 本地存储服务
├── build/               # Web 构建输出
├── dist/                # Electron 构建输出
├── App.tsx              # 应用入口组件
├── index.tsx            # React 渲染入口
├── types.ts             # TypeScript 类型定义
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── tsconfig.electron.json # Electron TypeScript 配置
├── package.json         # 项目配置和依赖
└── .gitignore           # Git 忽略规则
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的注释
- 添加必要的测试用例

## 📄 许可证信息

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解详情。

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [https://github.com/aski0006/prompt-note-tool/issues](https://github.com/aski0006/prompt-note-tool/issues)
- Email: 3031007372@qq.com

## 🤩 致谢

感谢所有为项目做出贡献的开发者和用户！

---

**享受使用 PromptNote Tool！** 🎉
