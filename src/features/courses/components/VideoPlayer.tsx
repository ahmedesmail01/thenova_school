import { Play } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  url?: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export function VideoPlayer({ 
  url = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4", 
  poster = "/images/course-1.png",
  onTimeUpdate,
  onEnded
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative group aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* Actual Video / Placeholder Image */}
      {!isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
           <img 
            src={poster} 
            alt="Video Poster" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-[#458FCE] shadow-xl transform transition-all group-hover:scale-110">
                 <Play size={28} fill="currentColor" className="translate-x-0.5" />
              </div>
           </div>
        </div>
      ) : (
        <video
          src={url}
          autoPlay
          controls
          onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
          onEnded={onEnded}
          className="w-full h-full object-contain bg-black"
        />
      )}
    </div>
  );
}
