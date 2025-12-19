"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc,
  Repeat,
  RotateCcw,
  SkipBack,
  SkipForward,
  Shuffle,
} from "lucide-react";

const Player = ({ song, songs, onSongSelect }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false); // Added Shuffle State
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const currentIndex = songs.findIndex((s) => s.id === song.id);

  useEffect(() => {
    if (song) {
      const { data } = supabase.storage
        .from("songs")
        .getPublicUrl(song.song_path);

      setAudioUrl(data.publicUrl);
      setIsPlaying(true);
    }
  }, [song]);

  const onPlayNext = () => {
    if (songs.length <= 1) return;

    if (isShuffle) {
      // Logic for random song that isn't the current one
      let randomIndex = currentIndex;
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      onSongSelect(songs[randomIndex]);
    } else {
      // Normal logic: Wrap back to 0 if at the end
      const nextIndex = (currentIndex + 1) % songs.length;
      onSongSelect(songs[nextIndex]);
    }
  };

  const onPlayPrevious = () => {
    if (songs.length <= 1) return;

    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    onSongSelect(songs[prevIndex]);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!song || !audioUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 py-3 z-[100] shadow-2xl">
      {/* Progress Bar Container */}
      <div className="absolute -top-1 left-0 w-full h-2 group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const time = Number(e.target.value);
            audioRef.current.currentTime = time;
            setCurrentTime(time);
          }}
          className="absolute top-0 left-0 w-full h-1 accent-red-600 bg-neutral-100 cursor-pointer appearance-none transition-all group-hover:h-2"
        />
      </div>

      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-x-10">
        {/* Track Info */}
        <div className="flex items-center gap-x-4 w-[30%] min-w-0">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg shadow-red-100">
            <Disc
              className={`text-white ${isPlaying ? "animate-spin-slow" : ""}`}
              size={24}
            />
          </div>
          <div className="truncate">
            <p className="font-bold text-sm text-neutral-900 truncate">
              {song.title}
            </p>
            <p className="text-xs text-neutral-500 truncate">{song.author}</p>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center gap-y-1 flex-1">
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`${
                isShuffle ? "text-red-600" : "text-neutral-400"
              } hover:text-red-500 transition`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={onPlayPrevious}
              className="text-neutral-600 hover:text-red-600 transition"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-red-600 rounded-full p-3 text-white hover:scale-110 active:scale-95 transition shadow-lg shadow-red-200"
            >
              {isPlaying ? (
                <Pause size={28} fill="white" />
              ) : (
                <Play size={28} fill="white" className="ml-1" />
              )}
            </button>

            <button
              onClick={onPlayNext}
              className="text-neutral-600 hover:text-red-600 transition"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`${
                isLooping ? "text-red-600" : "text-neutral-400"
              } hover:text-red-500 transition`}
              title="Repeat"
            >
              <Repeat size={18} />
            </button>
          </div>
          <div className="text-[10px] text-neutral-400 font-bold tracking-widest tabular-nums uppercase">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-x-3 w-[30%] justify-end">
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              audioRef.current.muted = newMuted;
            }}
            className="text-neutral-400 hover:text-red-600 transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              audioRef.current.volume = v;
              if (v > 0) setIsMuted(false);
            }}
            className="w-20 md:w-32 h-1 accent-red-600 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        loop={isLooping}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={onPlayNext} // Automatically triggers the shuffle/next logic
        autoPlay
      />
    </div>
  );
};

export default Player;
