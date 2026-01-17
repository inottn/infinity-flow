import type { InfinityFlowOptions } from "@inottn/infinity-flow";
import { useState } from "react";
import { DEMO_IMAGES } from "./constants";
import { ControlPanel } from "./ControlPanel";
import { ImageCard } from "./ImageCard";
import { Marquee } from "./Marquee";

const App: React.FC = () => {
  const [options, setOptions] = useState<InfinityFlowOptions>({
    direction: "left",
    gap: 32,
    pauseOnHover: true,
    speed: 1.5,
  });

  const [isPlaying, setIsPlaying] = useState(true);

  const handleOptionChange = <T extends keyof InfinityFlowOptions>(
    key: T,
    value: InfinityFlowOptions[T],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const effectiveOptions = {
    ...options,
    speed: isPlaying ? options.speed : 0,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen py-20">
        {/* Header */}
        <div className="text-center mb-24 px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8 tracking-tighter drop-shadow-2xl">
            InfinityFlow
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            A high-performance, native JavaScript marquee library demonstration.{" "}
            <br className="hidden md:block" />
            Silky smooth 60fps scrolling with{" "}
            <strong className="text-white font-medium">
              physics-based drag & inertia
            </strong>
            .
          </p>
        </div>

        {/* Marquee Section */}
        <div className="w-full relative py-12 border-y border-white/5 bg-white/[0.02]">
          {/* Gradient Masks for fade effect */}
          <div className="absolute top-0 left-0 w-32 h-full z-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full z-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

          <Marquee className="flex items-center" options={effectiveOptions}>
            {DEMO_IMAGES.map((img, index) => (
              <ImageCard key={img.id} item={img} index={index} />
            ))}
          </Marquee>
        </div>
      </main>

      <ControlPanel
        isPlaying={isPlaying}
        options={options}
        onChange={handleOptionChange}
        onTogglePlay={handleTogglePlay}
      />
    </div>
  );
};

export default App;
