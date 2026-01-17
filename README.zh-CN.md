# InfinityFlow - JS Marquee Library

[English](./README.md)

**InfinityFlow** 是一个高性能的原生 JavaScript 库，用于创建无缝的无限横向滚动效果（跑马灯）。它内置了拖拽交互和惯性效果，带来自然且现代的用户体验。

### 特性

- 🚀 **零依赖**: 使用纯原生 TypeScript 编写。
- ⚡️ **高性能**: 流畅运行，丝滑体验。
- 🖱️ **物理拖拽**: 支持鼠标和触摸拖拽，松开时带有惯性效果。
- ♾️ **无缝循环**: 完美循环，自然衔接。
- 📱 **响应式**: 在桌面端和移动端都能完美运行。
- 🔧 **高度可配**: 可控制速度、方向、间距以及悬停暂停行为。

## 安装

通过 npm、yarn 或 pnpm 安装：

```bash
npm install @inottn/infinity-flow
```

```bash
yarn add @inottn/infinity-flow
```

```bash
pnpm add @inottn/infinity-flow
```

## 使用方法

### 1. HTML 结构

库需要一个包含子元素的容器。它会自动将子元素包裹在一个轨道（track）中。

```html
<div id="my-marquee">
  <div class="item">项目 1</div>
  <div class="item">项目 2</div>
  <div class="item">项目 3</div>
</div>
```

### 2. 初始化

```typescript
import InfinityFlow from "@inottn/infinity-flow";

const container = document.getElementById("my-marquee");
const flow = new InfinityFlow(container, {
  speed: 1.5,
  direction: "left",
  gap: 20,
  pauseOnHover: true,
});
```

### 3. 配置选项

所有配置选项都是可选的。以下是可用的配置项：

| 选项           | 类型                | 默认值   | 说明                                                          |
| -------------- | ------------------- | -------- | ------------------------------------------------------------- |
| `speed`        | `number`            | `1`      | 滚动速度，单位为像素/帧。推荐范围：0.5-5。数值越大滚动越快。  |
| `direction`    | `"left" \| "right"` | `"left"` | 滚动方向。`"left"` 表示内容向左滚动，`"right"` 表示向右滚动。 |
| `gap`          | `number`            | `20`     | 元素之间的间距，单位为像素。必须为非负数。                    |
| `pauseOnHover` | `boolean`           | `true`   | 当用户鼠标悬停在容器上时，是否暂停自动滚动。                  |

### 4. API 方法

#### `play(): void`

开始或恢复滚动动画。在初始化后或暂停后调用此方法。

```typescript
flow.play();
```

#### `pause(): void`

暂停滚动动画。当前位置会被保留。

```typescript
flow.pause();
```

#### `updateOptions(options: Partial<InfinityFlowOptions>): void`

动态更新一个或多个配置选项。跑马灯会立即适应新的设置。

**参数：**

- `options`: 包含要更新的选项的对象。只有指定的选项会被修改。

```typescript
// 修改速度和方向
flow.updateOptions({
  speed: 3,
  direction: "right",
});

// 仅更新间距
flow.updateOptions({ gap: 40 });
```

**注意：** 修改 `gap` 选项会触发内容的重新布局。

#### `destroy(): void`

完全清理跑马灯实例：

- 停止所有动画
- 移除所有事件监听器
- 恢复原始的 DOM 结构和样式
- 断开 ResizeObserver 连接

当不再需要跑马灯时调用此方法，以防止内存泄漏。

```typescript
flow.destroy();
```

**重要提示：** 调用 `destroy()` 后，实例无法重用。如需再次使用，必须创建新的 `InfinityFlow` 实例。

## 浏览器兼容性

InfinityFlow 适用于所有支持以下特性的现代浏览器：

- ES6+ JavaScript
- `requestAnimationFrame`
- CSS `transform` 和 `translate3d`
- Pointer Events API
- ResizeObserver API

## TypeScript 支持

InfinityFlow 使用 TypeScript 编写，内置完整的类型定义。

```typescript
import InfinityFlow, { type InfinityFlowOptions } from "@inottn/infinity-flow";

const options: InfinityFlowOptions = {
  speed: 2,
  direction: "left",
  gap: 20,
  pauseOnHover: true,
};

const flow = new InfinityFlow(container, options);
```

## 许可证

MIT
