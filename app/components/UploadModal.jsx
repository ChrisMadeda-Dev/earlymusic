"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, UploadCloud } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!songFile || !title || !author) return alert("Please fill all fields");

    try {
      setIsLoading(true);
      setUploadProgress(0);

      const fileExt = songFile.name.split(".").pop();
      // Using a timestamp for better uniqueness
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // UPLOAD WITH PROGRESS HANDLING
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("songs")
        .upload(filePath, songFile, {
          cacheControl: "3600",
          upsert: false,
          // Use the native progress event
          onUploadProgress: (progressEvent) => {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            // Use Math.floor to avoid jittery 100% before completion
            setUploadProgress(Math.floor(percent));
          },
        });

      if (uploadError) throw uploadError;

      // DATABASE INSERT
      const { error: dbError } = await supabase.from("songs").insert({
        title: title,
        author: author,
        song_path: filePath,
      });

      if (dbError) throw dbError;

      onSuccess();
      onClose();
      // Reset form
      setTitle("");
      setAuthor("");
      setSongFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Error uploading song.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-1 text-neutral-900 tracking-tight">
          Upload Track
        </h2>
        <p className="text-neutral-500 mb-6 text-sm">
          Add a new song to your library.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-medium text-neutral-500 ml-1">
              Track Title
            </label>
            <input
              type="text"
              placeholder="e.g., Ujazaye"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white text-neutral-900 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-medium text-neutral-500 ml-1">
              Artist Name
            </label>
            <input
              type="text"
              placeholder="e.g., Pastor Marita Mbae"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 focus:bg-white text-neutral-900 transition"
              required
            />
          </div>

          <div className="p-6 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 hover:border-red-300 transition cursor-pointer relative group">
            <input
              type="file"
              accept="audio/mpeg, audio/mp3"
              onChange={(e) => setSongFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              required={!isLoading}
              disabled={isLoading}
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
              <p className="text-sm text-neutral-600 truncate max-w-full px-2">
                {songFile ? songFile.name : "Select MP3 File"}
              </p>
            </div>
          </div>

          {/* PROGRESS BAR SECTION */}
          {isLoading && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <div className="flex justify-between items-center text-xs font-medium text-red-600">
                <span>
                  {uploadProgress === 100
                    ? "Finalizing..."
                    : "Uploading track..."}
                </span>
                <span className="tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 py-3.5 rounded-xl text-white font-medium hover:bg-neutral-900 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? `Publishing...` : "Publish Track"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
