"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search as SearchIcon, Disc, Music2, Heart } from "lucide-react";
import Loader from "../components/Loader";
import Player from "../components/Player";

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [activeSong, setActiveSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("songs")
          .select("*")
          .order("title", { ascending: true });

        if (!error && data) {
          setSongs(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchSongs();
  }, []);

  // ALPHABETICAL GROUPING LOGIC
  const groupedSongs = useMemo(() => {
    const filtered = (songs || []).filter(
      (s) =>
        s.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.author.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filtered.reduce((groups, song) => {
      const letter = song.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
      return groups;
    }, {});
  }, [songs, searchValue]);

  const alphabet = Object.keys(groupedSongs).sort();

  return (
    <main className="min-h-[90vh] bg-white pb-40 relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* SEARCH HEADER - Simplified Input Style */}
        <div className="relative mb-16">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <SearchIcon className="text-neutral-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by track or artist..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-100 py-5 pl-14 pr-8 rounded-2xl text-[15px] font-medium placeholder:text-neutral-300 focus:outline-none focus:border-red-600 focus:bg-white transition-all tracking-tight"
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : alphabet.length > 0 ? (
          <div className="flex flex-col gap-y-12">
            {alphabet.map((letter) => (
              <div key={letter} className="flex flex-col gap-y-4">
                {/* ALPHABETIC HEADER - Simplified */}
                <div className="flex items-center gap-x-4 px-2">
                  <h2 className="text-3xl font-semibold text-red-600 tracking-tight">
                    {letter}
                  </h2>
                  <div className="h-[1px] flex-1 bg-neutral-50" />
                </div>

                {/* TRACK LIST */}
                <div className="flex flex-col gap-y-1">
                  {groupedSongs[letter].map((song) => {
                    const isActive = activeSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        onClick={() => setActiveSong(song)}
                        className="bg-white p-4 rounded-2xl flex items-center justify-between group hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-x-5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                              isActive
                                ? "bg-red-600 border-red-600 text-white"
                                : "bg-neutral-50 border-neutral-100 text-neutral-400 group-hover:bg-white"
                            }`}
                          >
                            <Music2 size={16} />
                          </div>
                          <div>
                            <p
                              className={`font-semibold text-[15px] leading-tight mb-0.5 tracking-tight transition-colors ${
                                isActive ? "text-red-600" : "text-neutral-900"
                              }`}
                            >
                              {song.title}
                            </p>
                            <p className="text-[13px] text-neutral-500 font-medium">
                              {song.author}
                            </p>
                          </div>
                        </div>

                        <button className="w-10 h-10 flex items-center justify-center text-neutral-200 hover:text-red-600 transition-all active:scale-90">
                          <Heart size={18} fill={isActive ? "none" : "none"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 border border-neutral-100">
              <Disc className="text-neutral-200" size={32} />
            </div>
            <h3 className="text-[13px] font-medium text-neutral-400">
              No results found for "{searchValue}"
            </h3>
          </div>
        )}
      </div>

      {activeSong && (
        <Player
          song={activeSong}
          key={activeSong.id}
          songs={songs}
          onSongSelect={setActiveSong}
        />
      )}
    </main>
  );
}
