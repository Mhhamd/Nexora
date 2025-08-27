'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './user.action';
import { revalidatePath } from 'next/cache';

export const createPost = async (content: string, image: string) => {
  const user = await getCurrentUser();
  if (!user) return;

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      content,
      image,
    },
  });

  revalidatePath('/');
  return { success: true, post };
};
