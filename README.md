# InfinityFlow - JS Marquee Library

[中文 (Chinese)](./README.zh-CN.md)

**InfinityFlow** is a high-performance, native JavaScript library for creating seamless infinite horizontal scrolling effects (marquee). It features drag-and-drop interactions with inertia, making it feel natural and modern.

### Features

- 🚀 **Zero Dependencies**: Written in pure, native TypeScript.
- ⚡️ **High Performance**: Smooth and seamless experience.
- 🖱️ **Physics-Based Drag**: Supports mouse and touch dragging with inertia when released.
- ♾️ **Seamless Looping**: Perfect looping, naturally seamless.
- 📱 **Responsive**: Works great on desktop and mobile devices.
- 🔧 **Customizable**: Control speed, direction, gap, and pause-on-hover behavior.

## Installation

Install via npm, yarn, or pnpm:

```bash
npm install @inottn/infinity-flow
```

```bash
yarn add @inottn/infinity-flow
```

```bash
pnpm add @inottn/infinity-flow
```

## Usage

### 1. HTML Structure

The library expects a container with child elements. It will automatically wrap children in a track.

```html
<div id="my-marquee">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

### 2. Initialization

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

### 3. Configuration Options

All configuration options are optional. Here are the available settings:

| Option         | Type                | Default  | Description                                                                                      |
| -------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `speed`        | `number`            | `1`      | Scrolling speed in pixels per frame. Recommended range: 0.5-5. Higher values = faster scrolling. |
| `direction`    | `"left" \| "right"` | `"left"` | Scrolling direction. `"left"` scrolls content leftward, `"right"` scrolls rightward.             |
| `gap`          | `number`            | `20`     | Gap between items in pixels. Must be non-negative.                                               |
| `pauseOnHover` | `boolean`           | `true`   | Whether to pause auto-scrolling when the user hovers over the container.                         |

### 4. API Methods

#### `play(): void`

Starts or resumes the scrolling animation. Call this method after initialization or after pausing.

```typescript
flow.play();
```

#### `pause(): void`

Pauses the scrolling animation. The current position is preserved.

```typescript
flow.pause();
```

#### `updateOptions(options: Partial<InfinityFlowOptions>): void`

Dynamically updates one or more configuration options. The marquee will adapt to the new settings immediately.

**Parameters:**

- `options`: An object containing the options to update. Only the specified options will be changed.

```typescript
// Change speed and direction
flow.updateOptions({
  speed: 3,
  direction: "right",
});

// Update gap only
flow.updateOptions({ gap: 40 });
```

**Note:** Changing the `gap` option will trigger a re-layout of the content.

#### `destroy(): void`

Completely cleans up the marquee instance:

- Stops all animations
- Removes all event listeners
- Restores the original DOM structure and styles
- Disconnects the ResizeObserver

Call this method when you're done with the marquee to prevent memory leaks.

```typescript
flow.destroy();
```

**Important:** After calling `destroy()`, the instance cannot be reused. You must create a new `InfinityFlow` instance if needed.

## Browser Compatibility

InfinityFlow works on all modern browsers that support:

- ES6+ JavaScript
- `requestAnimationFrame`
- CSS `transform` and `translate3d`
- Pointer Events API
- ResizeObserver API

## TypeScript Support

InfinityFlow is written in TypeScript and includes type definitions out of the box.

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

## License

MIT
