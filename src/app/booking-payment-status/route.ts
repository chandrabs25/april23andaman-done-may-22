// File: src/app/booking-payment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { URL } from 'url'; // Node.js URL module, ensure it's available or use browser URL if preferred for edge

// Helper to get the base URL, ensuring it's HTTP for localhost development
function getBaseUrl(requestUrl: URL): string {
  let siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8787';
  // If deployed, SITE_URL/NEXT_PUBLIC_SITE_URL should have the correct https scheme
  // For local development, we want to ensure it's http if it's localhost
  if (requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1') {
    if (siteUrl.startsWith('https://localhost') || siteUrl.startsWith('https://127.0.0.1')) {
      siteUrl = siteUrl.replace('https://', 'http://');
    }
    if (!siteUrl.startsWith('http://')) { // if it was just localhost:8787
        siteUrl = `http://${siteUrl}`;
    }
  }
  // Ensure no trailing slash for proper URL construction with new URL()
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

export async function POST(request: NextRequest) {
  console.log('POST /booking-payment-status API route hit (from PhonePe redirect)');
  
  const requestUrl = new URL(request.url);
  const mtid = requestUrl.searchParams.get('mtid');

  console.log('Extracted mtid from POST request URL:', mtid);

  try {
    const bodyText = await request.text(); 
    console.log('Body of POST from PhonePe to /booking-payment-status:', bodyText.substring(0, 500) + (bodyText.length > 500 ? '...' : ''));
  } catch (e) {
    console.error('Error reading body of POST from PhonePe:', e);
  }

  const baseUrl = getBaseUrl(requestUrl);

  if (mtid) {
    const displayPageUrl = `/booking-status-display?mtid=${mtid}`;
    const absoluteDisplayUrl = new URL(displayPageUrl, baseUrl);
    console.log('Redirecting you to (absolute):', absoluteDisplayUrl.toString());
    return NextResponse.redirect(absoluteDisplayUrl.toString(), { status: 303 });
  } else {
    console.error('No mtid found in query params of POST to /booking-payment-status');
    const absoluteFallbackUrl = new URL('/', baseUrl);
    return NextResponse.redirect(absoluteFallbackUrl.toString(), { status: 303 }); 
  }
}

export async function GET(request: NextRequest) {
  console.log('GET /booking-payment-status API route hit');
  const requestUrl = new URL(request.url);
  const mtid = requestUrl.searchParams.get('mtid');
  const baseUrl = getBaseUrl(requestUrl);

  if (mtid) {
    const displayPageUrl = `/booking-status-display?mtid=${mtid}`;
    const absoluteDisplayUrl = new URL(displayPageUrl, baseUrl);
    console.log('Redirecting you from GET to (absolute):', absoluteDisplayUrl.toString());
    return NextResponse.redirect(absoluteDisplayUrl.toString(), { status: 303 });
  } else {
    const absoluteFallbackUrl = new URL('/', baseUrl);
    return NextResponse.redirect(absoluteFallbackUrl.toString(), { status: 303 });
  }
}