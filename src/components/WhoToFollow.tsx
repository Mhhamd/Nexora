import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getRandomUsers } from "@/server/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const user = await getCurrentUser();
  const randomUsers = await getRandomUsers();
  if (!randomUsers) return;
  if (user && randomUsers?.length > 0) {
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
                    <p className="text-sm text-muted-foreground">{u._count.following} Followers</p>
                  </div>
                </Link>
                <FollowButton userId={u.id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default WhoToFollow;
