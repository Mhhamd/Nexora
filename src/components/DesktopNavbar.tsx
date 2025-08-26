'use client';
import { BellIcon, HomeIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import ModeToggle from './ModeToggle';
import { Button } from './ui/button';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function DesktopNavbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  return (
    <div className="sm:flex items-center gap-5 hidden">
      <ModeToggle />

      <Button variant={'ghost'} className="cursor-pointer" asChild>
        <Link href={'/'}>
          <HomeIcon />
          <span className="lg:inline hidden">Home</span>
        </Link>
      </Button>

      {isAuthenticated && user ? (
        <>
          <Button variant={'ghost'} className="cursor-pointer" asChild>
            <Link href={'/notifications'}>
              <BellIcon />
              <span className="lg:inline hidden">Notifications</span>
            </Link>
          </Button>

          <UserMenu user={user} />
        </>
      ) : (
        <>
          <Button variant={'default'} className="cursor-pointer" asChild>
            <Link href={`/login`} prefetch>
              <LogInIcon />
              <span className="lg:inline hidden">Login</span>
            </Link>
          </Button>
          <Button variant={'secondary'} className="cursor-pointer" asChild>
            <Link href={`/sign-up`} prefetch>
              <UserPlusIcon />
              <span className="lg:inline hidden">Sign up</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default DesktopNavbar;
