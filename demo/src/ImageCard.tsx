import type { FC } from "react";

interface ImageCardProps {
  item: {
    id: string;
    url: string;
  };
  index: number;
}

export const ImageCard: FC<ImageCardProps> = ({ item, index }) => {
  const title = `Image ${index + 1}`;
  return (
    <div className="relative group w-[280px] h-[400px] md:w-[350px] md:h-[500px] flex-shrink-0 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <img
        alt={title}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
        draggable={false}
        loading="lazy"
        src={item.url}
      />

      {/* Card Overlay Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {title}
        </h3>
        <p className="text-sm text-gray-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          Photo by Unsplash
        </p>
      </div>
    </div>
  );
};
