import { NextResponse } from 'next/server';
import { db } from '../../db';
import { links } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params?: { shortcode?: string } } = {}) {
  try {
    // prefer params, but fall back to parsing the pathname if params are missing
    let shortcode = params?.shortcode;
    if (!shortcode) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split('/').filter(Boolean);
        const lIndex = parts.findIndex((p) => p === 'l');
        if (lIndex >= 0 && parts.length > lIndex + 1) {
          shortcode = parts[lIndex + 1];
        } else if (parts.length) {
          shortcode = parts[parts.length - 1];
        }
      } catch (e) {
        // ignore
      }
    }

    if (!shortcode) return NextResponse.json({ error: 'shortcode required' }, { status: 400 });

    const sel = await db.select().from(links).where(eq(links.shortCode, shortcode)).limit(1);
    const link = sel?.[0] ?? null;
    if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 });

    let url = link.originalUrl;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
