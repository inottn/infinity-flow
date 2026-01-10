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

  private originalChildren: HTMLElement[] = [];
  private resizeObserver: ResizeObserver;
  private originalStyle: string | null = null;

  constructor(element: HTMLElement, options: ScrollerOptions = {}) {
    this.container = element;
    this.originalStyle = this.container.getAttribute("style");

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

    // Save original children
    // We filter for Elements to avoid text nodes causing layout issues
    this.originalChildren = Array.from(this.container.children).filter(
      (node): node is HTMLElement => node.nodeType === document.ELEMENT_NODE,
    );

    // Initial clear and append track
    this.container.innerHTML = "";
    this.container.appendChild(this.track);

    // Setup styles for container
    this.container.style.overflow = "hidden";
    this.container.style.position = "relative";
    // Critical for touch devices to allow horizontal dragging without scrolling page
    this.container.style.touchAction = "pan-y";
    this.container.style.cursor = "grab";

    this.resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to debounce and ensure layout is ready
      requestAnimationFrame(() => {
        this.setup();
      });
    });

    this.init();
  }

  private preventDefault = (e: Event) => {
    e.preventDefault();
  };

  // Helper to add a clone with necessary event listeners
  private appendClone(item: HTMLElement) {
    const clone = item.cloneNode(true) as HTMLElement;

    // Re-attach drag prevention listeners because cloneNode doesn't copy event listeners
    if (clone.tagName === "IMG") {
      clone.addEventListener("dragstart", this.preventDefault);
    }
    const imgs = clone.querySelectorAll("img");
    imgs.forEach((img) =>
      img.addEventListener("dragstart", this.preventDefault),
    );

    this.track.appendChild(clone);
    return clone;
  }

  private init() {
    this.setup();
    this.attachEvents();
    this.resizeObserver.observe(this.container);
    this.play();
  }

  /**
   * setup:
   * 1. Clear track.
   * 2. Append original items to measure "Single Set Width".
   * 3. Repeat original items until they fill the container (Base Content).
   * 4. Calculate contentWidth (Loop point).
   * 5. Append buffer items (copies from start) to cover the container width again.
   */
  private setup() {
    if (this.isDestroyed) return;

    // 1. Reset
    this.track.innerHTML = "";
    // We do NOT reset position here to 0 if we are just resizing,
    // but if the content width changes significantly it might jump.
    // For simplicity, we keep position but ensure bounds later.

    if (this.originalChildren.length === 0) return;

    const gap = this.options.gap;
    const containerWidth = this.container.clientWidth;

    // Helper to append the set of original children and return their total width
    const appendAndMeasureOriginals = (): number => {
      return this.originalChildren.reduce((addedWidth, item) => {
        const clone = this.appendClone(item);
        // We measure immediately. Since we just appended to DOM, offsetWidth causes a reflow and gives correct value.
        // If item has no width (e.g. display none), this is 0.
        return addedWidth + clone.offsetWidth + gap;
      }, 0);
    };

    // 2. Build the "Base Content" (The loop period)
    let contentWidth = 0;

    // Always append at least one set
    const firstSetWidth = appendAndMeasureOriginals();
    contentWidth += firstSetWidth;

    // Safety check: If elements have 0 width (e.g. hidden), stop to prevent infinite loop
    if (firstSetWidth <= 0 && gap <= 0) {
      return;
    }
    // If width is 0 but gap > 0, the loop will eventually terminate, so that's fine.
    // But if totally 0, we break.
    if (contentWidth === 0) return;

    // Repeat appending original set until it fills the container + small buffer
    // This defines the "Content Width" - the point where we loop back to 0.
    // We add a safety limit to preventing freezing if something is wrong (e.g. huge container, tiny items)
    let safetyCounter = 0;
    while (contentWidth < containerWidth + 100 && safetyCounter < 1000) {
      contentWidth += appendAndMeasureOriginals();
      safetyCounter++;
    }

    this.contentWidth = contentWidth;

    // 3. Add Buffer for Seamless Looping
    // We need to append items from the start of the list to the end
    // so that when we scroll past 'contentWidth', the user sees the start sequence again.
    // The buffer needs to be at least 'containerWidth' wide.

    // We take a snapshot of the current children (which represents the full Base Content sequence)
    const currentBaseChildren = Array.from(
      this.track.children,
    ) as HTMLElement[];

    let bufferWidth = 0;
    let i = 0;
    safetyCounter = 0;

    while (bufferWidth < containerWidth && safetyCounter < 1000) {
      const itemToClone = currentBaseChildren[i % currentBaseChildren.length];
      const clone = this.appendClone(itemToClone);

      bufferWidth += clone.offsetWidth + gap;
      i++;
      safetyCounter++;
    }

    // Ensure position is within new bounds (handling resize)
    this.checkBounds();
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
    if (this.contentWidth === 0) return;

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

    // Restore DOM to original state
    if (this.track && this.track.parentNode === this.container) {
      this.container.removeChild(this.track);
    }

    // Clear any potential garbage
    this.container.innerHTML = "";

    // Put original children back
    this.originalChildren.forEach((child) => {
      // Remove listeners we added (optional but good practice)
      if (child.tagName === "IMG") {
        child.removeEventListener("dragstart", this.preventDefault);
      }
      const imgs = child.querySelectorAll("img");
      imgs.forEach((img) =>
        img.removeEventListener("dragstart", this.preventDefault),
      );

      this.container.appendChild(child);
    });

    // Restore original inline styles
    if (this.originalStyle) {
      this.container.setAttribute("style", this.originalStyle);
    } else {
      this.container.removeAttribute("style");
    }
  }
}
