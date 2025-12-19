"use client";

import { useState, useEffect } from "react";
import { Play, Music, Heart } from "lucide-react";

const SongItem = ({ song, number, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const library = JSON.parse(
      localStorage.getItem("earlymusic_library") || "[]"
    );
    setIsSaved(library.some((s) => s.id === song.id));
  }, [song.id]);

  const toggleSave = (e) => {
    e.stopPropagation();
    const library = JSON.parse(
      localStorage.getItem("earlymusic_library") || "[]"
    );
    let updatedLibrary;

    if (isSaved) {
      updatedLibrary = library.filter((s) => s.id !== song.id);
    } else {
      updatedLibrary = [song, ...library];
    }

    localStorage.setItem("earlymusic_library", JSON.stringify(updatedLibrary));
    setIsSaved(!isSaved);
    // Dispatch event to refresh library page if open
    window.dispatchEvent(new Event("libraryUpdated"));
  };

  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-neutral-100"
    >
      <div className="flex items-center gap-x-4">
        <div className="w-4 text-center">
          <span className="text-[11px] font-black text-neutral-300 group-hover:hidden">
            {number}
          </span>
          <Play
            className="text-red-600 hidden group-hover:block"
            size={14}
            fill="currentColor"
          />
        </div>

        <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
          <Music className="text-neutral-400" size={16} />
        </div>

        <div>
          <p className="font-bold text-neutral-900 text-sm leading-none mb-1">
            {song.title}
          </p>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            {song.author}
          </p>
        </div>
      </div>

      <button
        onClick={toggleSave}
        className={`pr-2 transition-transform active:scale-90 ${
          isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Heart
          size={18}
          className={
            isSaved
              ? "text-red-600 fill-red-600"
              : "text-neutral-300 hover:text-red-400"
          }
        />
      </button>
    </div>
  );
};

export default SongItem;
