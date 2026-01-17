import InfinityFlow, { type InfinityFlowOptions } from "@inottn/infinity-flow";
import { useEffect, useRef } from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  options?: InfinityFlowOptions;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className,
  options,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<InfinityFlow | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize
    flowRef.current = new InfinityFlow(containerRef.current, options);

    return () => {
      // Cleanup
      if (flowRef.current) {
        flowRef.current.destroy();
        flowRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Watch for option changes and update the instance dynamically
  useEffect(() => {
    if (flowRef.current && options) {
      flowRef.current.updateOptions(options);
    }
  }, [options]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full cursor-grab active:cursor-grabbing ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};
