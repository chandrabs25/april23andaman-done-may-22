import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database'; // Adjust path as needed
import bcrypt from 'bcryptjs';

// Define the expected request body structure
interface VendorRegisterRequest {
    email: string;
    password?: string; // Made optional for validation check
    firstName?: string;
    lastName?: string;
    phone?: string;
    businessName?: string;
    businessType?: string;
    address?: string;
}

const VENDOR_ROLE_ID = 3; // Assuming 'vendor' role ID is 3 based on migration

export async function POST(request: Request) {
    console.log('Vendor Registration API: Received request.');
    const dbService = new DatabaseService();

    try {
        const body: VendorRegisterRequest = await request.json();
        console.log('Vendor Registration API: Parsed request body:', body);

        // --- Basic Server-Side Validation ---
        const {
            email,
            password,
            firstName,
            lastName,
            phone,
            businessName,
            businessType,
            address
        } = body;

        if (!email || !password || !firstName || !lastName || !businessName || !businessType || !address) {
            console.warn('Vendor Registration API: Missing required fields.');
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 8) {
             console.warn('Vendor Registration API: Password too short.');
            return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        // --- Check if user already exists ---
        console.log(`Vendor Registration API: Checking if user exists for email: ${email}`);
        const existingUser = await dbService.getUserByEmail(email);
        console.log('Vendor Registration API: Result from getUserByEmail:', existingUser);
        if (existingUser) {
            console.warn(`Vendor Registration API: Email already registered: ${email}`);
            return NextResponse.json({ message: 'Email already registered' }, { status: 409 }); // 409 Conflict
        }
        console.log(`Vendor Registration API: Email ${email} is available.`);

        // --- Hash Password ---
        console.log('Vendor Registration API: Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
        console.log('Vendor Registration API: Password hashed.');

        // --- Create User ---
        const userData = {
            email,
            password_hash: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            phone: phone ?? null, // Handle optional phone
            role_id: VENDOR_ROLE_ID,
        };
        console.log('Vendor Registration API: Attempting to create user with data:', userData);
        const userResult = await dbService.createUser(userData);
        console.log('Vendor Registration API: Result from createUser:', JSON.stringify(userResult, null, 2)); // Log the full result object

        // --- Get New User ID ---
        // D1Result meta often contains lastRowId for INSERTs
        const userId = userResult.meta?.last_row_id;
        console.log(`Vendor Registration API: Extracted userId: ${userId}`); // Log the extracted ID

        if (!userId) {
            console.error('Vendor Registration API: Failed to get user ID after creation. Full result:', userResult);
            // Consider if this should be a 500 error even if D1 reported success
            // If D1 *did* insert but didn't return ID, it's an inconsistent state.
            return NextResponse.json({ message: 'User creation reported success, but failed to retrieve user ID.' }, { status: 500 });
            // throw new Error('User creation succeeded but failed to retrieve user ID.'); // Or throw to be caught below
        }
        console.log(`Vendor Registration API: User created successfully with ID: ${userId}`);

        // --- Create Service Provider ---
        const serviceProviderData = {
            user_id: userId,
            business_name: businessName,
            type: businessType,
            address: address,
            // Add other optional fields like license_no if they are sent from the form
            // license_no: body.licenseNo ?? null,
            // bank_details: body.bankDetails ?? null, // Be cautious with sensitive data
        };
        console.log('Vendor Registration API: Attempting to create service provider with data:', serviceProviderData);
        const spResult = await dbService.createServiceProvider(serviceProviderData);
        console.log('Vendor Registration API: Result from createServiceProvider:', JSON.stringify(spResult, null, 2)); // Log the result
        console.log(`Vendor Registration API: Service provider created for user ID: ${userId}`);


        // --- Success Response ---
        console.log('Vendor Registration API: Registration process completed successfully.');
        return NextResponse.json({ message: 'Vendor registration successful. Awaiting verification.' }, { status: 201 });

    } catch (error) {
        // Log the specific error object for better debugging
        console.error('Vendor Registration API Error:', error);

        // Check error type more robustly if possible, otherwise rely on message
        if (error instanceof Error) {
             if (error.message.includes('Missing required fields') || error.message.includes('Password must be at least 8 characters long')) {
                 return NextResponse.json({ message: error.message }, { status: 400 });
            }
            if (error.message.includes('Email already registered')) {
                 return NextResponse.json({ message: error.message }, { status: 409 });
            }
             if (error.message.includes('failed to retrieve user ID')) {
                 // Handle the specific error thrown above if you choose to throw instead of returning directly
                 return NextResponse.json({ message: error.message }, { status: 500 });
            }
        }
        // Generic internal server error for other issues
        return NextResponse.json({ message: 'Internal Server Error during registration' }, { status: 500 });
    }
}
