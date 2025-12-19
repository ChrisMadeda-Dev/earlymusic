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
} from "lucide-react";

const Player = ({ song, songs, onSongSelect }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
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
    const nextIndex = (currentIndex + 1) % songs.length;
    onSongSelect(songs[nextIndex]);
  };

  const onPlayPrevious = () => {
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    onSongSelect(songs[prevIndex]);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!song || !audioUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-t border-neutral-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {/* 1. PROGRESS BAR - Edge-to-Edge */}
      <div className="absolute -top-[1px] left-0 w-full h-[3px] bg-neutral-100 group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const time = Number(e.target.value);
            if (audioRef.current) {
              audioRef.current.currentTime = time;
              setCurrentTime(time);
            }
          }}
          className="absolute top-0 left-0 w-full h-full accent-red-600 bg-transparent cursor-pointer appearance-none z-10"
        />
        <div
          className="absolute top-0 left-0 h-full bg-red-600 transition-all pointer-events-none"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-3 md:px-8 md:py-4">
        <div className="flex flex-col md:flex-row items-center gap-y-3 md:justify-between">
          {/* TRACK INFO BLOCK */}
          <div className="flex items-center justify-between w-full md:w-[30%] min-w-0">
            <div className="flex items-center gap-x-3 min-w-0">
              <div className="w-10 h-10 bg-neutral-900 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg">
                <Disc
                  className={`text-white ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                  size={18}
                />
              </div>
              <div className="truncate">
                <p className="font-black text-[12px] text-neutral-900 truncate uppercase tracking-tighter leading-none mb-1">
                  {song.title}
                </p>
                <p className="text-[10px] font-bold text-neutral-400 truncate uppercase tracking-widest">
                  {song.author}
                </p>
              </div>
            </div>

            {/* Mobile Loop/Restart Toggle */}
            <div className="flex items-center gap-x-4 md:hidden text-neutral-300">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={isLooping ? "text-red-600" : ""}
              >
                <Repeat size={16} />
              </button>
              <button
                onClick={() => {
                  audioRef.current.currentTime = 0;
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* PLAYBACK CONTROLS BLOCK */}
          <div className="flex flex-col items-center gap-y-1 w-full md:flex-1">
            <div className="flex items-center justify-center gap-x-8 md:gap-x-10">
              <button
                onClick={onPlayPrevious}
                className="text-neutral-900 active:scale-90 transition"
              >
                <SkipBack size={24} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="bg-red-600 rounded-full h-12 w-12 md:h-14 md:w-14 flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button
                onClick={onPlayNext}
                className="text-neutral-900 active:scale-90 transition"
              >
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>

            <div className="text-[9px] text-neutral-400 font-black tracking-[0.2em] tabular-nums uppercase">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* VOLUME BLOCK - Hidden on very small screens, shown on tablets up */}
          <div className="hidden sm:flex items-center gap-x-3 w-full md:w-[30%] justify-end">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-red-600 transition"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
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
                if (audioRef.current) {
                  audioRef.current.volume = v;
                }
                if (v > 0) setIsMuted(false);
              }}
              className="w-24 h-1 accent-red-600 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        loop={isLooping}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={onPlayNext}
        autoPlay
      />
    </div>
  );
};

export default Player;
