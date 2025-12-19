"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Music } from "lucide-react";

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

  if (songs.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-4">
      {songs.map((song) => (
        <Link
          key={song.id}
          href="/library"
          className="flex items-center gap-x-3 group transition cursor-pointer"
        >
          <div className="h-8 w-8 bg-neutral-50 rounded-lg flex items-center justify-center group-hover:bg-red-50 transition">
            <Music
              size={14}
              className="text-neutral-300 group-hover:text-red-600 transition"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900 truncate transition">
              {song.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LikedSongs;
