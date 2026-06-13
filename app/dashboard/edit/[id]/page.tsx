import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '../../../../app/db';
import { links } from '../../../../app/db/schema';
import { eq } from 'drizzle-orm';
import EditLinkForm from '../../../../../components/EditLinkForm';

type Props = { params: { id: string } };

export default async function EditLinkPage({ params }: Props) {
  const user = await currentUser();
  if (!user) redirect('/');

  const id = Number(params.id);
  const result = await db.select().from(links).where(eq(links.id, id));
  const link = result[0];
  if (!link) redirect('/dashboard');

  if (link.userId !== user.id) redirect('/dashboard');

  const initial = { originalUrl: link.originalUrl, shortCode: link.shortCode };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit link</h1>
      {/* @ts-expect-error Server -> Client prop typing */}
      <EditLinkForm id={id} initial={initial} />
    </main>
  );
}
