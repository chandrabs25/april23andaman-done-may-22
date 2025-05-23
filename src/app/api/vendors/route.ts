export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

interface ServiceProvider {
  id: number
  user_id: number
  business_name: string
  type: string
  license_no: string | null
  address: string | null
  verified: boolean
  verification_documents: string | null
  bank_details: string | null
  created_at: string
  updated_at: string
}

interface VendorApiResponseData {
  id: number
  business_name: string
  type: string
  address: string | null
}

export async function GET(request: Request) {
  try {
    // Fetch the D1 database binding
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)

    // Build query and parameters
    let query = `
      SELECT id, business_name, type, address
      FROM service_providers
      WHERE verified = TRUE
    `
    const params: (string | number)[] = []

    const typeFilter = searchParams.get('type')
    if (typeFilter) {
      query += ' AND type = ?'
      params.push(typeFilter)
    }

    query += ' ORDER BY business_name ASC'

    // Execute query
    const stmt = db.prepare(query).bind(...params)
    const { results = [], success, error } = await stmt.all<ServiceProvider>()

    if (!success) {
      console.error('Failed to fetch vendors from D1:', error)
      throw new Error(error || 'Database query failed')
    }

    // Map to API response shape, typing provider in callback
    const vendorsApiResponse: VendorApiResponseData[] =
      results.map((provider: ServiceProvider) => ({
        id: provider.id,
        business_name: provider.business_name,
        type: provider.type,
        address: provider.address,
      }))

    return NextResponse.json({
      success: true,
      message: 'Vendors retrieved successfully',
      data: vendorsApiResponse,
    })
  } catch (err) {
    console.error('Error fetching vendors:', err)
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve vendors',
        error: errorMessage,
        data: [] as VendorApiResponseData[],
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  console.warn(
    "POST /api/vendors is not supported here. Use a dedicated registration endpoint."
  )
  return NextResponse.json(
    {
      success: false,
      message: 'Method Not Allowed',
      data: null,
    },
    { status: 405 }
  )
}
