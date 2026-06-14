"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditLinkForm({ id, initial, onSaved }: { id: number; initial: { originalUrl: string; shortCode: string }; onSaved?: (updated: { id: number; originalUrl: string; shortCode: string }) => void }) {
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState(initial.originalUrl);
  const [shortCode, setShortCode] = useState(initial.shortCode);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/links/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, originalUrl, shortCode }),
    });
    setLoading(false);
    if (res.ok) {
      if (onSaved) {
        onSaved({ id, originalUrl, shortCode });
      } else {
        router.push('/dashboard');
      }
    } else alert('Update failed');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-card border border-border rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Short Code</label>
        <input value={shortCode} onChange={(e) => setShortCode(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Original URL</label>
        <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} className="w-full rounded-md border border-border bg-input px-3 py-2" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="rounded px-3 py-2 bg-primary text-primary-foreground">Save</button>
        <button type="button" onClick={() => router.push('/dashboard')} className="rounded px-3 py-2 border border-border">Cancel</button>
      </div>
    </form>
  );
}
