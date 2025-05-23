export const dynamic = 'force-dynamic'// Path: .\src\app\api\auth\register\route.ts
import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Import DatabaseService ---
import { DatabaseService } from '@/lib/database';
// --- End of FIX ---
import * as jose from 'jose'; // Keep if needed for auto-login, though not used directly here
import * as bcrypt from 'bcryptjs';
// Removed runtime = 'edge' to allow Node.js dependencies

// Define an interface for the expected request body
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  phone?: string; // phone is optional
}

// --- FIX: Define User type (can be moved to a types file) ---
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone?: string | null;
    role_id: number;
    // Add other fields like profile_image, created_at, updated_at if needed
}
// --- End of FIX ---


// Register a new user
export async function POST(request: NextRequest) {
  try {
    // --- FIX: Instantiate DatabaseService ---
    const databaseService = new DatabaseService();
    // --- End of FIX ---

    // Parse request body with type assertion
    const body = await request.json() as RegisterRequestBody;
    const { name, email, password, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
     if (password.length < 6) { // Example: Basic password length validation
        return NextResponse.json(
            { success: false, message: 'Password must be at least 6 characters long' },
            { status: 400 }
        );
     }
     // Example: Basic email format validation (more robust validation might be needed)
     if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json(
            { success: false, message: 'Invalid email format' },
            { status: 400 }
        );
     }


    // Split name into first_name and last_name (simple split)
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Handle cases with only first name

    // --- FIX: Check if user already exists using DatabaseService ---
    const existingUser = await databaseService.getUserByEmail(email);
    // --- End of FIX ---

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 } // Use 409 Conflict status code
      );
    }

    // Hash password using bcrypt (Node.js compatible)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get the role_id for 'user' (assuming it's 2 based on your migration)
    const userRoleId = 2; // Replace with actual ID if different (Role 1 is Admin, Role 3 is Vendor)

    // --- FIX: Insert user into database using DatabaseService ---
    const result = await databaseService.createUser({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: hashedPassword,
        phone: phone || null,
        role_id: userRoleId
    });
    // --- End of FIX ---

    const lastRowId = result.meta?.last_row_id;

    if (!lastRowId) {
       console.error("User insert failed or D1 did not return last_row_id:", result);
       // Don't throw generic error, return specific feedback
        return NextResponse.json(
            { success: false, message: 'Database error occurred during registration.' },
            { status: 500 }
        );
    }

     // --- FIX: Optionally fetch the created user using DatabaseService ---
     // This adds an extra query but provides better feedback/data for auto-login
     const createdUser = await databaseService.getUserById(lastRowId);
     // --- End of FIX ---

     if (!createdUser) {
         // Log a warning, but don't necessarily fail the request if the insert succeeded
         console.warn(`Could not fetch newly created user with ID: ${lastRowId}`);
     }


    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      // --- FIX: Return created user data (excluding password) ---
      // Selectively return fields, excluding password_hash
      data: createdUser ? {
          id: createdUser.id,
          email: createdUser.email,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          role_id: createdUser.role_id,
          phone: createdUser.phone
      } : { id: lastRowId } // Fallback to just ID if fetch failed
      // --- End of FIX ---
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Check for specific database errors if possible (e.g., constraint violations)
    // Provide a more generic error message to the client for security
    return NextResponse.json(
      // --- FIX: Provide more structured error ---
      { success: false, message: 'An internal server error occurred during registration.', error: errorMessage },
       // --- End of FIX ---
      { status: 500 }
    );
  }
}