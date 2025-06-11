'use client';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Image
        src="/images/loading.gif"
        alt="Loading..."
        width={128}
        height={128}
        priority
      />
    </div>
  );
} 