import { headers } from 'next/headers';
import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function protectRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');
  return session;
}
