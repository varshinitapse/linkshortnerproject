import { NextResponse } from 'next/server';
import { db } from '../../../../app/db';
import { links } from '../../../../app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body.id);
    const { originalUrl, shortCode } = body;
    if (!id || !originalUrl || !shortCode) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    await db.update(links).set({ originalUrl, shortCode }).where(eq(links.id, id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
