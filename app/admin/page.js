"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Upload,
  ArrowLeft,
  ShieldCheck,
  Music2,
  Search,
} from "lucide-react";
import UploadModal from "../components/UploadModal";
import { usePlayer } from "../context/PlayerContext";

export default function AdminDashboard() {
  const { songs, setSongs } = usePlayer();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const timeoutRef = useRef(null);
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogout = () => {
    setIsAuthorized(false);
    router.replace("/");
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => handleLogout(), 300000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const password = prompt("Admin Access Required:");

      if (password === ADMIN_PASSWORD && ADMIN_PASSWORD) {
        setIsAuthorized(true);
        fetchSongs();
      } else {
        router.replace("/");
      }
      setLoading(false);
    };

    checkAuth();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsAuthorized(false);
    };
  }, [router, ADMIN_PASSWORD]);

  const fetchSongs = async () => {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("title", { ascending: true });
    if (data) setSongs(data);
  };

  const handleDelete = async (id, path) => {
    const isConfirmed = confirm("Permanently delete this track?");
    if (!isConfirmed) return;

    try {
      await supabase.storage.from("songs").remove([path]);
      const { error: dbError } = await supabase
        .from("songs")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      setSongs((prev) => prev.filter((s) => s.id !== id));
      handleLogout();
    } catch (err) {
      console.error(err);
      alert("Deletion failed.");
    }
  };

  const groupedSongs = useMemo(() => {
    const filtered = (songs || []).filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((groups, song) => {
      const letter = song.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
      return groups;
    }, {});
  }, [songs, searchQuery]);

  const alphabet = Object.keys(groupedSongs).sort();

  if (loading || !isAuthorized) return null;

  return (
    <div className="min-h-[90vh] bg-white p-6 md:p-10 pb-40">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col gap-y-10 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-600 flex items-center gap-2 mb-4 transition font-semibold text-[13px]"
              >
                <ArrowLeft size={14} /> Lock Vault
              </button>
              <div className="flex items-center gap-x-4">
                <h1 className="text-6xl font-semibold text-neutral-900 tracking-tight">
                  Vault
                </h1>
                <ShieldCheck size={28} className="text-red-600" />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white px-10 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-neutral-900 transition-all shadow-xl shadow-red-100 active:scale-95 text-sm"
            >
              <Upload size={18} strokeWidth={2.5} /> Upload Track
            </button>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-5 pl-16 pr-8 outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-neutral-900 text-[15px]"
            />
          </div>
        </header>

        {/* ALPHABETICAL LISTING */}
        <div className="flex flex-col gap-y-12">
          {alphabet.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center border border-dashed border-neutral-100 rounded-[2rem] text-neutral-200">
              <Music2 size={48} strokeWidth={1.5} className="mb-4 opacity-20" />
              <p className="font-medium text-[13px] text-neutral-400">
                No tracks found in the vault
              </p>
            </div>
          ) : (
            alphabet.map((letter) => (
              <div key={letter} className="flex flex-col gap-y-4">
                <div className="flex items-center gap-x-4 px-2">
                  <h2 className="text-3xl font-semibold text-red-600 tracking-tight">
                    {letter}
                  </h2>
                  <div className="h-[1px] flex-1 bg-neutral-50" />
                </div>

                <div className="flex flex-col gap-y-1">
                  {groupedSongs[letter].map((song) => (
                    <div
                      key={song.id}
                      className="bg-white p-4 rounded-2xl flex items-center justify-between group hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-300"
                    >
                      <div className="flex items-center gap-x-6">
                        <div className="h-10 w-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-300 border border-neutral-100">
                          <Music2 size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-[15px] leading-tight mb-0.5 tracking-tight">
                            {song.title}
                          </p>
                          <p className="text-[13px] text-neutral-500 font-medium">
                            {song.author}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(song.id, song.song_path)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchSongs();
          handleLogout();
        }}
      />
    </div>
  );
}
