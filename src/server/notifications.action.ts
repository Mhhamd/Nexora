"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./user.action";

export async function getNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        creator: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
          },
        },

        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },

        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}
