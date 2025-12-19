"use client";

import { Disc } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-y-4">
      <div className="relative flex items-center justify-center">
        {/* Pulsing background circle */}
        <div className="absolute h-16 w-16 bg-red-100 rounded-full animate-ping opacity-75" />
        {/* Rotating Disc Icon */}
        <div className="relative h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-neutral-50">
          <Disc className="text-red-600 animate-spin-slow" size={40} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-neutral-900">
          earlymusic
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 animate-pulse">
          Loading library...
        </p>
      </div>
    </div>
  );
};

export default Loader;
