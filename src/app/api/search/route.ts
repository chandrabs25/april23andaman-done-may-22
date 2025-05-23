/* ------------------------------------------------------------------
   src/app/api/search/route.ts
-------------------------------------------------------------------*/
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, DatabaseService } from '@/lib/database';

/* ---------- Row helpers ---------- */
interface Island { id: number; name: string; description?: string | null; images?: string | null }
interface Package { id: number; name: string; description?: string | null; base_price: number; duration: string }
interface Activity { id: number; name: string; description?: string | null; island_id: number; island_name: string }

/* ---------- Utility ---------- */
const like = (t: string) => `%${t}%`;

async function performSearch(
  {
    q, destinationId, type,
  }: { q?: string; destinationId?: string | null; type: string }
) {
  console.log(`[performSearch] Starting search with q='${q}', destinationId='${destinationId}', type='${type}'`);
  /* use the same D1 binding every other API gets via getDatabase() */
  const db = await getDatabase();
  console.log('[performSearch] Database connection obtained.');

  const destinations: Island[] = [];
  const packages: Package[] = [];
  const activities: Activity[] = [];

  /* ----- Destinations / Islands ----- */
  if (type === 'all' || type === 'destinations') {
    console.log('[performSearch] Searching destinations...');
    let sql = 'SELECT id, name, description, images FROM islands';
    const arg: (string | number)[] = [];

    if (q) {
      sql += ' WHERE name LIKE ?1 OR description LIKE ?1';
      arg.push(like(q));
      console.log(`[performSearch] Destination query (q): ${sql}, Args: ${JSON.stringify(arg)}`);
    }
    else if (destinationId) {
      sql += ' WHERE id = ?1';
      arg.push(destinationId);
      console.log(`[performSearch] Destination query (id): ${sql}, Args: ${JSON.stringify(arg)}`);
    } else {
      console.log(`[performSearch] Destination query (all - no filter): ${sql}`);
      // Handle case where no q or destinationId is provided but type is 'destinations' or 'all'
      // This branch might not be hit due to validation in responder, but logging it defensively.
    }

    // Only execute if there's a condition or if we intend to fetch all when type is 'destinations'/'all' without q/id
    // The original code only executed if arg.length > 0, let's stick to that for now.
    if (arg.length) {
      const res = await db.prepare(sql).bind(...arg).all<Island>();
      console.log(`[performSearch] Destination results count: ${res.results?.length ?? 0}`);
      destinations.push(...(res.results ?? []));
    } else {
      console.log('[performSearch] No query arguments for destinations, skipping DB query.');
    }
  }

  /* ----- Packages ----- */
  if ((type === 'all' || type === 'packages') && q) {
    console.log('[performSearch] Searching packages...');
    const packageSql = `SELECT id, name, description, base_price, duration
           FROM packages
          WHERE is_active = 1
            AND (name LIKE ?1 OR description LIKE ?1)`;
    const packageArg = like(q);
    console.log(`[performSearch] Package query: ${packageSql}, Args: ["${packageArg}"]`);
    const res = await db
      .prepare(packageSql)
      .bind(packageArg)
      .all<Package>();
    console.log(`[performSearch] Package results count: ${res.results?.length ?? 0}`);
    packages.push(...(res.results ?? []));
  } else if (type === 'all' || type === 'packages') {
    console.log('[performSearch] Skipping package search (no query term q).');
  }


  /* ----- Activities / Services ----- */
  if ((type === 'all' || type === 'activities' || type === 'services') && q) {
    console.log('[performSearch] Searching activities/services...');
    const activitySql = `SELECT s.id, s.name, s.description, s.island_id, i.name AS island_name
           FROM services s
           JOIN islands i ON s.island_id = i.id
          WHERE s.name LIKE ?1 OR s.description LIKE ?1`;
    const activityArg = like(q);
    console.log(`[performSearch] Activity query: ${activitySql}, Args: ["${activityArg}"]`);
    const res = await db
      .prepare(activitySql)
      .bind(activityArg)
      .all<Activity>();
    console.log(`[performSearch] Activity results count: ${res.results?.length ?? 0}`);
    activities.push(...(res.results ?? []));
  } else if (type === 'all' || type === 'activities' || type === 'services') {
    console.log('[performSearch] Skipping activity search (no query term q).');
  }


  console.log(`[performSearch] Finished search. Found ${destinations.length} destinations, ${packages.length} packages, ${activities.length} activities.`);
  return { destinations, packages, activities };
}

/* ---------- shared responder ---------- */
async function responder(
  request: NextRequest,
  body?: { q?: string; type?: string; destination?: string | null }
) {
  const s = request.nextUrl.searchParams;
  console.log(`[responder] Received request: ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`);

  const q = body?.q ?? s.get('q')?.trim() ?? undefined;
  const type = body?.type ?? s.get('type') ?? 'all';
  const destination = body?.destination ?? s.get('destination');

  console.log(`[responder] Parsed parameters - q: '${q}', type: '${type}', destination: '${destination}'`);

  if (!q && !destination) {
    console.log('[responder] Validation failed: Missing q and destination parameters.');
    return NextResponse.json(
      { success: false, message: 'Provide a keyword (q) or destination id', data: { destinations: [], packages: [], activities: [] } },
      { status: 400 }
    );
  }

  /* touch DatabaseService so the binding path mirrors /api/destinations */
  new DatabaseService();      // constructor side-effect ensures binding exists
  console.log('[responder] DatabaseService initialized (side-effect for binding).');

  const data = await performSearch({ q, destinationId: destination, type });
  console.log(`[responder] Search completed. Returning data: ${JSON.stringify(data).substring(0, 200)}...`); // Log snippet of data

  return NextResponse.json({ success: true, message: 'Search results', data });
}

/* ---------- GET ---------- */
export async function GET(request: NextRequest) {
  console.log('[GET /api/search] Handling GET request.');
  try {
    return await responder(request);
  }
  catch (err) {
    console.error('[GET /api/search] Search error (GET)', err); // Keep existing error log
    return NextResponse.json(
      { success: false, message: 'Internal error', error: String(err), data: { destinations: [], packages: [], activities: [] } },
      { status: 500 }
    );
  }
}

/* ---------- POST ---------- */
export async function POST(request: NextRequest) {
  console.log('[POST /api/search] Handling POST request.');
  try {
    const body = (await request.json()) as { q?: string; type?: string; destination?: string | null };
    console.log('[POST /api/search] Request body parsed:', body);
    return await responder(request, body);
  } catch (err) {
    console.error('[POST /api/search] Search error (POST)', err); // Keep existing error log
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body', error: String(err), data: { destinations: [], packages: [], activities: [] } },
      { status: 400 }
    );
  }
}