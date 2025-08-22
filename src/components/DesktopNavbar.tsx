import { BellIcon, HomeIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import ModeToggle from './ModeToggle';
import { Button } from './ui/button';
import Link from 'next/link';
import { getSession } from '@/server/session';
import UserMenu from './UserMenu';

async function DesktopNavbar() {
  const session = await getSession();
  return (
    <div className="sm:flex items-center gap-5 hidden">
      <ModeToggle />

      <Button variant={'ghost'} className="cursor-pointer" asChild>
        <Link href={'/'}>
          <HomeIcon />
          <span className="lg:inline hidden">Home</span>
        </Link>
      </Button>

      {session ? (
        <>
          <Button variant={'ghost'} className="cursor-pointer" asChild>
            <Link href={'/notifications'}>
              <BellIcon />
              <span className="lg:inline hidden">Notifications</span>
            </Link>
          </Button>

          <UserMenu user={session.user} />
        </>
      ) : (
        <>
          <Button variant={'default'} className="cursor-pointer" asChild>
            <Link href={`/login`}>
              <LogInIcon />
              <span className="lg:inline hidden">Login</span>
            </Link>
          </Button>
          <Button variant={'secondary'} className="cursor-pointer" asChild>
            <Link href={`/sign-up`}>
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
