"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Music, Heart } from "lucide-react";

const LikedSongs = () => {
  const [songs, setSongs] = useState([]);

  const loadSongs = () => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(
        localStorage.getItem("earlymusic_library") || "[]"
      );
      setSongs(saved);
    }
  };

  useEffect(() => {
    loadSongs();
    window.addEventListener("libraryUpdated", loadSongs);
    return () => window.removeEventListener("libraryUpdated", loadSongs);
  }, []);

  // EMPTY STATE
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-neutral-100 rounded-xl">
        <Heart size={16} className="text-neutral-200 mb-2" />
        <p className="text-[12px] font-medium text-neutral-400 text-center leading-snug">
          Liked songs will <br /> appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {songs.map((song) => (
        <Link
          key={song.id}
          href="/library"
          className="flex items-center gap-x-3 group transition cursor-pointer p-1 rounded-lg hover:bg-neutral-50"
        >
          {/* ICON SQUARE */}
          <div className="h-9 w-9 bg-neutral-50 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all shrink-0 border border-transparent group-hover:border-neutral-100">
            <Music
              size={14}
              className="text-neutral-400 group-hover:text-red-600 transition"
            />
          </div>

          <div className="overflow-hidden">
            {/* TITLE: Simple Semibold */}
            <p className="text-[13px] font-semibold text-neutral-600 group-hover:text-neutral-900 truncate transition-colors">
              {song.title}
            </p>
            {/* AUTHOR: Simple Medium */}
            <p className="text-[11px] text-neutral-400 font-medium truncate">
              {song.author}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LikedSongs;
