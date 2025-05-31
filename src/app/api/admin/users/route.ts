// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth'; // Adjusted path assuming src is the root for @
import { DatabaseService } from '@/lib/database'; // Adjusted path

export async function GET(request: Request) {
  try {
    // Protect the route, only admins (role 1) can access
    const authResult = await requireAuth(request, [1]);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if authentication fails
    }

    const dbService = new DatabaseService();

    // Fetch all users
    const usersResult = await dbService.getUsers();
    if (!usersResult.success || !usersResult.results) {
      console.error('Error fetching users from DB:', usersResult.error);
      return NextResponse.json({ message: 'Error fetching users: ' + (usersResult.error || 'Unknown database error') }, { status: 500 });
    }
    const users = usersResult.results;

    // Fetch all service providers
    const serviceProvidersResult = await dbService.getServiceProviders();
    if (!serviceProvidersResult.success || !serviceProvidersResult.results) {
      console.error('Error fetching service providers from DB:', serviceProvidersResult.error);
      return NextResponse.json({ message: 'Error fetching service providers: ' + (serviceProvidersResult.error || 'Unknown database error') }, { status: 500 });
    }
    const serviceProviders = serviceProvidersResult.results;

    // Combine user data with service provider data
    const combinedData = users.map(user => {
      const serviceProviderInfo = serviceProviders.find(sp => sp.user_id === user.id);
      return {
        ...user,
        serviceProvider: serviceProviderInfo || null,
      };
    });

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Error fetching users: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred while fetching users' }, { status: 500 });
  }
}
