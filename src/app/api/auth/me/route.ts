// Path: src/app/api/auth/me/route.ts
export const dynamic = 'force-dynamic'; // Ensure dynamic execution for reading cookies/env vars

import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Only verifyAuth is needed here from lib/auth ---
import { verifyAuth } from '@/lib/auth';
// --- End of FIX ---

// Define User type expected by useAuth hook (ensure this matches lib/auth VerifiedUser)
interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
}

// --- FIX: JwtPayload interface is no longer needed here ---
// Interface for the expected payload in the JWT
// interface JwtPayload extends jose.JWTPayload {
//   sub: string; // User ID
//   email: string;
//   role_id?: number;
//   first_name?: string;
//   last_name?: string;
//   // Add other fields included during token creation
// }
// --- End of FIX ---

export async function GET(request: NextRequest) {
  console.log("--- GET /api/auth/me Request Received ---");
  try {
    // --- FIX: Use verifyAuth to check authentication status ---
    const { isAuthenticated, user } = await verifyAuth(request);
    // --- End of FIX ---

    if (!isAuthenticated || !user) {
      console.log("/api/auth/me: Not authenticated or user data missing.");
      // verifyAuth doesn't handle cookie clearing on expiry, so we might need to do it here
      // based on the reason for failure if we could determine it, but for simplicity,
      // just return 401. The client should handle logout on 401.
      return NextResponse.json(
        { success: false, message: 'Not authenticated.', data: null },
        { status: 401 } // Unauthorized
      );
    }

    console.log("/api/auth/me: User authenticated. User data:", user);

    // Construct the user data object expected by the frontend (useAuth hook)
    // Ensure the structure matches the User interface and what useAuth expects
    const userData: User = {
      id: user.id,
      email: user.email,
      // Include other fields if they are present in the user object from verifyAuth
      // Note: verifyAuth currently only returns id, email, role_id.
      // If first_name/last_name are needed, verifyAuth and the token generation
      // need to consistently include them. Assuming they might be added later:
      // first_name: user.first_name, // Uncomment if available
      // last_name: user.last_name,   // Uncomment if available
      role_id: user.role_id,
    };

    return NextResponse.json({
      success: true,
      message: 'User authenticated.',
      data: userData // Return the user data from verifyAuth
    });

  } catch (error) {
    // Catch unexpected errors during the verifyAuth call or response generation
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.', error: error instanceof Error ? error.message : 'Unknown error', data: null },
      { status: 500 }
    );
  }
}