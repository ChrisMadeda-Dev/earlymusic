"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "./components/Header";
import SongList from "./components/SongList";
import Player from "./components/Player";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [activeSong, setActiveSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setSongs(data);
    };
    fetchSongs();
  }, []);

  return (
    <main className="min-h-[90vh] bg-white pb-24 relative">
      <Header />
      <div className="px-8 py-4">
        <SongList songs={songs} onSongSelect={(song) => setActiveSong(song)} />
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
