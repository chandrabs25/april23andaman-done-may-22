import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/database'; // Adjusted path as per instruction

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageId = searchParams.get('packageId');
  // Client sends category_name as 'categoryId' in the query parameter
  const categoryName = searchParams.get('categoryId'); 

  if (!packageId || !categoryName) {
    return NextResponse.json({ 
      success: false, 
      message: 'packageId and categoryId (as categoryName) are required.' 
    }, { status: 400 });
  }

  try {
    const db = getDb();

    // Fetch package details
    // Assuming 'id', 'name', 'primary_image' are the correct column names in 'packages' table
    const packageDetailsStmt = db.prepare(
      'SELECT id, name, primary_image FROM packages WHERE id = ?'
    );
    const packageDetails = packageDetailsStmt.get(packageId);

    if (!packageDetails) {
      return NextResponse.json({ 
        success: false, 
        message: 'Package not found.' 
      }, { status: 404 });
    }

    // Fetch category details using packageId and categoryName
    // Assuming 'id', 'category_name', 'description', 'price', 'max_pax_included_in_price', 'package_id' are correct column names
    const categoryDetailsStmt = db.prepare(
      'SELECT id, category_name, description, price, max_pax_included_in_price, package_id FROM package_categories WHERE package_id = ? AND category_name = ?'
    );
    const categoryDetails = categoryDetailsStmt.get(packageId, categoryName);

    if (!categoryDetails) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found for this package, or category name mismatch.' 
      }, { status: 404 });
    }
    
    // The SQL query already ensures categoryDetails.package_id matches the input packageId.

    return NextResponse.json({ 
      success: true, 
      packageDetails, 
      categoryDetails 
    }, { status: 200 });

  } catch (error) {
    console.error('[API booking-context GET] Error:', error);
    // Check if the error is an object and has a message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error.',
      error: errorMessage // Optionally include more error details in dev
    }, { status: 500 });
  }
}
