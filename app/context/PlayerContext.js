"use client";

import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [activeSong, setActiveSong] = useState(null);
  const [songs, setSongs] = useState([]);

  return (
    <PlayerContext.Provider
      value={{ activeSong, setActiveSong, songs, setSongs }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
