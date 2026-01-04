// Common Label Component
const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`text-[10px] text-white/40 font-bold uppercase tracking-wider ${className}`}
  >
    {children}
  </span>
);

// Slider Component
interface SliderProps {
  displayValue?: string | number;
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  displayValue,
  label,
  max,
  min,
  step,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-32 py-1">
      <div className="flex justify-between items-end px-1 leading-none">
        <Label>{label}</Label>
        <span className="text-[10px] font-mono text-white/70 tabular-nums opacity-80">
          {displayValue !== undefined ? displayValue : value}
        </span>
      </div>
      <div className="h-4 flex items-center relative group">
        <input
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none hover:bg-white/20 transition-colors [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
          max={max}
          min={min}
          step={step}
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

// Icon Button Component
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "circle" | "square";
}

export const IconButton: React.FC<IconButtonProps> = ({
  active = false,
  children,
  className = "",
  variant = "square",
  ...props
}) => {
  const baseStyles =
    "relative flex items-center justify-center transition-all duration-300 active:scale-95 border cursor-pointer select-none";

  const shapeStyles =
    variant === "circle" ? "w-9 h-9 rounded-full" : "h-9 px-2 rounded-full";

  const stateStyles = active
    ? "bg-white/20 border-white/20 text-white hover:bg-white/25"
    : "bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/10";

  return (
    <button
      className={`group flex-shrink-0 ${baseStyles} ${shapeStyles} ${stateStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
