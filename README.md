# 🧩 拼图游戏 (Puzzle Game)

一个使用 Next.js 开发的有趣拼图游戏网站，支持三个难度级别。

## 功能特性

- **三种难度级别**：
  - 简单 (3x3) - 9 块拼图
  - 中等 (4x4) - 16 块拼图
  - 困难 (5x5) - 25 块拼图

- **多张拼图图片**：支持切换不同的拼图图片

- **游戏统计**：显示移动次数

- **参考图片**：游戏时显示原图作为参考

- **Umami 统计集成**：深度集成 Umami 事件追踪功能

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看游戏。

### 构建生产版本

```bash
npm run build
npm start
```

## 环境变量

复制 `.env.example` 为 `.env.local` 并配置以下环境变量：

```bash
# Umami 统计配置
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_SRC=https://analytics.yourdomain.com/script.js
```

### Umami 事件追踪

游戏集成了以下 Umami 事件追踪：

| 事件名称 | 描述 | 参数 |
|---------|------|------|
| `game_start` | 游戏开始 | difficulty, gridSize, imageIndex |
| `game_complete` | 游戏完成 | difficulty, gridSize, moves, durationSeconds, imageIndex |
| `difficulty_change` | 难度切换 | from, to, gridSize |
| `image_select` | 图片选择 | imageIndex, previousImage |
| `piece_move_milestone` | 每5次移动 | moves, difficulty, imageIndex |
| `play_again` | 再玩一次 | previousMoves, difficulty |

## 技术栈

- [Next.js 16](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Umami](https://umami.is/) - 网站统计（可选）

## 添加自定义拼图图片

将图片文件放入 `public/images/` 目录，然后在 `src/app/page.tsx` 中更新 `puzzleImages` 数组：

```typescript
const puzzleImages = [
  "/images/puzzle1.svg",
  "/images/puzzle2.svg",
  "/images/your-new-image.jpg", // 添加新图片
];
```

## 许可证

MIT
