'use client';
import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
interface Props { params: { serviceId: string }; }
export default function BookingsPage({ params }: Props) {
  const { data, status, error, isLoading } = useFetch<any[]>(`/api/vendor/inventory/bookings?serviceId=${params.serviceId}`);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Bookings</h2>
      {isLoading && <div className="flex items-center"><Loader2 className="animate-spin mr-2"/>Loading…</div>}
      {status==='error' && <p className="text-red-500">Error: {error?.message}</p>}
      {status==='success' && data && <BookingsTable rows={data} />}
    </div>
  );
}
function BookingsTable({ rows }: { rows: any[] }) {
  if (!rows || rows.length===0) return <p>No bookings.</p>;
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr>
          <th className="border p-1">Date</th>
          <th className="border p-1">Room Type</th>
          <th className="border p-1">Qty</th>
          <th className="border p-1">Status</th>
          <th className="border p-1">Guest</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r=> (
          <tr key={r.booking_id+"-"+r.room_type_id+"-"+r.service_date}>
            <td className="border p-1 whitespace-nowrap">{r.service_date}</td>
            <td className="border p-1">{r.room_type}</td>
            <td className="border p-1 text-center">{r.quantity}</td>
            <td className="border p-1">{r.booking_status}</td>
            <td className="border p-1">{r.guest_name || r.guest_email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 