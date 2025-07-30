# Sketch Measure Modern

一个现代化的 Sketch 设计测量和标注插件，支持最新的 Sketch 功能（Frames、Stacks、Smart Animate 等）。

![Sketch Measure Modern](https://img.shields.io/badge/Sketch-2025.1+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ 特性

### 🎯 核心功能
- **📐 覆盖层标记** - 高亮显示图层区域
- **📏 尺寸标记** - 显示图层宽度和高度
- **↔️ 间距标记** - 测量图层间距和到容器的距离
- **🎨 属性标记** - 显示颜色、字体、阴影等样式信息
- **📝 注释标记** - 添加自定义注释说明

### 🚀 现代化支持
- **✅ Frames** - 支持新的 Frame 容器
- **✅ Stacks** - 兼容 Stack 布局
- **✅ Smart Animate** - 适配智能动画
- **✅ TypeScript** - 完整的类型安全
- **✅ 最新 API** - 基于 Sketch 2025.1+ API

### 📤 导出功能
- **HTML 规范** - 生成现代化的 HTML 设计规范文档
- **资源导出** - 批量设置图层导出格式
- **颜色管理** - 分析和管理设计中的颜色

## 🛠 安装

### 方法 1：直接安装
1. 下载最新的 [Release](https://github.com/utom/sketch-measure/releases)
2. 双击 `sketch-measure-modern.sketchplugin` 文件
3. Sketch 会自动安装插件

### 方法 2：从源码构建
```bash
# 克隆仓库
git clone https://github.com/utom/sketch-measure.git
cd sketch-measure/sketch-measure-modern

# 安装依赖
npm install

# 构建插件
npm run build

# 安装到 Sketch
npm run postinstall
```

## 🎮 使用方法

### 快捷键
- `Ctrl + Shift + B` - 打开工具栏
- `Ctrl + Shift + 1` - 标记覆盖层
- `Ctrl + Shift + 2` - 标记尺寸
- `Ctrl + Shift + 3` - 标记间距
- `Ctrl + Shift + 4` - 标记属性
- `Ctrl + Shift + 5` - 添加注释
- `Ctrl + Shift + E` - 导出规范
- `Ctrl + Shift + S` - 设置导出
- `Ctrl + Shift + C` - 颜色管理

### 基本操作

#### 1. 标记图层尺寸
1. 选择要测量的图层
2. 按 `Ctrl + Shift + 2` 或从菜单选择 "Mark Sizes"
3. 插件会自动显示图层的宽度和高度

#### 2. 测量图层间距
1. 选择一个图层（测量到父容器的距离）或两个图层（测量彼此间距）
2. 按 `Ctrl + Shift + 3` 或从菜单选择 "Mark Spacings"
3. 插件会显示相应的间距标记

#### 3. 导出设计规范
1. 添加所需的测量标记
2. 按 `Ctrl + Shift + E` 或从菜单选择 "Export Specs"
3. 选择导出位置，插件会生成 HTML 规范文档

### 高级功能

#### 影响矩形
启用"影响矩形"选项可以包含图层的阴影、外边框等效果区域，这对于准确的视觉对齐很重要。

#### 颜色格式
支持多种颜色格式：
- **HEX** - `#FF5722`
- **RGB** - `rgb(255, 87, 34)`
- **HSL** - `hsl(14, 100%, 57%)`

## ⚙️ 配置

通过菜单 "Settings" 或快捷键可以配置：
- 默认单位（px、pt、dp）
- 颜色格式（hex、rgb、hsl）
- 是否使用影响矩形
- 导出时是否包含阴影和模糊

## 🏗 技术架构

### 项目结构
```
src/
├── commands/          # 命令处理器
├── core/             # 核心测量功能
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
└── manifest.json     # 插件配置
```

### 技术栈
- **TypeScript** - 类型安全的开发
- **Sketch API** - 最新的 Sketch JavaScript API
- **skpm** - 现代化的 Sketch 插件构建工具
- **ES2020** - 现代 JavaScript 特性

## 🔧 开发

### 环境要求
- Node.js 16+
- Sketch 84+
- macOS Sonoma+

### 开发命令
```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建插件
npm run build

# 类型检查
npm run type-check

# 代码格式化
npm run prettify
```

### 项目特点
- **完全类型化** - 所有代码都有 TypeScript 类型
- **模块化架构** - 清晰的代码组织
- **现代化构建** - 使用最新的构建工具
- **向后兼容** - 保持与原版功能的兼容性

## 📝 更新日志

### v1.0.0 (2025-01-20)
- 🎉 完全重写，支持 TypeScript
- ✨ 支持最新 Sketch 2025.1 API
- 🚀 新增对 Frames 和 Stacks 的支持
- 📱 现代化的 HTML 导出
- 🎨 改进的颜色管理
- ⚡ 更好的性能和稳定性

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 原始 Sketch Measure 插件的作者和贡献者
- Sketch 团队提供的优秀 API
- 社区中所有的反馈和建议

## 📞 支持

- [GitHub Issues](https://github.com/utom/sketch-measure/issues) - 报告 Bug 和功能请求
- [文档](https://github.com/utom/sketch-measure/wiki) - 详细使用说明
- [社区讨论](https://github.com/utom/sketch-measure/discussions) - 交流讨论

---

<p align="center">
  Made with ❤️ for the Sketch community
</p>

