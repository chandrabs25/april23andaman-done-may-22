'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Props {
  params: { serviceId: string };
}

export default function CalendarPage({ params }: Props) {
  const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(addDays(new Date(), 29), 'yyyy-MM-dd'));

  const { data, status, error, isLoading } = useFetch<any[]>(
    `/api/vendor/inventory/calendar?serviceId=${params.serviceId}&from=${from}&to=${to}`
  );

  // Quick date range presets
  const setDateRange = (days: number) => {
    const start = new Date();
    const end = addDays(start, days);
    setFrom(format(start, 'yyyy-MM-dd'));
    setTo(format(end, 'yyyy-MM-dd'));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Availability Calendar</h2>
        
        {/* Date Range Controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setDateRange(6)} 
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              7 Days
            </button>
            <button 
              onClick={() => setDateRange(29)} 
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              30 Days
            </button>
            <button 
              onClick={() => setDateRange(89)} 
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              90 Days
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="from-date">From:</label>
            <input 
              id="from-date"
              type="date" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <label htmlFor="to-date">To:</label>
            <input 
              id="to-date"
              type="date" 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin mr-2" /> Loading availability data…
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          <strong>Error:</strong> {error?.message}
        </div>
      )}
      
      {status === 'success' && data && <AvailabilityTable rows={data} />}
    </div>
  );
}

function AvailabilityTable({ rows }: { rows: any[] }) {
  if (rows.length === 0) return <p>No data available for the selected date range.</p>;
  
  // Group by date -> room types for complete table
  const dates = Array.from(new Set(rows.map(r => r.date))).sort();
  const roomTypes = Array.from(new Set(rows.map(r => r.room_type)));

  // Function to get availability status color
  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'bg-red-100 text-red-800'; // Fully booked
    if (percentage < 25) return 'bg-orange-100 text-orange-800'; // Low availability
    if (percentage < 50) return 'bg-yellow-100 text-yellow-800'; // Medium availability
    return 'bg-green-100 text-green-800'; // High availability
  };

  // Function to format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return `${dateStr} (Today)`;
    if (dateStr === tomorrow.toISOString().split('T')[0]) return `${dateStr} (Tomorrow)`;
    return dateStr;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-3 text-left font-semibold">Date</th>
            {roomTypes.map(rt => (
              <th key={rt} className="border p-3 text-center font-semibold">{rt}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date} className="hover:bg-gray-50">
              <td className="border p-3 whitespace-nowrap font-medium">
                {formatDate(date)}
              </td>
              {roomTypes.map(rt => {
                const rec = rows.find(r => r.date === date && r.room_type === rt);
                return (
                  <td key={rt} className="border p-3 text-center">
                    {rec ? (
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getAvailabilityColor(rec.available_rooms, rec.total_rooms)}`}>
                          {rec.available_rooms}/{rec.total_rooms}
                        </span>
                        {rec.booked_rooms > 0 && (
                          <div className="text-xs text-gray-600">
                            {rec.booked_rooms} booked
                          </div>
                        )}
                        {rec.blocked_rooms > 0 && (
                          <div className="text-xs text-gray-600">
                            {rec.blocked_rooms} blocked
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          ₹{rec.current_price}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>High Availability (50%+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>Medium Availability (25-49%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span>Low Availability (1-24%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>Fully Booked (0%)</span>
        </div>
      </div>
    </div>
  );
} 