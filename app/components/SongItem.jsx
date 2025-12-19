"use client";

import { Play, Music } from "lucide-react";

const SongItem = ({ song, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-neutral-100"
    >
      <div className="flex items-center gap-x-4">
        {/* Simplified Icon Container */}
        <div className="h-12 w-12 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
          <Play
            className="text-white hidden group-hover:block"
            size={18}
            fill="currentColor"
          />
          <Music className="text-neutral-400 group-hover:hidden" size={18} />
        </div>

        <div>
          <p className="font-bold text-neutral-900 text-sm leading-none mb-1">
            {song.title}
          </p>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
            {song.author}
          </p>
        </div>
      </div>

      {/* Clean Right Side - No more large random numbers */}
      <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
          Play Now
        </span>
      </div>
    </div>
  );
};

export default SongItem;
