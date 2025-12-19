"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search as SearchIcon } from "lucide-react";
import Header from "../components/Header";
import SongItem from "../components/SongItem";
import Player from "../components/Player";
import Loader from "../components/Loader";

export default function SearchPage() {
  const [songs, setSongs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeSong, setActiveSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase.from("songs").select("*");
      if (data) setSongs(data);
      setIsLoading(false);
      if (inputRef.current) inputRef.current.focus();
    };
    fetchSongs();
  }, []);

  const filteredAndGrouped = useMemo(() => {
    const filtered = songs.filter(s => 
      s.title.toLowerCase().includes(searchValue.toLowerCase()) || 
      s.author.toLowerCase().includes(searchValue.toLowerCase())
    ).sort((a, b) => a.title.localeCompare(b.title));

    return filtered.reduce((groups, song) => {
      const letter = song.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
      return groups;
    }, {});
  }, [searchValue, songs]);

  const alphabet = Object.keys(filteredAndGrouped).sort();

  return (
    <main className="min-h-[90vh] bg-white pb-24 relative">
      <div className="px-8 py-4">
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-neutral-500" size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search library..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 transition-all shadow-sm"
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : alphabet.length > 0 ? (
          <div className="flex flex-col gap-y-12">
            {alphabet.map((letter) => (
              <div key={letter} className="flex flex-col gap-y-4">
                <div className="border-b border-neutral-100 pb-2">
                  <h2 className="text-2xl font-black text-red-600 uppercase">{letter}</h2>
                </div>
                <div className="flex flex-col gap-y-1">
                  {filteredAndGrouped[letter].map((song, index) => (
                    <SongItem key={song.id} song={song} number={index + 1} onClick={() => setActiveSong(song)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400 font-bold uppercase text-[10px] py-20">No matches found</p>
        )}
      </div>
      {activeSong && <Player song={activeSong} key={activeSong.id} songs={songs} onSongSelect={setActiveSong} />}
    </main>
  );
}