import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <p className="mb-6">Welcome to the admin dashboard. Use the navigation to manage different aspects of the platform.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Package Management Card */}
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium mb-3">Package Management</h3>
          <p className="text-gray-600 mb-4">Create, edit, and manage travel packages and their categories.</p>
          <div className="space-y-2">
            <Link href="/admin_packages" className="text-blue-600 hover:underline block">
              View All Packages
            </Link>
            <Link href="/admin_packages/new" className="text-blue-600 hover:underline block">
              Create New Package
            </Link>
          </div>
        </div>

        {/* Approvals Card */}
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium mb-3">Pending Approvals</h3>
          <p className="text-gray-600 mb-4">Review and approve hotels, hotel room types, and services.</p>
          <div className="space-y-2">
            <Link href="/admin_approvals" className="text-blue-600 hover:underline block">
              View All Pending Items
            </Link>
            <Link href="/admin_approvals?type=hotels" className="text-blue-600 hover:underline block">
              Hotel Approvals
            </Link>
            <Link href="/admin_approvals?type=rooms" className="text-blue-600 hover:underline block">
              Room Approvals
            </Link>
            <Link href="/admin_approvals?type=services" className="text-blue-600 hover:underline block">
              Service Approvals
            </Link>
          </div>
        </div>

        {/* Bookings Management Card */}
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium mb-3">Bookings Management</h3>
          <p className="text-gray-600 mb-4">View and manage all customer bookings across packages and services.</p>
          <div className="space-y-2">
            <Link href="/admin_bookings" className="text-blue-600 hover:underline block">
              View All Bookings
            </Link>
            <Link href="/admin_bookings?type=packages" className="text-blue-600 hover:underline block">
              Package Bookings
            </Link>
            <Link href="/admin_bookings?type=services" className="text-blue-600 hover:underline block">
              Service Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 