'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BellIcon, HomeIcon, LogInIcon, LogOutIcon, Menu, Settings, UserIcon, UserPlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import ModeToggle from './ModeToggle';
import { toast } from 'sonner';

function MobileNavbar() {
  const { data } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const closeSheet = () => setIsOpen(false);

  return (
    <div className="sm:hidden flex items-center gap-5">
      <ModeToggle />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={'ghost'} className="cursor-pointer" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>

            <nav className="mt-5 ">
              <Button
                variant="ghost"
                className="flex items-center gap-3 justify-start"
                onClick={closeSheet}
                role="menuitem"
                asChild>
                <Link href="/" prefetch>
                  <HomeIcon size={16} />
                  Home
                </Link>
              </Button>

              {data?.user ? (
                <>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start"
                    onClick={closeSheet}
                    role="menuitem"
                    asChild>
                    <Link href={`/profile/${data.user.email ? data.user.email.split('@')[0] : 'user'}`} prefetch>
                      <UserIcon size={16} />
                      Profile
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start"
                    onClick={closeSheet}
                    role="menuitem"
                    asChild>
                    <Link href="/notifications" prefetch>
                      <BellIcon size={16} />
                      Notifications
                    </Link>
                  </Button>

                  <Button
                    variant={'ghost'}
                    className="flex items-center gap-3 justify-start"
                    onClick={closeSheet}
                    role="menuitem"
                    asChild>
                    <Link href="/settings" className="flex items-center gap-2" prefetch>
                      <Settings size={16} />
                      Settings
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full cursor-pointer"
                    role="menuitem"
                    onClick={async () => {
                      closeSheet();
                      try {
                        await authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              window.location.href = '/login';
                            },
                          },
                        });
                      } catch (error) {
                        console.error('Logout failed', error);
                        toast.error('Failed to log out. Please try again.');
                      }
                    }}>
                    <LogOutIcon size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-start w-full flex-col ">
                  <Button
                    variant={'ghost'}
                    className="flex items-center gap-3 justify-start w-full "
                    onClick={closeSheet}
                    asChild>
                    <Link href={`/login`} prefetch>
                      <LogInIcon />
                      Login
                    </Link>
                  </Button>

                  <Button
                    variant={'ghost'}
                    className="flex items-center gap-3 justify-start w-full"
                    onClick={closeSheet}
                    asChild>
                    <Link href={`/sign-up`} prefetch>
                      <UserPlusIcon />
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
