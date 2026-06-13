"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LinkItem = {
  id: number;
  shortCode: string;
  originalUrl: string;
  createdAt: string | null;
  createdAtFormatted?: string | null;
};

export default function LinksList({ initialLinks }: { initialLinks: LinkItem[] }) {
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>(initialLinks || []);
  const [sort, setSort] = useState<"newest" | "oldest" | "alpha">("newest");

  const sorted = useMemo(() => {
    const copy = [...links];
    if (sort === "newest") {
      copy.sort((a, b) => (Number(new Date(b.createdAt ?? 0)) - Number(new Date(a.createdAt ?? 0))));
    } else if (sort === "oldest") {
      copy.sort((a, b) => (Number(new Date(a.createdAt ?? 0)) - Number(new Date(b.createdAt ?? 0))));
    } else {
      copy.sort((a, b) => a.shortCode.localeCompare(b.shortCode));
    }
    return copy;
  }, [links, sort]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this link permanently?")) return;
    const res = await fetch("/api/links/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setLinks((s) => s.filter((l) => l.id !== id));
    else alert("Failed to delete");
  }

  function handleEdit(id: number) {
    router.push(`/dashboard/edit/${id}`);
  }

  function handleCopyShort(shortCode: string) {
    try {
      const origin = window.location.origin;
      const url = `${origin}/${shortCode}`;
      navigator.clipboard.writeText(url);
      alert("Short URL copied");
    } catch (e) {
      alert("Copy failed");
    }
  }

  function faviconFor(url: string) {
    try {
      const host = new URL(url).hostname;
      return `https://s2.googleusercontent.com/s2/favicons?domain=${encodeURIComponent(host)}`;
    } catch (e) {
      return "/favicon.ico";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="ml-2 rounded-md border border-border bg-input px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((link) => (
          <article key={link.id} className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex items-center gap-4">
            <img src={faviconFor(link.originalUrl)} alt="icon" className="w-10 h-10 rounded-md" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold truncate">{link.shortCode}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleCopyShort(link.shortCode)} className="text-sm text-muted-foreground hover:text-foreground">Copy</button>
                  <button onClick={() => handleEdit(link.id)} className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
                  <button onClick={() => handleDelete(link.id)} className="text-sm text-destructive hover:underline">Delete</button>
                </div>
              </div>

              <a href={link.originalUrl} target="_blank" rel="noreferrer" className="block text-sm text-muted-foreground truncate mt-1">
                {link.originalUrl}
              </a>

              <div className="mt-2 text-sm text-muted-foreground">Created: {link.createdAtFormatted ?? (link.createdAt ? new Date(link.createdAt).toISOString().slice(0,10) : '—')}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
