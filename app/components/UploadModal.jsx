"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, UploadCloud } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!songFile || !title || !author) return alert("Please fill all fields");

    try {
      setIsLoading(true);

      const fileExt = songFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(filePath, songFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("songs").insert({
        title: title,
        author: author,
        song_path: filePath,
      });

      if (dbError) throw dbError;

      onSuccess();
      onClose();
      setTitle("");
      setAuthor("");
      setSongFile(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading song.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl border border-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-1 text-neutral-900 tracking-tighter uppercase">
          Upload Track
        </h2>
        <p className="text-neutral-500 mb-6 text-xs font-bold uppercase tracking-wider">
          Add to library
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <label className="text-[10px] font-black uppercase text-neutral-500 ml-1 tracking-widest">
              Track Title
            </label>
            <input
              type="text"
              placeholder="e.g., Ujazaye"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-neutral-900 font-bold placeholder:text-neutral-400 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-[10px] font-black uppercase text-neutral-500 ml-1 tracking-widest">
              Artist Name
            </label>
            <input
              type="text"
              placeholder="e.g., Pastor Marita Mbae"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-neutral-900 font-bold placeholder:text-neutral-400 transition"
              required
            />
          </div>

          <div className="p-6 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 hover:border-red-300 transition cursor-pointer relative group">
            <input
              type="file"
              accept=".mp3"
              onChange={(e) => setSongFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              required
            />
            <div className="text-center flex flex-col items-center">
              <UploadCloud
                className={`mb-2 ${
                  songFile
                    ? "text-red-600"
                    : "text-neutral-300 group-hover:text-red-400"
                } transition-colors`}
                size={32}
              />
              <p className="text-sm font-black text-neutral-900 truncate max-w-full px-2">
                {songFile ? songFile.name : "Choose MP3 File"}
              </p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">
                Max size: 10MB
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 py-4 rounded-xl text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Uploading..." : "Publish Track"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
