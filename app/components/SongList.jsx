"use client";

import SongItem from "./SongItem";
import { Disc } from "lucide-react";

const SongList = ({ songs = [], onSongSelect }) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Disc className="text-red-600 animate-spin-slow" size={32} />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No music found</h3>
        <p className="text-neutral-500 text-sm max-w-[240px]">
          There are no tracks currently available in the public library.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          onClick={() => onSongSelect(song)}
        />
      ))}
    </div>
  );
};

export default SongList;
