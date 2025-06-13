'use client';
import { useFetch, useSubmit } from '@/hooks/useFetch';
import { Loader2, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

interface Props { params: { serviceId: string }; }
export default function BlocksPage({ params }: Props) {
  const { data, status, error, isLoading } = useFetch<any[]>(`/api/vendor/inventory/adjustments?serviceId=${params.serviceId}`);
  const { submit, status: submitStatus } = useSubmit('/api/vendor/inventory/block');

  const handleUnblock = useCallback(async (id: number) => {
    const res = await submit({}, 'DELETE', `/api/vendor/inventory/block/${id}`);
    if (res.success) {
      // simple refresh
      window.location.reload();
    }
  }, [submit]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Manual Blocks</h2>
      {isLoading && <div className="flex items-center"><Loader2 className="animate-spin mr-2"/>Loading…</div>}
      {status==='error' && <p className="text-red-500">{error?.message}</p>}
      {status==='success' && data && <BlocksTable rows={data} onUnblock={handleUnblock} />}
    </div>
  );
}

function BlocksTable({ rows, onUnblock }: { rows: any[]; onUnblock: (id:number)=>void }) {
  if (!rows || rows.length===0) return <p>No manual blocks.</p>;
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr>
          <th className="border p-1">Date</th>
          <th className="border p-1">Room Type</th>
          <th className="border p-1">Qty</th>
          <th className="border p-1">Reason</th>
          <th className="border p-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r=> (
          <tr key={r.id}>
            <td className="border p-1 whitespace-nowrap">{r.adjustment_date}</td>
            <td className="border p-1">{r.room_type}</td>
            <td className="border p-1 text-center">{r.quantity_change}</td>
            <td className="border p-1">{r.reason}</td>
            <td className="border p-1 text-center">
              <button onClick={()=>onUnblock(r.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 