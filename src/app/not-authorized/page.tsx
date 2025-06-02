// src/app/not-authorized/page.tsx
import Link from 'next/link';

export default function NotAuthorizedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Access Denied</h1>
      <p>You do not have the necessary permissions to view this page.</p>
      <Link href="/" style={{ marginTop: '20px', textDecoration: 'underline', color: 'blue' }}>
        Go to Homepage
      </Link>
    </div>
  );
}
