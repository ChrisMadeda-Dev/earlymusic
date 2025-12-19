"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePlayer } from "./context/PlayerContext";
import Loader from "./components/Loader";
import SongItem from "./components/SongItem";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { setSongs, setActiveSong, songs } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from("songs")
        .select("*")
        .order("title", { ascending: true });
      if (data) setSongs(data);
      setIsLoading(false);
    };
    fetchSongs();
  }, [setSongs]);

  const groupedSongs = useMemo(() => {
    return (songs || []).reduce((groups, song) => {
      const letter = song.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
      return groups;
    }, {});
  }, [songs]);

  const alphabet = Object.keys(groupedSongs).sort();

  return (
    <div className="px-6 py-4">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-y-12">
          {alphabet.map((letter) => (
            <div key={letter} className="flex flex-col gap-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">
                  {letter}
                </h2>
              </div>
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
      )}
    </div>
  );
}
