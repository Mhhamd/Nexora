"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return { success: true, message: "Signed up successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
    revalidatePath("/", "layout");

    return { success: true, message: "Signed in successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};
