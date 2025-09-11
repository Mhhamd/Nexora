"use client";
import { BellIcon, HomeIcon, LogInIcon, Send, UserPlusIcon } from "lucide-react";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getNotifications } from "@/server/notifications.action";
import { usePathname } from "next/navigation";

function DesktopNavbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const pathName = usePathname();

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        if (data) {
          const notificationsNumber = data.filter((n) => !n.read);
          setUnreadNotifications(notificationsNumber.length);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();

    if (pathName === "/notifications") {
      const handleRouteChange = () => fetchNotifications();
      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, [isAuthenticated, user, pathName]);
  return (
    <div className="sm:flex items-center gap-5 hidden">
      <ModeToggle />

      <Button variant={"ghost"} className="cursor-pointer" asChild>
        <Link href={"/"}>
          <HomeIcon />
          <span className="lg:inline hidden">Home</span>
        </Link>
      </Button>

      {isAuthenticated && user ? (
        <>
          <Button variant={"ghost"} className="cursor-pointer relative" asChild>
            <Link href={"/notifications"}>
              <BellIcon />
              <span className="lg:inline hidden">Notifications</span>
              {unreadNotifications !== 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent-foreground size-4 text-xs text-black text-center leading-tight">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          </Button>
          <UserMenu user={user} />
        </>
      ) : (
        <>
          <Button variant={"default"} className="cursor-pointer" asChild>
            <Link href={`/login`} prefetch>
              <LogInIcon />
              <span className="lg:inline hidden">Login</span>
            </Link>
          </Button>
          <Button variant={"secondary"} className="cursor-pointer" asChild>
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
