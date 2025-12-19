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
      try {
        const { data } = await supabase
          .from("songs")
          .select("*")
          .order("title", { ascending: true });
        if (data) setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
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
    <main className="min-h-[90vh] bg-white px-6 py-8 pb-32">
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-y-10">
            {alphabet.map((letter) => (
              <div key={letter} className="flex flex-col gap-y-4">
                {/* ALPHABETIC HEADER - Simple Font */}
                <div className="flex items-center gap-x-4 border-b border-neutral-50 pb-3 px-2">
                  <h2 className="text-3xl font-semibold text-red-600 tracking-tight">
                    {letter}
                  </h2>
                  <div className="h-[1px] flex-1 bg-transparent" />
                </div>

                {/* TRACK LISTING */}
                <div className="flex flex-col gap-y-1">
                  {groupedSongs[letter].map((song) => (
                    <SongItem
                      key={song.id}
                      song={song}
                      // Number prop removed for the clean simple font look
                      onClick={() => setActiveSong(song)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
