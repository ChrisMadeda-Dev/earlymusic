"use client";

import { usePlayer } from "../context/PlayerContext";
import Player from "./Player";

export default function PlayerWrapper() {
  const { activeSong, songs, setActiveSong } = usePlayer();

  if (!activeSong) return null;

  return (
    <Player song={activeSong} songs={songs} onSongSelect={setActiveSong} />
  );
}
