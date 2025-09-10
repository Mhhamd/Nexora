"use client";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getMutualFollowers } from "@/server/user.action";
import { toast } from "sonner";
import UsersSidebarSkeleton from "./skeletons/UsersSidebarSkeleton";

type Users = Awaited<ReturnType<typeof getMutualFollowers>>;

function UsersSidebar() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getMutualFollowers();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch mutual followers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, isAuthenticated]);

  if (!user || !isAuthenticated) return null;

  return (
    <Card className="bg-background w-full h-full rounded-tr-none rounded-br-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div>
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name || user.email || "User"} />
              <AvatarFallback>{user.name?.[0] || user.email?.split("@")[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email.split("@")[0]}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-0">
        <ScrollArea className="h-[500px]">
          {isLoading ? (
            <UsersSidebarSkeleton />
          ) : users && users.length > 0 ? (
            <>
              {users.map((u) => (
                <Button
                  key={u.id}
                  variant="ghost"
                  className="flex items-center justify-start gap-3 py-7 mb-3 cursor-pointer hover:bg-muted w-full">
                  <div>
                    <Avatar>
                      <AvatarImage src={u.image ?? undefined} alt={u.name || u.email || "User"} />
                      <AvatarFallback>{u.name?.[0] || u.email?.split("@")[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h1>{u.name}</h1>
                </Button>
              ))}
            </>
          ) : (
            <p className="text-muted-foreground px-4">No mutual followers found</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default UsersSidebar;
