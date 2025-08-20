'use server';

import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return { success: true, message: 'Signed up successfully' };
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
    });
    return { success: true, message: 'Signed in successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
