'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
  params: { serviceId: string };
}

const tabs = [
  { slug: 'calendar', label: 'Calendar' },
  { slug: 'bookings', label: 'Bookings' },
  { slug: 'blocks', label: 'Blocks' },
];

export default function InventoryServiceLayout({ children, params }: Props) {
  const pathname = usePathname();
  const base = `/inventory/${params.serviceId}`;
  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4 border-b pb-2">
        {tabs.map(tab => (
          <Link
            key={tab.slug}
            href={`${base}/${tab.slug}`}
            className={
              pathname?.startsWith(`${base}/${tab.slug}`)
                ? 'font-semibold border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-gray-800'
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
} 