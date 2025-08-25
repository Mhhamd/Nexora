'use server';
import { prisma } from '@/lib/prisma';
import { getSession } from './session';

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      website: true,
      location: true,
      bio: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });
  return user;
}
