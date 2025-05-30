import React, { useRef, useState } from "react";
import { Button } from "./button";

export default function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      } else {
        setError("Upload failed");
      }
    } catch (e) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
      />
      <Button type="button" onClick={() => fileInput.current?.click()} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
