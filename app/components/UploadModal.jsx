"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

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

      // 1. Upload file to Supabase Storage
      const fileExt = songFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(filePath, songFile);

      if (uploadError) throw uploadError;

      // 2. Insert record to Database
      const { error: dbError } = await supabase.from("songs").insert({
        title: title,
        author: author,
        song_path: filePath,
      });

      if (dbError) throw dbError;

      onSuccess(); // Trigger refresh in page.js
      onClose(); // Close modal
      setTitle("");
      setAuthor("");
      setSongFile(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading song. Check console.");
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

        <h2 className="text-2xl font-bold mb-1 text-neutral-900">
          Upload Track
        </h2>
        <p className="text-neutral-500 mb-6 text-sm">
          Add your latest creation to the library.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-bold uppercase text-neutral-400 ml-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Ujazaye"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-bold uppercase text-neutral-400 ml-1">
              Artist
            </label>
            <input
              type="text"
              placeholder="e.g., Pastor Marita Mbae"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition"
              required
            />
          </div>

          <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 hover:border-red-300 transition cursor-pointer relative">
            <input
              type="file"
              accept=".mp3"
              onChange={(e) => setSongFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <p className="text-sm font-bold text-neutral-700">
                {songFile ? songFile.name : "Choose MP3 File"}
              </p>
              <p className="text-xs text-neutral-400 mt-1">Audio files only</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 py-4 rounded-xl text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Uploading Track..." : "Publish to earlymusic"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
