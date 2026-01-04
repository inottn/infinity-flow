import { useState } from "react";
import { Marquee } from "./Marquee";
import { ControlPanel } from "./ControlPanel";
import { DEMO_IMAGES } from "./constants";
import type { ScrollerOptions } from "infinity-flow";

const App: React.FC = () => {
  const [options, setOptions] = useState<ScrollerOptions>({
    direction: "left",
    gap: 32,
    pauseOnHover: true,
    speed: 1.5,
  });

  const [isPlaying, setIsPlaying] = useState(true);

  const handleOptionChange = <T extends keyof ScrollerOptions>(
    key: T,
    value: ScrollerOptions[T]
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
              <div
                key={img.id}
                className="relative group w-[280px] h-[400px] md:w-[350px] md:h-[500px] flex-shrink-0 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={img.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                  loading="lazy"
                  draggable={false}
                />

                {/* Card Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    Image {index + 1}
                  </h3>
                  <p className="text-sm text-gray-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    Photo by Unsplash
                  </p>
                </div>
              </div>
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
