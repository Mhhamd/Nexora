"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content: string, image: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content,
        image,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Error in createPost", error);
    return { success: false, error: "Failed to create post" };
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
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
            createdAt: "asc",
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
    console.error(" Failed to fetch posts:", error);
    throw new Error("Unable to fetch posts");
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) return;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId: user.id,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId,
            userId: user.id,
          },
        }),

        ...(post.authorId !== user.id
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: user.id,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
  } catch (error) {
    console.error("Error in toggleLike", error);
    throw new Error("Failed to like post");
  }
};
