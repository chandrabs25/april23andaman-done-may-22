import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the name of your authentication cookie (must match what's used in login/auth checks)
const AUTH_COOKIE_NAME = 'auth_token';

export async function POST() {
  try {
    console.log("API Route: /api/auth/logout POST received (JWT)");

    // Get the cookies utility
    const cookieStore = cookies();

    // Check if the cookie exists before trying to delete
    if (cookieStore.has(AUTH_COOKIE_NAME)) {
      console.log(`Clearing cookie: ${AUTH_COOKIE_NAME}`);
      // Clear the cookie by setting it with an expiration date in the past
      // and removing the value. Also set path and httpOnly for consistency.
      cookieStore.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        path: '/', // Ensure the path matches where the cookie was set
        httpOnly: true, // Match the httpOnly setting used when setting the cookie
        secure: process.env.NODE_ENV === 'production', // Match the secure setting
        sameSite: 'lax', // Match the sameSite setting
        maxAge: -1, // Or expires: new Date(0)
      });
    } else {
      console.log(`Cookie ${AUTH_COOKIE_NAME} not found, nothing to clear.`);
    }

    // Even if the cookie wasn't found, logout is considered successful client-side.
    console.log("Cookie cleared (or was not present). Sending success response.");
    return NextResponse.json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error("Logout API error:", error);
    // Return a generic error response
    return NextResponse.json(
      { success: false, message: 'Logout failed due to server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests if needed, though POST is standard for logout
export async function GET() {
  // Redirect or return method not allowed
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
