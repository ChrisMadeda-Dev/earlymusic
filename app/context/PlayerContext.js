"use client";

import { createContext, useContext, useState, useCallback } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [activeSong, setActiveSongState] = useState(null);
  const [allSongs, setAllSongs] = useState([]); // Master list for Home
  const [queue, setQueue] = useState([]); // Current playback list
  const [isLoading, setIsLoading] = useState(true);

  const setActiveSong = useCallback(
    (song, customQueue = null) => {
      setActiveSongState(song);
      // If we provide a specific list (like Library), play from that.
      // Otherwise, default to the master list.
      setQueue(customQueue || allSongs);
    },
    [allSongs]
  );

  return (
    <PlayerContext.Provider
      value={{
        activeSong,
        setActiveSong,
        allSongs,
        setAllSongs,
        queue,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
