# 🏫 江苏省海门中学主页

一个使用 Next.js 开发的交互式主页，集成多个创意功能模块。

## 功能特性

### 主页 - 动态落球动画
- **动态落球动画**：页面加载时，带有文字的彩色球体从顶部落下
- **物理引擎**：球体具有重力、弹跳和碰撞效果
- **文字展示**：球体包含"江苏省海门中学"及其英文名称的文字

### 创意画布 - P5.js 生成艺术
- **交互式粒子系统**：基于 p5.js 的创意编程
- **鼠标交互**：点击和拖动创建动态粒子效果
- **物理模拟**：粒子具有速度、加速度和生命周期
- **噪声场**：使用 Perlin 噪声创建自然的粒子运动
- **连接线**：相邻粒子之间自动绘制连接线
- **色彩渐变**：基于 HSB 色彩空间的动态色彩变化
- **拖尾效果**：半透明背景叠加产生拖尾视觉效果

### 拼图游戏
- **多难度级别**：3x3、4x4、5x5 三种难度
- **多图片选择**：支持切换不同的拼图图片
- **移动统计**：实时显示移动次数
- **完成检测**：自动检测拼图完成并显示祝贺信息

### 通用特性
- **响应式设计**：完美适配桌面端和移动端
- **深色模式支持**：自适应系统主题偏好
- **导航栏**：轻松在不同功能模块间切换

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
npm start
```

## 自定义内容

### 主页 - 修改球体文字

编辑 `src/components/HomePage.tsx` 文件中的 `textChars` 数组：

```typescript
const textChars = [
  '江', '苏', '省', '海', '门', '中', '学',
  'H', 'a', 'i', 'm', 'e', 'n',
  // ... 添加或修改文字
];
```

### 主页 - 修改球体颜色

编辑 `colors` 数组自定义球体颜色：

```typescript
const colors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  // ... 添加更多颜色
];
```

### 主页 - 调整球体数量

在 `useEffect` 中修改 `numBalls` 变量：

```typescript
const numBalls = 30; // 调整数量
```

### P5.js 创意画布 - 调整参数

编辑 `src/components/P5Canvas.tsx` 文件自定义效果：

```typescript
const maxParticles = 200; // 最大粒子数量
// 粒子生成速度：在 draw() 函数中调整循环次数
for (let i = 0; i < 3; i++) { // 调整每帧生成的粒子数
```

### 拼图游戏 - 更换图片

编辑 `src/components/Navigation.tsx` 文件中的 `puzzleImages` 数组：

```typescript
const puzzleImages = [
  'https://your-image-url-1.jpg',
  'https://your-image-url-2.jpg',
  // ... 添加更多图片URL
];
```

## 技术栈

- [Next.js 16](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS 4](https://tailwindcss.com/) - 样式框架
- [React 19](https://react.dev/) - UI 库
- [p5.js](https://p5js.org/) - 创意编程和生成艺术
- HTML5 Canvas - 2D 图形渲染

## 部署

本项目可以轻松部署到各种平台：

- [Vercel](https://vercel.com/) （推荐）
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- 任何支持 Node.js 的托管服务

## 许可证

MIT

