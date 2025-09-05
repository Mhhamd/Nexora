"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOutIcon, Settings } from "lucide-react";
import { logOut } from "@/server/auth";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/slices/userSlice";

type SessionData = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function UserMenu({ user }: SessionData) {
  const dispatch = useDispatch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="cursor-pointer flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.[0] || user.email?.split("@")[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="lg:inline hidden">{user.name || user.email?.split("@")[0] || "User"}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 space-y-2">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image ?? undefined} alt={user.name || user.email || "User"} />
            <AvatarFallback>{user.name?.[0] || user.email?.split("@")[0] || "U"}</AvatarFallback>
          </Avatar>
          <span>{user.name || user.email || "User"}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`} className="flex items-center gap-2 cursor-pointer">
            <User size={4} />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            onClick={async () => {
              await logOut();
              dispatch(clearUser());
              window.location.href = "/";
            }}
            variant="ghost"
            className="w-full justify-start flex items-center gap-2 cursor-pointer">
            <LogOutIcon size={4} />
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
