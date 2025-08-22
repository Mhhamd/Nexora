import { BellIcon, HomeIcon, LogOutIcon, User } from 'lucide-react';
import ModeToggle from './ModeToggle';
import { Button } from './ui/button';
import Link from 'next/link';
import { getSession } from '@/server/session';
import { logOut } from '@/server/user';

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

          <Button variant={'ghost'} className="cursor-pointer" asChild>
            <Link href={`/profile`}>
              <User />
              <span className="lg:inline hidden">Profile</span>
            </Link>
          </Button>
          <form action={logOut}>
            <Button variant={'secondary'} className="cursor-pointer">
              <LogOutIcon />
              <span className="lg:inline hidden">Logout</span>
            </Button>
          </form>
          {/* TODO: Add user menu */}
        </>
      ) : (
        <>
          <Button variant={'default'} className="cursor-pointer" asChild>
            <Link href={`/login`}>
              <span className="lg:inline hidden">Login</span>
            </Link>
          </Button>
          <Button variant={'secondary'} className="cursor-pointer" asChild>
            <Link href={`/sign-up`}>
              <span className="lg:inline hidden">Sign up</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default DesktopNavbar;
