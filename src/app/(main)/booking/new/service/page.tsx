'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { ServiceBookingForm } from '@/components/services/ServiceBookingForm';
import { AlertTriangle, ArrowLeft, InfoIcon } from 'lucide-react';
import {
  neutralBgLight, sectionPadding, infoText, infoIconColor,
  errorBg, errorBorder, errorText, cardBaseStyle, sectionHeadingStyle,
  buttonPrimaryStyle,
} from '@/styles/26themeandstyle';

interface ServiceDetails {
  id: number;
  name: string;
  description?: string;
  price: number;
  type: string;
  images?: string[];
}

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Image src="/images/loading.gif" alt="Loading" width={128} height={128} className="mb-5" />
    <span className={`text-xl ${infoText}`}>{message}</span>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${sectionPadding} ${errorBg} border ${errorBorder} text-center`}>
    <AlertTriangle className={`w-20 h-20 ${errorText} mb-4`} />
    <p className={`text-2xl font-semibold ${errorText} mb-4`}>{message}</p>
    <Link href="/services" className={buttonPrimaryStyle}><ArrowLeft size={18} className="mr-2"/> Back to Services</Link>
  </div>
);

function ServiceBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const serviceId = searchParams.get('serviceId');
  if (!serviceId) {
    return <ErrorDisplay message="Service ID missing." />;
  }

  const apiUrl = `/api/services-main/${serviceId}`;
  const { data: serviceData, error, status } = useFetch<ServiceDetails>(apiUrl);

  if (authLoading || status === 'loading' || status === 'idle') return <LoadingSpinner message="Loading service details..."/>;
  if (status === 'error' || !serviceData) return <ErrorDisplay message={error?.message || 'Failed to load service.'}/>;

  return (
    <div className={`${neutralBgLight} min-h-screen py-6 ${sectionPadding}`}>
      <div className="container mx-auto max-w-3xl">
        <div className={`${cardBaseStyle} p-6`}>
          <h1 className={`${sectionHeadingStyle} flex items-center text-2xl mb-4`}><InfoIcon size={24} className={`mr-2 ${infoIconColor}`}/> Book {serviceData.name}</h1>
          <ServiceBookingForm service={serviceData} user={user} />
        </div>
      </div>
    </div>
  );
}

export default function ServiceBookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <ServiceBookingPageContent />
    </Suspense>
  );
} 