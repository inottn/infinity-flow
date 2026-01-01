export interface ScrollerOptions {
  direction?: "left" | "right";
  gap?: number; // Gap between items in pixels
  pauseOnHover?: boolean;
  speed?: number; // Pixels per frame
}

export class InfinityFlow {
  private container: HTMLElement;
  private track: HTMLElement;
  private options: Required<ScrollerOptions>;
  private animationFrameId: number | null = null;
  private position: number = 0;
  private contentWidth: number = 0;

  // State
  private isHovered: boolean = false;
  private isDestroyed: boolean = false;

  // Drag & Physics State
  private isDragging: boolean = false;
  private lastX: number = 0;
  private velocity: number = 0; // Pixels per frame
  private friction: number = 0.95; // Inertia decay factor

  private originalChildren: Element[] = [];
  private resizeObserver: ResizeObserver;

  constructor(element: HTMLElement, options: ScrollerOptions = {}) {
    this.container = element;

    // Default options
    this.options = {
      speed: 1,
      direction: "left",
      pauseOnHover: true,
      gap: 20,
      ...options,
    };

    // Create the track element
    this.track = document.createElement("div");
    this.track.style.display = "flex";
    this.track.style.width = "max-content";
    this.track.style.gap = `${this.options.gap}px`;
    this.track.style.willChange = "transform";
    // Prevent user selection during drag
    this.track.style.userSelect = "none";

    // Move existing children into the track
    this.originalChildren = Array.from(this.container.children);
    this.originalChildren.forEach((child) => {
      // Prevent default image dragging behavior
      if (child.tagName === "IMG") {
        child.addEventListener("dragstart", (e) => e.preventDefault());
      }
      const imgs = child.querySelectorAll("img");
      imgs.forEach((img) =>
        img.addEventListener("dragstart", (e) => e.preventDefault())
      );

      this.track.appendChild(child);
    });
    this.container.appendChild(this.track);

    // Setup styles for container
    this.container.style.overflow = "hidden";
    this.container.style.position = "relative";
    // Critical for touch devices to allow horizontal dragging without scrolling page
    this.container.style.touchAction = "pan-y";
    this.container.style.cursor = "grab";

    this.resizeObserver = new ResizeObserver(() => {
      this.setup();
    });

    this.init();
  }

  private init() {
    this.setup();
    this.attachEvents();
    this.resizeObserver.observe(this.container);
    this.play();
  }

  /**
   * Calculates widths and clones elements to fill the screen + buffer
   */
  private setup() {
    if (this.isDestroyed) return;

    this.track.innerHTML = "";
    this.originalChildren.forEach((child) => {
      this.track.appendChild(child.cloneNode(true));
    });

    const rect = this.track.getBoundingClientRect();
    const singleSetWidth = rect.width;
    const gap = this.options.gap;

    // Total width of one "unit"
    this.contentWidth = singleSetWidth + gap;

    const containerWidth = this.container.clientWidth;

    // We need enough copies to cover the width + buffer
    // Adding extra buffer to safely handle rapid dragging in both directions
    const setsNeeded = Math.ceil(containerWidth / (singleSetWidth + gap)) + 2;

    for (let i = 0; i < setsNeeded; i++) {
      this.originalChildren.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        // Prevent drag on clones too
        if (clone.tagName === "IMG") {
          clone.addEventListener("dragstart", (e) => e.preventDefault());
        }
        const img = clone.querySelector("img");
        if (img) img.addEventListener("dragstart", (e) => e.preventDefault());

        this.track.appendChild(clone);
      });
    }
  }

  private attachEvents() {
    this.container.addEventListener("mouseenter", this.onMouseEnter);
    this.container.addEventListener("mouseleave", this.onMouseLeave);

    // Pointer Events for Dragging (Mouse + Touch)
    this.container.addEventListener("pointerdown", this.onPointerDown);
    // Bind to window to handle drags that leave the container
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
  }

  private onMouseEnter = () => {
    this.isHovered = true;
  };

  private onMouseLeave = () => {
    this.isHovered = false;
  };

  // --- Drag Handling ---
  private onPointerDown = (e: PointerEvent) => {
    this.isDragging = true;
    this.lastX = e.clientX;
    this.velocity = 0;
    this.container.style.cursor = "grabbing";
    // Pause animation logic implicitly via isDragging check in animate()
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;

    const currentX = e.clientX;
    const delta = currentX - this.lastX;
    this.lastX = currentX;

    // Calculate velocity (pixels per frame essentially)
    this.velocity = delta;

    // Direct movement: Moving mouse LEFT (negative delta) should increase position (move content left)
    // Moving mouse RIGHT (positive delta) should decrease position (move content right)
    // So we subtract delta.
    this.position -= delta;

    this.checkBounds();
  };

  private onPointerUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.style.cursor = "grab";
  };

  private checkBounds() {
    // Wrap position to keep it within 0 -> contentWidth range
    if (this.position >= this.contentWidth) {
      this.position -= this.contentWidth;
    } else if (this.position < 0) {
      this.position += this.contentWidth;
    }
  }

  private animate = () => {
    if (this.isDestroyed) return;

    if (this.isDragging) {
      // While dragging, position is updated in onPointerMove.
      // We keep the loop running to render the transform.
    } else {
      // Not dragging: Apply physics or auto-scroll

      // 1. Apply Inertia if velocity is significant
      if (Math.abs(this.velocity) > 0.1) {
        this.position -= this.velocity;
        this.velocity *= this.friction;
      } else {
        this.velocity = 0;

        // 2. Resume Auto Scroll if not paused/hovered
        const shouldPause = this.options.pauseOnHover && this.isHovered;

        if (!shouldPause) {
          const move =
            this.options.speed * (this.options.direction === "left" ? 1 : -1);
          // We ramp velocity towards the target speed for smoothness, or just add it directly
          // For strict speed control, we just add it directly.
          this.position += move;
        }
      }

      this.checkBounds();
    }

    // Apply transform
    this.track.style.transform = `translate3d(-${this.position}px, 0, 0)`;

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public play() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  public pause() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public updateOptions(newOptions: Partial<ScrollerOptions>) {
    const needSetup =
      newOptions.gap !== undefined && newOptions.gap !== this.options.gap;

    this.options = { ...this.options, ...newOptions };
    this.track.style.gap = `${this.options.gap}px`;

    if (needSetup) {
      this.setup();
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.pause();
    this.resizeObserver.disconnect();

    this.container.removeEventListener("mouseenter", this.onMouseEnter);
    this.container.removeEventListener("mouseleave", this.onMouseLeave);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
  }
}
