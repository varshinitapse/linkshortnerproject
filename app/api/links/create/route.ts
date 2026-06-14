import { NextResponse } from 'next/server';
import { db } from '../../../../app/db';
import { links } from '../../../../app/db/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const { originalUrl, shortCode } = body;
    if (!originalUrl || !shortCode) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    // Insert and return explicit columns to ensure consistent shape across adapters
    const insertRes = await db
      .insert(links)
      .values({ userId: user.id, originalUrl, shortCode })
      .returning({
        id: links.id,
        userId: links.userId,
        originalUrl: links.originalUrl,
        shortCode: links.shortCode,
        createdAt: links.createdAt,
      });

    const created = insertRes?.[0] ?? null;

    // If returning didn't work for some adapter, try to select by shortCode as fallback
    let link = created;
    if (!link) {
      const sel = await db.select().from(links).where(eq(links.shortCode, shortCode)).limit(1);
      link = sel?.[0] ?? null;
    }

    return NextResponse.json({ ok: true, link });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
