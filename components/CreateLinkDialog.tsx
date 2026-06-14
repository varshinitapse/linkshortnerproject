"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, shortCode }),
      });
      const body = await res.json();
      setLoading(false);
      if (res.ok && body?.link) {
        // normalize returned link and dispatch event so lists can update instantly
        const link = body.link;
        // ensure id is numeric when possible
        const parsedId = link.id ? Number(link.id) : undefined;
        if (link.id && Number.isNaN(parsedId)) {
          // if id cannot be parsed, fallback to refresh (server will show the link)
          setOpen(false);
          setOriginalUrl("");
          setShortCode("");
          try { router.refresh(); } catch (e) {}
          return;
        }
        const item = {
          id: parsedId ?? link.id,
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          createdAt: link.createdAt ? String(link.createdAt) : null,
          createdAtFormatted: link.createdAt ? new Date(String(link.createdAt)).toLocaleDateString('en-US') : null,
        };
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('link:created', { detail: item }));
        }

        setOpen(false);
        setOriginalUrl("");
        setShortCode("");
        // router.refresh() as a fallback (keeps server state in sync)
        try { router.refresh(); } catch (e) {}
      } else {
        alert(body?.error || 'Create failed');
      }
    } catch (err) {
      setLoading(false);
      alert('Create failed');
    }
  }

  return (
    <div className="mb-6">
      <button onClick={() => setOpen(true)} className="rounded px-3 py-2 bg-primary text-primary-foreground">New Link</button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Link</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Short Code</label>
                <input value={shortCode} onChange={(e) => setShortCode(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Original URL</label>
                <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2" />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="rounded px-3 py-2 border border-border">Cancel</button>
                <button type="submit" disabled={loading} className="rounded px-3 py-2 bg-primary text-primary-foreground">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
