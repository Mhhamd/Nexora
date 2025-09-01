"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/redux/store";
import { getRandomUsers, toggleFollow } from "@/server/user.action";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

type Users = Awaited<ReturnType<typeof getRandomUsers>>;

function WhoToFollow() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [randomUsers, setRandomUsers] = useState<Users | []>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async (targetId: string) => {
    setIsLoading(true);
    try {
      await toggleFollow(targetId);
      toast.success("User followed successfully");
    } catch (error) {
      console.log("Error while following the user", error);
      toast.error("Error following user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const randomUsers = async () => {
      const users = await getRandomUsers();
      setRandomUsers(users);
    };

    randomUsers();
  }, []);

  if (isAuthenticated && user) {
    return (
      <Card className="bg-background ">
        <CardHeader>
          <CardTitle className="text-xl">Who To Follow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-5 flex-col w-full">
            {randomUsers?.map((u) => (
              <div
                key={u.id}
                className="flex w-full items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                <Link href={`/profile/${u.email?.split("@")[0]}`} className="flex items-center gap-2">
                  <Avatar className="my-5 size-12">
                    <AvatarImage src={u.image ?? undefined} alt={u.name || "User"} />
                    <AvatarFallback>{u.name?.[0] || u.email?.split("@")[0]?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold truncate max-w-[140px]">{u.name || "Unknown User"}</p>
                    <p className="text-muted-foreground text-xs truncate max-w-[140px]">
                      @{u.email?.split("@")[0] || "user"}
                    </p>
                    <p className="text-sm text-muted-foreground">{u._count.followers} Followers</p>
                  </div>
                </Link>
                <Button onClick={() => handleFollow(u.id)} className="cursor-pointer px-6" variant="secondary">
                  {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default WhoToFollow;
