"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import SongItem from "../components/SongItem";
import Player from "../components/Player";
import Loader from "../components/Loader";
import { Library as LibraryIcon, HeartOff } from "lucide-react";

export default function LibraryPage() {
  const [librarySongs, setLibrarySongs] = useState([]);
  const [activeSong, setActiveSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = () => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(
        localStorage.getItem("earlymusic_library") || "[]"
      );
      setLibrarySongs(saved);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
    window.addEventListener("libraryUpdated", fetchLibrary);
    return () => window.removeEventListener("libraryUpdated", fetchLibrary);
  }, []);

  // Sort and Group songs alphabetically
  const groupedSongs = useMemo(() => {
    // 1. Sort all songs alphabetically by title
    const sorted = [...librarySongs].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    // 2. Group them by first letter
    return sorted.reduce((groups, song) => {
      const letter = song.title[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(song);
      return groups;
    }, {});
  }, [librarySongs]);

  const alphabet = Object.keys(groupedSongs).sort();

  return (
    <main className="min-h-[90vh] bg-white pb-24 relative">
      <div className="px-8 py-4">
        {/* Header Section */}
        <div className="flex items-center gap-x-4 mb-10">
          <div className="h-14 w-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-100">
            <LibraryIcon className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
              Library
            </h1>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : librarySongs.length > 0 ? (
          <div className="flex flex-col gap-y-12">
            {alphabet.map((letter) => (
              <div key={letter} className="flex flex-col gap-y-4">
                {/* Alphabet Label */}
                <div className="border-b border-neutral-100 pb-2">
                  <h2 className="text-2xl font-black text-red-600 uppercase">
                    {letter}
                  </h2>
                </div>

                {/* Songs under this letter */}
                <div className="flex flex-col gap-y-1">
                  {groupedSongs[letter].map((song, index) => (
                    <SongItem
                      key={song.id}
                      song={song}
                      number={index + 1}
                      onClick={() => setActiveSong(song)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-neutral-100 rounded-[2rem]">
            <HeartOff className="text-neutral-200 mb-4" size={40} />
            <p className="text-sm font-black text-neutral-900 uppercase tracking-widest">
              Collection empty
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-2">
              Add songs to see them grouped here
            </p>
          </div>
        )}
      </div>

      {activeSong && (
        <Player
          song={activeSong}
          key={activeSong.id}
          songs={librarySongs} // Keeps the player context for Next/Prev
          onSongSelect={setActiveSong}
        />
      )}
    </main>
  );
}
