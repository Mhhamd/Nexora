"use client";
import { getUserById, getUserPosts, updateProfile } from "@/server/profile.action";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/server/user.action";
import {
  CalendarIcon,
  CameraIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  Loader2Icon,
  MapPinIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

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
    image: user.image || undefined,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const currentUser = authClient.useSession();
  const isOwner = currentUser.data?.user.id === user.id;
  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  const handleEditProfile = async () => {
    if (isEditingProfile) return;
    try {
      setIsEditingProfile(true);

      let uploadedImageUrl = editProfile.image;
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        if (response.status !== 200) {
          toast.error("Failed to upload image");
          return;
        }

        uploadedImageUrl = response.data.secure_url;
      }

      const profileData = new FormData();
      profileData.append("name", editProfile.name);
      profileData.append("bio", editProfile.bio);
      profileData.append("location", editProfile.location);
      profileData.append("website", editProfile.website);
      if (uploadedImageUrl) {
        profileData.append("image", uploadedImageUrl);
      }

      const result = await updateProfile(profileData);
      if (result?.success) {
        setShowEditDialog(false);
        setImagePreview("");
        setImage(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update  profile");
    } finally {
      setIsEditingProfile(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  useEffect(() => {
    if (imagePreview) {
      return () => {
        URL.revokeObjectURL(imagePreview);
      };
    }
  }, [imagePreview]);

  return (
    <div className="w-full sm:px-0 px-5 ">
      <Card className="bg-background w-full sm:w-1/2 mx-auto">
        <CardContent className="flex items-center justify-center flex-col">
          <Avatar className="size-25">
            <AvatarImage src={user.image ?? undefined} alt={user.name + "ProfilePicture"} />
            <AvatarFallback>{user?.name?.[0] || user?.email?.split("@")[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center mt-4">
            <h1 className="font-semibold text-xl ">{user.name}</h1>
            <p className="text-sm text-muted-foreground mt-1"> @{user.email.split("@")[0]}</p>
            <h1 className="my-4">{user.bio || ""}</h1>
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
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="size-4 mr-2" />
              {user.location || "No Location"}
            </div>

            <div className="flex items-center text-muted-foreground">
              <LinkIcon className="size-4 mr-2" />
              <a
                href={user?.website?.startsWith("http") ? user.website : `https://${user.website}`}
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer">
                {user.website || "No Website"}
              </a>
            </div>
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="size-4 mr-2" />
              Joined {formattedDate}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full mt-4 sm:mt-8">
        <TabsList className=" w-full sm:w-2/3 mx-auto flex justify-center items-center border-b rounded-none h-auto p-0 bg-transparent gap-3 sm:gap-5">
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
          <div className="space-y-6 w-full sm:max-w-2/3 mx-auto">
            {posts && posts.length > 0 ? (
              posts?.map((post) => <PostCard post={post} key={post.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="likes" className="mt-6">
          <div className="space-y-6 w-full sm:max-w-2/3 mx-auto">
            {likedPosts && likedPosts.length > 0 ? (
              likedPosts.map((post) => <PostCard post={post} key={post.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No liked posts yet</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex items-center w-full justify-center">
            <input onChange={handleImageChange} type="file" id="image" className="hidden" accept="image/*" />
            <label
              htmlFor="image"
              className="hover:opacity-50 cursor-pointer transition-all duration-300 group relative">
              <Avatar className="size-25">
                <AvatarImage src={imagePreview || editProfile.image} alt={editProfile.name} />
                <AvatarFallback>{user?.name?.[0] || user?.email?.split("@")[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CameraIcon color="white" />
              </div>
            </label>
          </div>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={editProfile.name}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={editProfile.bio}
                onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                className="min-h-[100px]"
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                name="location"
                value={editProfile.location}
                onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                placeholder="Where are you based?"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                name="website"
                value={editProfile.website}
                onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                placeholder="Your personal website"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button disabled={isEditingProfile} className="cursor-pointer" variant={"outline"}>
                Close
              </Button>
            </DialogClose>
            <Button disabled={isEditingProfile} className="cursor-pointer" onClick={handleEditProfile}>
              {isEditingProfile ? (
                <>
                  <Loader2Icon size={16} className="animate-spin" /> Updating
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePageClient;
