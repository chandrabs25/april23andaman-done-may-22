import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database'; // Assuming database service is correctly set up
import * as bcrypt from 'bcryptjs';
import * as jose from 'jose'; // For JWT generation
import { cookies } from 'next/headers'; // Import cookies

// Define expected request body structure
interface LoginRequestBody {
  email: string;
  password: string;
}

// Define expected User structure (align with your database schema)
interface User {
    id: number;
    email: string;
    password_hash: string;
    role_id: number; // Crucial for checking admin role
    // Add other relevant fields if needed (e.g., first_name)
}

// Environment variable for JWT secret (ensure this is set in your .env or Cloudflare secrets)
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROLE_ID = 1; // Define the role ID for admins
const CORRECT_AUTH_COOKIE_NAME = 'auth_token'; // Define the correct cookie name

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set.');
    return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const databaseService = new DatabaseService();
    const body = await request.json() as LoginRequestBody;
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // --- Find User by Email ---
    const user = await databaseService.getUserByEmail(email) as User | null; // Type assertion

    if (!user) {
      console.log(`Admin login attempt failed: User not found for email ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 } // Unauthorized
      );
    }

    // --- Verify Password ---
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      console.log(`Admin login attempt failed: Invalid password for email ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 } // Unauthorized
      );
    }

    // --- Verify Role ---
    if (user.role_id !== ADMIN_ROLE_ID) {
      console.log(`Admin login attempt failed: User ${email} is not an admin (role_id: ${user.role_id})`);
      return NextResponse.json(
        { success: false, message: 'Access denied. Not an admin account.' },
        { status: 403 } // Forbidden
      );
    }

    // Admin users do not have service provider details, so we skip that part.

    // --- Generate JWT Token FOR COOKIE ---
    // Use payload expected by verifyAuth (sub, email, role_id)
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({
        sub: String(user.id), // Use 'sub' for user ID (subject)
        email: user.email,
        role_id: user.role_id // Use 'role_id'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Set token expiration (e.g., 1 hour)
      .sign(secretKey);

    console.log(`Admin login successful for ${email}, setting '${CORRECT_AUTH_COOKIE_NAME}' cookie.`);

    // --- Create Success Response (NO TOKEN IN BODY) ---
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      // NO token here
      user: { // Return basic user info
          id: user.id,
          email: user.email,
          roleId: user.role_id
      }
    });

    // --- Set HttpOnly Cookie ---
    cookies().set(CORRECT_AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 3600, // 1 hour (in seconds)
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Error during admin login:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred during login.', error: errorMessage },
      { status: 500 }
    );
  }
}
