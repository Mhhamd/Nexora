'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/sign-up';

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
