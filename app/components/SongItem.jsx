"use client";

import { useState, useEffect } from "react";
import { Play, Music, Heart } from "lucide-react";

const SongItem = ({ song, onClick }) => {
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
    window.dispatchEvent(new Event("libraryUpdated"));
  };

  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-3 md:p-4 hover:bg-neutral-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-neutral-100"
    >
      <div className="flex items-center gap-x-4 md:gap-x-6">
        {/* Simple Play Indicator */}
        <div className="w-4 flex items-center justify-center">
          <Play
            className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            size={16}
            fill="currentColor"
          />
        </div>

        {/* Music Square */}
        <div className="h-10 w-10 md:h-12 md:w-12 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-neutral-100">
          <Music className="text-neutral-400" size={18} />
        </div>

        <div>
          {/* TITLE: Simple semibold font, no forced caps */}
          <p className="font-semibold text-neutral-900 text-[15px] leading-tight mb-0.5 tracking-tight">
            {song.title}
          </p>
          {/* AUTHOR: Simple medium font, gray color */}
          <p className="text-[13px] text-neutral-500 font-medium tracking-normal">
            {song.author}
          </p>
        </div>
      </div>

      <button
        onClick={toggleSave}
        className={`pr-2 md:pr-4 transition-transform active:scale-90 ${
          isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Heart
          size={20}
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
