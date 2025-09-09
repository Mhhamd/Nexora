"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "./session";
import { revalidatePath } from "next/cache";

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
      followers: {
        select: {
          followerId: true,
          followingId: true,
        },
      },
      following: {
        select: {
          followerId: true,
          followingId: true,
        },
      },
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

export async function toggleFollow(targetId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    if (user.id === targetId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: user.id,
            followingId: targetId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            creatorId: user.id,
            userId: targetId,
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error in handleFollow:", error);
    return { success: false };
  }
}

export async function getRandomUsers() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: user.id } },

          {
            NOT: {
              following: {
                some: {
                  followerId: user.id,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        image: true,
        email: true,
        name: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.error("Error in get randomUsers:", error);
    return [];
  }
}

export async function getMutualFollowers() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const mutualFollowers = await prisma.user.findMany({
      where: {
        AND: [
          {
            following: {
              some: {
                followerId: user.id,
              },
            },
          },
          {
            followers: {
              some: {
                followingId: user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });
    return mutualFollowers;
  } catch (error) {
    console.error("Error getting mutual followers: ", error);
  }
}
