import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming Prisma client is at @/lib/prisma

// Define an interface for the route parameters, though often Next.js infers this.
interface RouteContext {
  params: {
    bookingId: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  const { bookingId } = params;

  if (!bookingId) {
    return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        // These includes are based on the BookingData interface used by the confirmation page:
        // package: { name: string }
        // packageCategory: { name: string }
        // user: { name?: string, email?: string }
        // Prisma fetches all direct scalar fields of Booking model by default (id, status, paymentStatus, totalAmount, guestName etc.)
        package: {
          select: {
            name: true,
          },
        },
        packageCategory: {
          select: {
            name: true,
            // category_price_per_person: true, // Example if needed by frontend
          },
        },
        user: { // This will be null if there's no associated user (e.g., guest booking)
          select: {
            name: true,
            email: true,
            // id: true, // Include user ID if needed by frontend for any reason
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // The structure of `booking` object here should match the `BookingData` interface
    // used in `src/app/(main)/booking/confirmation/[bookingId]/page.tsx`.
    // `totalAmount` is stored in paise and will be returned as such (number).
    // Date fields like `createdAt`, `startDate`, `endDate` are Date objects from Prisma and
    // will be serialized to ISO strings by NextResponse.json().
    return NextResponse.json(booking);

  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    // In a production environment, you might want to log the error to a monitoring service.
    // Avoid sending raw or detailed error messages to the client for security reasons.
    return NextResponse.json({ message: "An internal server error occurred while fetching booking details." }, { status: 500 });
  }
}

// Optional: Add an OPTIONS handler if you need to support CORS preflight requests,
// though typically not needed for same-origin API routes in Next.js.
// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: { 'Allow': 'GET' } });
// }
