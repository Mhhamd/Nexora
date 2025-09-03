"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { getCurrentUser } from "@/server/user.action";
import { setUser } from "@/redux/slices/userSlice";

function Sidebar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;
    const updatedUser = async () => {
      const data = await getCurrentUser();
      dispatch(setUser(data));
    };
    updatedUser();
  }, [user?._count.followers, user?._count.following]);
  return (
    <div className="sticky top-25">
      <Card className="bg-background ">
        <CardContent>
          {isAuthenticated ? (
            <div className="flex items-center justify-center flex-col">
              <Link
                className="flex flex-col items-center justify-center w-full"
                href={`/profile/${user?.email.split("@")[0]}`}
                prefetch>
                <Avatar className="size-15 border-2">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.[0] || user?.email?.split("@")[0]}</AvatarFallback>
                </Avatar>

                <div className="mt-4 space-y-1 text-center">
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-center text-muted-foreground">{user?.email.split("@")[0]}</p>
                </div>

                {user?.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}
              </Link>

              <div className="w-full">
                <Separator className="my-4" />

                <div className="flex justify-between text-center">
                  <div>
                    <p className="font-medium">{user?._count.followers}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <p className="font-medium">{user?._count.following}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
                <Separator className="my-4" />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPinIcon className="size-4 mr-2" />
                    {user?.location || "No Location"}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <LinkIcon className="size-4 mr-2" />
                    {user?.website ? (
                      <a href={user?.website} className="hover:underline truncate" target="_blank">
                        {user.website}
                      </a>
                    ) : (
                      "No Website"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col gap-5 text-center">
              <div>
                <h1 className="font-bold text-primary">Welcome Back!</h1>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-5">
                  Login to access your profile and connect with others.
                </p>
                <div className="space-y-3">
                  <Button variant={"ghost"} className="cursor-pointer w-full border" asChild>
                    <Link href={"/login"} prefetch>
                      Login
                    </Link>
                  </Button>
                  <Button variant={"default"} className="cursor-pointer w-full " asChild>
                    <Link href={"sign-up"} prefetch>
                      Sign up
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;
