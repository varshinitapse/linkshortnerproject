"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EditLinkForm from "./EditLinkForm";

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
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LinkItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    // open confirm dialog instead
    setDeletingId(id);
    setDeleteOpen(true);
  }

  function handleEdit(id: number) {
    const item = links.find((l) => l.id === id);
    if (!item) return;
    setEditing(item);
    setEditOpen(true);
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

  // Listen for newly created links dispatched from other client components
  React.useEffect(() => {
    function onCreated(e: Event) {
      try {
        // CustomEvent detail contains the LinkItem
        // @ts-ignore
        const detail = (e as CustomEvent).detail as LinkItem;
        if (!detail) return;
        setLinks((s) => [detail, ...s]);
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener('link:created', onCreated as EventListener);
    return () => window.removeEventListener('link:created', onCreated as EventListener);
  }, []);

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

      {/* Edit modal */}
      {editOpen && editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Link</h2>
            <EditLinkForm
              id={editing.id}
              initial={{ originalUrl: editing.originalUrl, shortCode: editing.shortCode }}
              // update local state on save
              onSaved={(updated: { id: number; originalUrl: string; shortCode: string }) => {
                setLinks((s) => s.map((l) => (l.id === updated.id ? { ...l, originalUrl: updated.originalUrl, shortCode: updated.shortCode } : l)));
                setEditOpen(false);
                setEditing(null);
              }}
            />
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => { setEditOpen(false); setEditing(null); }} className="rounded px-3 py-2 border border-border">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete link</h2>
            <p className="mb-4">Are you sure you want to delete this link? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setDeleteOpen(false); setDeletingId(null); }} className="rounded px-3 py-2 border border-border">Cancel</button>
              <button onClick={async () => {
                if (!deletingId) return;
                const res = await fetch('/api/links/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deletingId }) });
                if (res.ok) setLinks((s) => s.filter((l) => l.id !== deletingId));
                else alert('Failed to delete');
                setDeleteOpen(false);
                setDeletingId(null);
              }} className="rounded px-3 py-2 bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// component-level state additions

