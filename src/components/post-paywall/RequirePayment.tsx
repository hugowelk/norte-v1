import { Navigate } from 'react-router-dom';
import { hasPaymentSession } from '@/lib/postPaywallStore';

export function RequirePayment({ children }: { children: React.ReactNode }) {
  if (!hasPaymentSession()) return <Navigate to="/" replace />;
  return <>{children}</>;
}
