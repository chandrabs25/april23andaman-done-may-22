// Path: src/app/api/vendor/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the correct auth cookie name (must match the one set during login)
const AUTH_COOKIE_NAME = 'auth_token';

export async function POST(request: NextRequest) {
  console.log("--- POST /api/vendor/auth/logout Request Received ---");
  
  try {
    // Clear the auth cookie by setting it to expire immediately
    cookies().set({
      name: AUTH_COOKIE_NAME,
      value: '',
      expires: new Date(0), // Set to epoch time (1970-01-01) to expire immediately
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
    });

    console.log(`Vendor logout successful, cleared '${AUTH_COOKIE_NAME}' cookie.`);

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during vendor logout:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during logout.', error: errorMessage },
      { status: 500 }
    );
  }
}
