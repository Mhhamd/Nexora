import { BellIcon, HomeIcon, User } from 'lucide-react';
import ModeToggle from './ModeToggle';
import { Button } from './ui/button';
import Link from 'next/link';

function DesktopNavbar() {
  return (
    <div className="sm:flex items-center gap-5 hidden">
      <ModeToggle />

      <Button variant={'ghost'} className="cursor-pointer" asChild>
        <Link href={'/'}>
          <HomeIcon />
          <span className="lg:inline hidden">Home</span>
        </Link>
      </Button>

      {/* TODO: Render only if there's a user */}
      <Button variant={'ghost'} className="cursor-pointer" asChild>
        <Link href={'/notifications'}>
          <BellIcon />
          <span className="lg:inline hidden">Notifications</span>
        </Link>
      </Button>

      {/* PROFILE */}
      <Button variant={'ghost'} className="cursor-pointer" asChild>
        <Link href={`/profile`}>
          <User />
          <span className="lg:inline hidden">Profile</span>
        </Link>
      </Button>
    </div>
  );
}

export default DesktopNavbar;
