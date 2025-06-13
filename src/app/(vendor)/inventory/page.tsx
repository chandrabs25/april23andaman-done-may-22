'use client';

import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';

export default function VendorInventoryHome() {
  // Re-use existing endpoint to list hotels for vendor
  const { data, status, error } = useFetch<any[]>(`/api/vendor/my-hotels`);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" /> Loading hotels…
      </div>
    );
  }

  if (error || status === 'error') {
    return <p className="text-red-600">Failed to load hotels: {error?.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No hotels found.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Inventory Management</h1>
      <ul className="space-y-3">
        {data.map((hotel: any) => {
          const sid = hotel.service_id ?? hotel.id;
          return (
            <li key={sid} className="border p-3 rounded hover:bg-gray-50">
              <Link href={`/inventory/${sid}/calendar`} className="flex items-center justify-between">
                <span>{hotel.name}</span>
                <span className="text-sm text-blue-600">Manage →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 