import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

// GET: Fetch all islands
export async function GET(request: NextRequest) {
  try {
    const db = new DatabaseService();
    const result = await db.getAllIslands();

    if (!result || !result.success) {
      console.error('Failed to fetch islands from database:', result?.error);
      // Use 500 for database errors, but return the standard response structure
      return NextResponse.json({ success: false, message: 'Failed to fetch islands from database.' }, { status: 500 });
    }

    // Ensure results is an array, even if empty
    const islands = result.results ?? [];

    return NextResponse.json({ success: true, data: islands });

  } catch (error) {
    console.error('Error fetching islands:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    // Use 500 for unexpected server errors
    return NextResponse.json({ success: false, message: 'Failed to fetch islands.', error: message }, { status: 500 });
  }
}
