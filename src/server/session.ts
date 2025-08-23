import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type ProtectOptions = {
  requireAuth?: boolean;
  redirectTo?: string;
};

export async function protectRoute({ requireAuth, redirectTo }: ProtectOptions) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (requireAuth && !session) {
    redirect(redirectTo || '/login');
  }

  if (!requireAuth && session) {
    redirect(redirectTo || '/');
  }

  return session;
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
