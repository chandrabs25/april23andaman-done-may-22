'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, UsersIcon, PhoneIcon, MailIcon, UserIcon, AlertCircle } from 'lucide-react';
import {
  neutralBgLight, neutralText, neutralTextLight, infoBg, infoBorder, infoText, infoIconColor,
  successBg, successBorder, successText, successIconColor,
  errorBg, errorBorder, errorText, errorIconColor,
  inputBaseStyle, labelBaseStyle, buttonPrimaryStyle, buttonSecondaryStyleHero,
} from '@/styles/26themeandstyle';

interface ServiceDetails {
  id: number;
  name: string;
  description?: string;
  type: string;
  price: number;
  availability?: any;
}

interface UserProps {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
}

interface Props {
  service: ServiceDetails;
  user: UserProps | null;
}

export function ServiceBookingForm({ service, user }: Props) {
  const router = useRouter();

  const [serviceDate, setServiceDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  // guest info
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');

  // hold state
  const [sessionId, setSessionId] = useState('');
  const [holdId, setHoldId] = useState<number | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [holdRemaining, setHoldRemaining] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'unavailable' | 'held' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSessionId(`service_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  }, []);

  // countdown effect
  useEffect(() => {
    if (!holdExpiresAt) return;
    const intId = setInterval(() => {
      const now = new Date();
      const diff = holdExpiresAt.getTime() - now.getTime();
      setHoldRemaining(Math.max(diff, 0));
      if (diff <= 0) {
        setHoldId(null);
        setHoldExpiresAt(null);
        setAvailabilityStatus(null);
        setError('Your hold has expired. Please check availability again.');
      }
    }, 1000);
    return () => clearInterval(intId);
  }, [holdExpiresAt]);

  const totalAmount = service.price * quantity;

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const validate = () => {
    const errs: string[] = [];
    if (!serviceDate) errs.push('Date is required');
    if (quantity < 1) errs.push('Quantity must be at least 1');
    if (!guestName.trim()) errs.push('Guest name required');
    if (!guestEmail.trim()) errs.push('Guest email required');
    if (!guestPhone.trim()) errs.push('Guest phone required');
    return errs;
  };

  const checkAvailabilityAndHold = async (): Promise<boolean> => {
    setAvailabilityStatus('checking');
    try {
      const res = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'service',
          service_id: service.id,
          start_date: serviceDate,
          end_date: serviceDate,
          required_capacity: quantity,
        }),
      });
      const data = await res.json() as { available: boolean; message?: string };
      if (!data.available) {
        setAvailabilityStatus('unavailable');
        setError(data.message || 'Service not available for selected date/quantity.');
        return false;
      }
      // create hold
      const holdRes = await fetch('/api/bookings/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: user?.id || null,
          hold_type: 'service',
          service_id: service.id,
          hold_date: serviceDate,
          quantity,
          hold_price: totalAmount,
          expires_in_minutes: 15,
        }),
      });
      const holdData = await holdRes.json() as { success: boolean; hold_id?: number; expires_at?: string; message?: string };
      if (holdData.success && holdData.hold_id !== undefined) {
        setHoldId(holdData.hold_id);
        if (holdData.expires_at) setHoldExpiresAt(new Date(holdData.expires_at));
        setAvailabilityStatus('held');
        return true;
      }
      setAvailabilityStatus('unavailable');
      setError(holdData.message || 'Failed to create hold.');
      return false;
    } catch (e) {
      console.error(e);
      setAvailabilityStatus('unavailable');
      setError('Availability check failed.');
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    if (errs.length) {
      setError(errs.join(', '));
      return;
    }
    if (!holdId) {
      const ok = await checkAvailabilityAndHold();
      if (!ok) return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings/initiate-payment/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdId,
          sessionId,
          userId: user?.id || null,
          guestDetails: { name: guestName, email: guestEmail, mobileNumber: guestPhone },
          quantity,
          specialRequests: undefined,
          // fallback data (in case hold fails)
          serviceId: service.id,
          serviceDate,
          totalAmount,
        }),
      });
      const data = await res.json() as { success: boolean; redirectUrl?: string; message?: string };
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className={`p-3 rounded ${errorBg} border ${errorBorder} text-sm ${errorText}`}>{error}</div>}

      {/* Date */}
      <div>
        <label className={`${labelBaseStyle} flex items-center`}><CalendarIcon size={14} className="mr-2"/> Date *</label>
        <input type="date" className={inputBaseStyle} value={serviceDate} onChange={e=>setServiceDate(e.target.value)} min={minDate()} required/>
      </div>
      {/* Quantity */}
      <div>
        <label className={`${labelBaseStyle} flex items-center`}><UsersIcon size={14} className="mr-2"/> Quantity *</label>
        <input type="number" className={inputBaseStyle} value={quantity} min={1} onChange={e=>setQuantity(parseInt(e.target.value))} required/>
      </div>

      {/* Guest info */}
      <div>
        <label className={`${labelBaseStyle} flex items-center`}><UserIcon size={14} className="mr-2"/> Name *</label>
        <input className={inputBaseStyle} value={guestName} onChange={e=>setGuestName(e.target.value)} required/>
      </div>
      <div>
        <label className={`${labelBaseStyle} flex items-center`}><MailIcon size={14} className="mr-2"/> Email *</label>
        <input type="email" className={inputBaseStyle} value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} required/>
      </div>
      <div>
        <label className={`${labelBaseStyle} flex items-center`}><PhoneIcon size={14} className="mr-2"/> Phone *</label>
        <input className={inputBaseStyle} value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} required/>
      </div>

      {/* Summary */}
      <div className={`${infoBg} border ${infoBorder} p-4 rounded`}>Total: <span className={`font-bold ${successText}`}>₹{totalAmount.toLocaleString('en-IN')}</span></div>

      {/* Availability/hold info */}
      {availabilityStatus && (
        <div className={`p-3 rounded border mt-2 ${availabilityStatus==='held'?successBorder:availabilityStatus==='unavailable'?errorBorder:infoBorder} text-sm`}>
          {availabilityStatus==='checking' && 'Checking availability...'}
          {availabilityStatus==='available' && 'Available'}
          {availabilityStatus==='held' && (
            <span className={`${successText}`}>Held for {Math.floor(holdRemaining/60000)}:{String(Math.floor((holdRemaining%60000)/1000)).padStart(2,'0')}</span>
          )}
          {availabilityStatus==='unavailable' && <span className={`${errorText}`}>Unavailable</span>}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className={`${buttonPrimaryStyle}`}>{isSubmitting?'Processing...':'Pay & Confirm'}</button>
      <button type="button" onClick={()=>router.back()} className={`${buttonSecondaryStyleHero}`}>Cancel</button>
    </form>
  );
} 