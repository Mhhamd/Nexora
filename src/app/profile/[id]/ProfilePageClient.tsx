"use client";
import { getUserById, getUserPosts, updateProfile } from "@/server/profile.action";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/server/user.action";
import { CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";

type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type User = Awaited<ReturnType<typeof getUserById>>;

interface UserI {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  inintalFollowing: boolean;
}

function ProfilePageClient({ user, posts, likedPosts, inintalFollowing }: UserI) {
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const currentUser = authClient.useSession();
  const isOwner = currentUser.data?.user.id === user.id;
  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  const handleEditProfile = async () => {
    const formData = new FormData();
    Object.entries(editProfile).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result?.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    } else {
      setShowEditDialog(false);
      toast.error(result?.error);
    }
  };

  const handleFollow = async () => {
    if (isUpdatingFollow) return;
    if (!currentUser.data?.user) {
      toast.warning("Sign in to follow this user");
      return;
    }

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
    } catch (error) {
      console.error("Error in handleFollow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="bg-background w-1/2 mx-auto">
        <CardContent className="flex items-center justify-center flex-col">
          <Avatar className="size-25">
            <AvatarImage src={user.image ?? undefined} alt={user.name + "ProfilePicture"} />
            <AvatarFallback>{user?.name?.[0] || user?.email?.split("@")[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center mt-4">
            <h1 className="font-semibold text-xl ">{user.name}</h1>
            <p className="text-sm text-muted-foreground mt-1"> @{user.email.split("@")[0]}</p>
            <h1 className="mt-4">{user.bio || ""}</h1>
          </div>
          <div className="flex justify-between text-center w-full">
            <div>
              <p className="font-semibold text-lg">{user?._count.followers}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <p className="font-semibold text-lg">{user?._count.following}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <Separator orientation="vertical" />
            <div>
              <p className="font-semibold text-lg">{user._count.posts}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </div>
          {isOwner ? (
            <Button onClick={() => setShowEditDialog(!showEditDialog)} className="w-full mt-7 cursor-pointer">
              <EditIcon className="size-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={inintalFollowing ? "outline" : "default"}
              onClick={handleFollow}
              disabled={isUpdatingFollow}
              className="w-full mt-7 cursor-pointer">
              {inintalFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}

          {/* LOCATION & WEBSITE */}
          <div className="w-full mt-6 space-y-2 text-sm">
            {user.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="size-4 mr-2" />
                {user.location}
              </div>
            )}
            {user.website && (
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="size-4 mr-2" />
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="size-4 mr-2" />
              Joined {formattedDate}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full mt-4 sm:mt-8">
        <TabsList className="w-2/3 mx-auto flex justify-center items-center border-b rounded-none h-auto p-0 bg-transparent gap-3 sm:gap-5">
          <TabsTrigger
            value="posts"
            className="flex items-center cursor-pointer gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent px-4 sm:px-6 py-2 font-semibold text-sm sm:text-base">
            <FileTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Posts
          </TabsTrigger>

          <TabsTrigger
            value="likes"
            className="flex cursor-pointer items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent px-4 sm:px-6 py-2 font-semibold text-sm sm:text-base">
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Likes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="space-y-6 max-w-2/3 mx-auto">
            {posts && posts.length > 0 ? (
              posts?.map((post) => <PostCard post={post} key={post.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="likes" className="mt-6">
          <div className="space-y-6 max-w-2/3 mx-auto">
            {likedPosts && likedPosts.length > 0 ? (
              likedPosts.map((post) => <PostCard post={post} key={post.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No liked posts yet</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* TODO: Add edit profile form and save functionality */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePageClient;
