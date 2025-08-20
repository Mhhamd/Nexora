import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function protectRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');
  return session;
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
