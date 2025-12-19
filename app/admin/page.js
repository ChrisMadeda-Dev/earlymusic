"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Trash2, Upload, ArrowLeft, Loader2 } from "lucide-react";
import UploadModal from "../components/UploadModal";

export default function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  useEffect(() => {
    const checkAuth = () => {
      const sessionAuth = localStorage.getItem("admin_auth");

      if (sessionAuth === ADMIN_PASSWORD) {
        setIsAuthorized(true);
        fetchSongs();
      } else {
        const password = prompt("Admin Access Required:");
        if (password === ADMIN_PASSWORD) {
          localStorage.setItem("admin_auth", password);
          setIsAuthorized(true);
          fetchSongs();
        } else {
          router.push("/");
        }
      }
      setLoading(false);
    };
    checkAuth();
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
              onClick={() => router.push("/")}
              className="text-neutral-400 hover:text-red-600 flex items-center gap-2 mb-2 transition"
            >
              <ArrowLeft size={16} /> Exit Panel
            </button>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
              Management
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Upload size={18} /> New Track
          </button>
        </header>

        <div className="grid gap-3">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-neutral-50 p-5 rounded-2xl flex items-center justify-between group border border-transparent hover:border-neutral-200 transition-all"
            >
              <div>
                <p className="font-bold text-neutral-900">{song.title}</p>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                  {song.author}
                </p>
              </div>
              <button
                onClick={() => handleDelete(song.id, song.song_path)}
                className="text-neutral-200 hover:text-red-600 transition"
              >
                <Trash2 size={20} />
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
