// src/app/api/admin/users/[userId]/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import bcrypt from 'bcryptjs'; // Using bcryptjs as specified

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 1. Authenticate and authorize admin
    const authResult = await requireAuth(request, [1]); // Role 1 for admin
    if (authResult instanceof NextResponse) {
      return authResult; // Not authorized
    }

    // 2. Extract userId and newPassword
    const userIdString = params.userId;
    const { newPassword } = await request.json();

    // 3. Validate input
    if (!userIdString || isNaN(parseInt(userIdString, 10))) {
      return NextResponse.json({ message: 'Invalid user ID format.' }, { status: 400 });
    }
    const userId = parseInt(userIdString, 10);

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ message: 'New password must be a string and at least 8 characters long.' }, { status: 400 });
    }

    // 4. Hash the new password
    const saltRounds = 10; // Same as used in seed.sql (though not explicitly stated, it's a common default)
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // 5. Instantiate DatabaseService and update password
    const dbService = new DatabaseService();
    const updateResult = await dbService.updateUserPassword(userId, passwordHash);

    if (!updateResult.success) {
      // Check if the error was due to the user not being found
      if (updateResult.error && updateResult.error.includes("User not found")) {
         return NextResponse.json({ message: `User with ID ${userId} not found.` }, { status: 404 });
      }
      return NextResponse.json({ message: 'Failed to update password.', error: updateResult.error || 'Unknown database error' }, { status: 500 });
    }

    // Check if any row was actually updated
    if (updateResult.meta?.changes === 0) {
        return NextResponse.json({ message: `User with ID ${userId} not found or password already matches.` }, { status: 404 });
    }


    // 6. Return success response
    return NextResponse.json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Error changing password:', error);
    if (error instanceof Error && error.message.includes("JSON")) {
        return NextResponse.json({ message: 'Invalid request body: Could not parse JSON.' }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: 'An error occurred while changing the password.', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred.' }, { status: 500 });
  }
}
