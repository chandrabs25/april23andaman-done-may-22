import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { generateXVerifyHeader } from '../../../../../lib/phonepeUtils';
import { DatabaseService } from '../../../../../lib/database';
import { bookingSystem } from '../../../../../lib/booking-system';

interface PhonePePayApiResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    instrumentResponse?: {
      type?: string;
      redirectInfo?: {
        url: string;
        method: string;
      };
    };
  };
}

const dbService = new DatabaseService();

interface GuestDetails {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface ServiceBookingDetails {
  holdId?: number | null;
  sessionId: string;
  userId: string | null;
  guestDetails: GuestDetails;
  quantity: number;
  specialRequests?: string;

  // direct booking fallback
  serviceId?: number;
  serviceDate?: string; // YYYY-MM-DD
  totalAmount?: number;
}

export async function POST(request: NextRequest) {
  let holdId: number | null = null;
  try {
    const body: ServiceBookingDetails = await request.json();
    holdId = body.holdId || null;

    // Basic validation
    if (!body.sessionId || !body.quantity || body.quantity <= 0) {
      return NextResponse.json({ success: false, message: 'Missing or invalid booking details.' }, { status: 400 });
    }

    const hasHoldData = !!body.holdId;
    const hasDirectData = body.serviceId && body.serviceDate && body.totalAmount;

    if (!hasHoldData && !hasDirectData) {
      return NextResponse.json({ success: false, message: 'Either holdId or complete booking details required.' }, { status: 400 });
    }

    let serviceId: number;
    let serviceDate: string;
    let quantity: number;
    let amount: number;
    let newBookingId: number | null = null;

    if (hasHoldData && body.holdId) {
      // Fetch hold and validate
      const holds = await bookingSystem.getActiveHolds(body.sessionId);
      const targetHold = holds.find(h => h.id === body.holdId && h.status === 'active');
      if (!targetHold) {
        return NextResponse.json({ success: false, message: 'Hold not found or expired.' }, { status: 400 });
      }
      const now = new Date();
      const expires = new Date(targetHold.expires_at);
      if (now >= expires) {
        await bookingSystem.updateHoldStatus(body.holdId, 'expired');
        return NextResponse.json({ success: false, message: 'Hold has expired.' }, { status: 400 });
      }
      serviceId = targetHold.service_id!;
      serviceDate = targetHold.hold_date;
      quantity = targetHold.quantity;
      amount = targetHold.hold_price!;
    } else {
      // Direct booking path
      serviceId = body.serviceId!;
      serviceDate = body.serviceDate!;
      quantity = body.quantity;
      amount = body.totalAmount!;

      const bookingRes = await dbService.createInitialServiceBooking({
        service_id: serviceId,
        user_id: body.userId ? parseInt(body.userId) : null,
        total_amount: amount,
        quantity,
        service_date: serviceDate,
        total_people: body.quantity, // Treat quantity as people count for now
        guest_name: body.guestDetails?.name || null,
        guest_email: body.guestDetails?.email || null,
        guest_phone: body.guestDetails?.mobileNumber || null,
        special_requests: body.specialRequests || null,
      });
      if (!bookingRes.success) {
        return NextResponse.json({ success: false, message: 'Failed to create booking.' }, { status: 500 });
      }
      newBookingId = bookingRes.meta.last_row_id;
    }

    // Build payment attempt
    const totalPaise = Math.round(amount * 100);
    const merchantTransactionId = crypto.randomUUID();

    try {
      await dbService.createPaymentAttempt(
        newBookingId,
        merchantTransactionId,
        totalPaise,
        'INITIATED',
        holdId,
      );
    } catch (e) {
      console.error('Failed creating payment attempt', e);
    }

    const merchantUserId = body.userId || `GUEST_${crypto.randomUUID()}`;

    // Prepare PhonePe payload
    const clientRedirectUrl = `${process.env.NGROK_PUBLIC_URL}/api/bookings/booking-payment-status?mtid=${merchantTransactionId}`;
    const siteUrl = process.env.NGROK_PUBLIC_URL?.trim() || process.env.SITE_URL;
    const s2sCallbackUrl = `${siteUrl}/api/bookings/phonepe-callback`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId,
      amount: totalPaise,
      redirectUrl: clientRedirectUrl,
      redirectMode: 'GET',
      callbackUrl: s2sCallbackUrl,
      mobileNumber: body.guestDetails?.mobileNumber,
      paymentInstrument: { type: 'PAY_PAGE' },
    } as any;
    if (!payload.mobileNumber) delete payload.mobileNumber;

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiEndpointPath = '/pg/v1/pay';
    const xVerify = generateXVerifyHeader(payloadBase64, apiEndpointPath, process.env.PHONEPE_SALT_KEY!, process.env.PHONEPE_SALT_INDEX!);

    // Call PhonePe
    const respRaw = await fetch(process.env.PHONEPE_PAY_API_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, Accept: 'application/json' },
      body: JSON.stringify({ request: payloadBase64 }),
    });
    const resp: PhonePePayApiResponse = await respRaw.json();

    if (resp.success && resp.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({ success: true, redirectUrl: resp.data.instrumentResponse.redirectInfo.url, merchantTransactionId, holdId });
    }

    // Handle failure
    if (holdId) await bookingSystem.updateHoldStatus(holdId, 'cancelled');
    return NextResponse.json({ success: false, message: resp.message || 'Payment initiation failed.' }, { status: 400 });
  } catch (err) {
    console.error('Service payment initiation error', err);
    if (holdId) await bookingSystem.updateHoldStatus(holdId, 'cancelled');
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 