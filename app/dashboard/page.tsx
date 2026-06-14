import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '../db';
import { links } from '../db/schema';
import { eq } from 'drizzle-orm';
import LinksList from '../../components/LinksList';
import CreateLinkDialog from '../../components/CreateLinkDialog';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const userId = user.id;

  const userLinks = await db.select().from(links).where(eq(links.userId, userId));

  // serialize dates for client component
  const serialized = userLinks.map((l) => ({
    id: l.id,
    shortCode: l.shortCode,
    originalUrl: l.originalUrl,
    createdAt: l.createdAt ? String(l.createdAt) : null,
    // format server-side to a deterministic locale (en-US) to avoid hydration mismatches
    createdAtFormatted: l.createdAt ? new Date(String(l.createdAt)).toLocaleDateString('en-US') : null,
  }));

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">My Links</h1>
        {/* @ts-expect-error Server -> Client component */}
        <CreateLinkDialog />
      </div>

      {serialized.length === 0 ? (
        <p className="text-muted-foreground">You don't have any links yet.</p>
      ) : (
        // @ts-expect-error Server -> Client serializable prop
        <LinksList initialLinks={serialized} />
      )}
    </main>
  );
}
