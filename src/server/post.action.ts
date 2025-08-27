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

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error(' Failed to fetch posts:', error);
    throw new Error('Unable to fetch posts');
  }
};
