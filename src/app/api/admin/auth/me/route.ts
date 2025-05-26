import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, VerifiedUser } from '@/lib/auth'; // Assuming auth.ts is in lib
import { DatabaseService } from '@/lib/database';

const ADMIN_ROLE_ID = 1;

// Define the expected structure for user details returned from the database
interface DbUser {
  id: number;
  email: string;
  password_hash: string; // This should NOT be returned
  first_name?: string;
  last_name?: string;
  role_id: number;
  // Add other fields that might exist in your database user table
  created_at?: Date;
  updated_at?: Date;
}

export async function GET(request: NextRequest) {
  console.log('Admin /me endpoint hit');
  const databaseService = new DatabaseService();

  try {
    const { isAuthenticated, user } = await verifyAuth(request);

    if (!isAuthenticated || !user) {
      console.log('Admin /me: Authentication failed or session expired.');
      return NextResponse.json(
        { success: false, message: 'Authentication failed or session expired', data: null },
        { status: 401 }
      );
    }

    console.log('Admin /me: User authenticated from token:', user);

    // Check if the user is an admin
    if (user.role_id !== ADMIN_ROLE_ID) {
      console.warn(`Admin /me: Access denied. User ID ${user.id} is not an admin. Role ID: ${user.role_id}`);
      return NextResponse.json(
        { success: false, message: 'Access denied. Not an admin.', data: null },
        { status: 403 } // Forbidden
      );
    }

    // User is authenticated and is an admin, fetch full details from DB
    // The user.id from verifyAuth (payload.sub) is a string. Convert to number for DB query.
    const userIdAsNumber = parseInt(String(user.id), 10);
    if (isNaN(userIdAsNumber)) {
        console.error('Admin /me: Invalid user ID format after parsing:', user.id);
        return NextResponse.json({ success: false, message: 'Invalid user ID format.', data: null }, { status: 400 });
    }

    console.log(`Admin /me: Fetching user details from DB for admin ID: ${userIdAsNumber}`);
    const dbUser = await databaseService.getUserById(userIdAsNumber) as DbUser | null;

    if (!dbUser) {
      // This case should ideally not be reached if JWT is valid and refers to an existing user
      console.warn(`Admin /me: Admin user with ID ${userIdAsNumber} not found in database, though token was valid.`);
      return NextResponse.json(
        { success: false, message: 'User not found.', data: null },
        { status: 404 }
      );
    }

    console.log('Admin /me: User details fetched from DB:', { id: dbUser.id, email: dbUser.email, role_id: dbUser.role_id });

    // Prepare user data for the response, excluding sensitive information
    const responseData = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      roleId: dbUser.role_id,
      // Add any other relevant non-sensitive admin fields from dbUser here
    };

    return NextResponse.json(
      { success: true, message: 'Admin authenticated successfully', data: responseData },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin /me: Internal server error:', error);
    // It's good practice to avoid sending detailed error messages to the client in production
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.', error: errorMessage }, // Consider removing error: errorMessage in production
      { status: 500 }
    );
  }
}
