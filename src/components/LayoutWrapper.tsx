'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { getCurrentUser } from '@/server/user.action';
import { setUser } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const hideLayout = pathname === '/login' || pathname === '/sign-up';

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const fetchedUser = await getCurrentUser();
        if (fetchedUser) {
          dispatch(setUser(fetchedUser));
        }
      }
    };

    fetchUser();
  }, [dispatch, user]);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <main className="py-8 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-3">
          <Sidebar />
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </main>
  );
}
