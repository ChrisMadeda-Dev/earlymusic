"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Trash2, Upload, ArrowLeft, ShieldCheck } from "lucide-react";
import UploadModal from "../components/UploadModal";

export default function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const timeoutRef = useRef(null);
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/");
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // 5 Minute Inactivity Timeout
    timeoutRef.current = setTimeout(() => handleLogout(), 300000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const sessionAuth = sessionStorage.getItem("admin_auth");

      if (sessionAuth === ADMIN_PASSWORD && ADMIN_PASSWORD) {
        setIsAuthorized(true);
        fetchSongs();
        setupListeners();
      } else {
        const password = prompt("Admin Access Required:");
        if (password === ADMIN_PASSWORD && ADMIN_PASSWORD) {
          sessionStorage.setItem("admin_auth", password);
          setIsAuthorized(true);
          fetchSongs();
          setupListeners();
        } else {
          router.push("/");
        }
      }
      setLoading(false);
    };

    const setupListeners = () => {
      resetTimer();
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
    };

    checkAuth();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      sessionStorage.removeItem("admin_auth");
    };
  }, [router, ADMIN_PASSWORD]);

  const fetchSongs = async () => {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSongs(data);
  };

  const handleDelete = async (id, path) => {
    if (!confirm("Delete track?")) return;
    try {
      await supabase.storage.from("songs").remove([path]);
      await supabase.from("songs").delete().eq("id", id);
      fetchSongs();
    } catch (err) {
      alert("Error deleting track");
    }
  };

  if (loading) return null;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-[90vh] bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-600 flex items-center gap-2 mb-2 transition"
            >
              <ArrowLeft size={16} /> Exit & Lock
            </button>
            <div className="flex items-center gap-x-2">
              <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
                Management
              </h1>
              <ShieldCheck size={20} className="text-green-500" />
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Upload size={18} /> New Track
          </button>
        </header>

        <div className="grid gap-2">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="bg-neutral-50 p-4 rounded-xl flex items-center justify-between group border border-transparent hover:border-neutral-200 transition-all"
            >
              <div className="flex items-center gap-x-4">
                <span className="text-[10px] font-black text-neutral-300 w-4">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-neutral-900 text-sm">
                    {song.title}
                  </p>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                    {song.author}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(song.id, song.song_path)}
                className="text-neutral-200 hover:text-red-600 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSongs}
      />
    </div>
  );
}
