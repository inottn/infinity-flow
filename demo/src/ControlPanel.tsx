import { ScrollerOptions } from "infinity-flow";
import { IconButton, Slider } from "./Controls";

interface ControlPanelProps {
  isPlaying: boolean;
  options: ScrollerOptions;
  onChange: <T extends keyof ScrollerOptions>(
    key: T,
    value: ScrollerOptions[T]
  ) => void;
  onTogglePlay: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  options,
  onChange,
  onTogglePlay,
}) => {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
      bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] 
      transition-all duration-300 hover:border-white/20 group/panel
      flex flex-col md:flex-row items-center
      w-[calc(100%-32px)] max-w-[340px] md:w-auto md:max-w-none
      rounded-[2rem] md:rounded-full
      p-4 gap-4 md:py-2 md:px-3 md:gap-0
    "
    >
      {/* Play/Pause Section */}
      <div className="flex-shrink-0">
        <IconButton
          className="shadow-lg shadow-black/20"
          title={isPlaying ? "Pause" : "Play"}
          variant="circle"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="translate-x-0.5"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </IconButton>
      </div>

      <div className="h-8 w-px bg-white/10 mx-3 hidden md:block"></div>

      {/* Sliders Section */}
      <div className="flex flex-row gap-4 md:gap-6 w-full md:w-auto items-center justify-between md:justify-start">
        <div className="w-full">
          <Slider
            displayValue={`${options.speed?.toFixed(1)}x`}
            label="Speed"
            max={5}
            min={0.1}
            step={0.1}
            value={options.speed || 0}
            onChange={(val) => onChange("speed", val)}
          />
        </div>

        <div className="w-full">
          <Slider
            displayValue={`${options.gap}px`}
            label="Gap"
            max={100}
            min={0}
            step={4}
            value={options.gap || 0}
            onChange={(val) => onChange("gap", val)}
          />
        </div>
      </div>

      <div className="h-8 w-px bg-white/10 mx-3 hidden md:block"></div>
      <div className="h-px w-full bg-white/10 md:hidden"></div>

      {/* Toggles/Actions Section */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
        {/* Direction Button */}
        <IconButton
          className="flex-1 md:flex-none"
          title="Toggle Direction"
          variant="circle"
          onClick={() =>
            onChange(
              "direction",
              options.direction === "left" ? "right" : "left"
            )
          }
        >
          <div
            className={`transition-transform duration-300 ${
              options.direction === "right" ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
        </IconButton>

        {/* Pause On Hover Button */}
        <IconButton
          active={!!options.pauseOnHover}
          className="px-3 font-medium text-[10px] tracking-wide whitespace-nowrap flex-1 md:flex-none"
          title="Toggle Auto Pause"
          variant="square"
          onClick={() => onChange("pauseOnHover", !options.pauseOnHover)}
        >
          Hover Pause
        </IconButton>
      </div>
    </div>
  );
};
