import { getCurrentUser } from '@/server/user.action';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(user);
}
