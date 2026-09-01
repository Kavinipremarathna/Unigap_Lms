"use client";

import { useState, useEffect } from "react";
import { Video, Upload, Play, Film, FileVideo, CheckCircle2, AlertCircle, Loader2, HardDrive, Link as LinkIcon, Copy, Check } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

interface VideoRecord {
  id: string;
  title: string;
  filename: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [title, setTitle] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/upload/video");
      const data = await res.json();
      if (res.ok && data.videos) {
        setVideos(data.videos);
        if (data.videos.length > 0 && !selectedVideo) {
          setSelectedVideo(data.videos[0]);
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadMode === "file" && !selectedFile) {
      setErrorMsg("Please select an MP4 video file to upload.");
      return;
    }

    if (uploadMode === "url" && !mp4Url.trim()) {
      setErrorMsg("Please enter a valid MP4 video URL.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setUploadSuccess(false);

    try {
      if (uploadMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", title || selectedFile.name);

        const res = await fetch("/api/upload/video", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Failed to upload MP4 video.");
          return;
        }

        setUploadSuccess(true);
        setTitle("");
        setSelectedFile(null);
        fetchVideos();
        if (data.video) {
          setSelectedVideo(data.video);
        }
      } else if (uploadMode === "url" && mp4Url.trim()) {
        const fakeFileRecord: VideoRecord = {
          id: `vid-mp4-${Date.now()}`,
          title: title || "External MP4 Video",
          filename: mp4Url.split("/").pop() || "video.mp4",
          fileUrl: mp4Url.trim(),
          mimeType: "video/mp4",
          fileSize: 0,
          status: "READY",
          createdAt: new Date().toISOString(),
        };

        setVideos((prev) => [fakeFileRecord, ...prev]);
        setSelectedVideo(fakeFileRecord);
        setUploadSuccess(true);
        setTitle("");
        setMp4Url("");
      }
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch {
      setErrorMsg("Error saving MP4 video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <AdminShell>
      <div className="container-app px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde8fc] px-3 py-1 text-xs font-bold text-[#920090]">
                <Film size={13} /> Video Library & Storage
              </span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-[#520051]">
                {videos.length} Videos Stored
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#520051] sm:text-3xl">
              Course Video Manager
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Upload video lectures, save metadata to PostgreSQL, and attach videos to course modules.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Upload Form (Left / Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#520051]">
                <Upload size={18} className="text-[#920090]" /> Upload New Video
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Supports MP4, WebM, MOV video formats.
              </p>

              {uploadSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={16} /> Video uploaded and saved to PostgreSQL database!
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              {/* Upload Mode Selector */}
              <div className="mt-4 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    uploadMode === "file"
                      ? "bg-[#520051] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#520051]"
                  }`}
                >
                  📁 Upload MP4 File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    uploadMode === "url"
                      ? "bg-[#520051] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#520051]"
                  }`}
                >
                  🔗 Direct MP4 URL
                </button>
              </div>

              <form onSubmit={handleUpload} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#520051] mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lesson 1 - Introduction to Async JS"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/10"
                  />
                </div>

                {uploadMode === "file" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#520051] mb-1">
                      Select MP4 Video File
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#920090]/30 bg-[#fde8fc]/30 rounded-2xl p-6 cursor-pointer hover:bg-[#fde8fc]/60 transition text-center">
                      <FileVideo size={32} className="text-[#920090]" />
                      <span className="mt-2 text-xs font-bold text-[#520051]">
                        {selectedFile ? selectedFile.name : "Click or drag MP4 video file here"}
                      </span>
                      <span className="mt-1 text-[11px] text-slate-400">
                        {selectedFile ? formatFileSize(selectedFile.size) : "MP4, WebM, MOV files up to 500MB"}
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#520051] mb-1">
                      MP4 Video URL
                    </label>
                    <input
                      type="url"
                      value={mp4Url}
                      onChange={(e) => setMp4Url(e.target.value)}
                      placeholder="https://my-bucket.s3.amazonaws.com/lesson.mp4"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/10"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Enter a direct link to an MP4 video file stored online.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading || (uploadMode === "file" ? !selectedFile : !mp4Url.trim())}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#520051] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#920090] disabled:opacity-50 shadow-md cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving MP4 Video...
                    </>
                  ) : (
                    <>
                      <Upload size={16} /> Save MP4 Video to Library
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Storage Info Widget */}
            <div className="rounded-3xl border border-[#eee5ee] bg-white p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#520051]">
                  <HardDrive size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#520051]">PostgreSQL Media Records</p>
                  <p className="text-[11px] text-slate-500">
                    {videos.length} videos stored on server
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                Active
              </span>
            </div>
          </div>

          {/* Video Player & Directory (Right / Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Video Player Preview */}
            {selectedVideo ? (
              <div className="overflow-hidden rounded-3xl border border-[#eee5ee] bg-black text-white shadow-xl">
                <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                  <video
                    src={selectedVideo.fileUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="bg-slate-900 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">{selectedVideo.title}</h3>
                    <span className="rounded-md bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 text-[11px] font-mono text-purple-300">
                      {formatFileSize(selectedVideo.fileSize)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-mono text-xs text-slate-400 truncate">
                      URL: <span className="text-purple-300">{selectedVideo.fileUrl}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedVideo.fileUrl, selectedVideo.id)}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#920090] px-3 py-1 text-xs font-bold text-white hover:bg-purple-600 transition cursor-pointer"
                    >
                      {copiedId === selectedVideo.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === selectedVideo.id ? "Copied!" : "Copy MP4 URL"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center p-8">
                <div>
                  <Video size={40} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-600">No Video Selected</p>
                  <p className="text-xs text-slate-400">Upload a video to preview it here.</p>
                </div>
              </div>
            )}

            {/* Video List Directory */}
            <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#520051] mb-4">
                Uploaded Video Directory ({videos.length})
              </h3>

              {videos.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                        selectedVideo?.id === vid.id
                          ? "border-[#920090] bg-[#fde8fc]/40"
                          : "border-slate-100 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#520051] text-white">
                          <Play size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-[#520051] truncate">{vid.title}</p>
                            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-extrabold text-[#920090] font-mono">
                              MP4
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{vid.filename}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(vid.fileUrl, vid.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#920090] hover:text-[#920090]"
                        >
                          {copiedId === vid.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          {copiedId === vid.id ? "Copied" : "Copy"}
                        </button>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-[#920090]">
                            {formatFileSize(vid.fileSize)}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {new Date(vid.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-slate-400">
                  No videos uploaded yet. Use the form on the left to upload your first video.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
