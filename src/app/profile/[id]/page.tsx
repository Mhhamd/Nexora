import { getUserById, getUserLikedPosts, getUserPosts, isFollowing } from "@/server/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

async function ProfilePageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <div className="flex items-center justify-center ">
      <ProfilePageClient posts={posts} likedPosts={likedPosts} inintalFollowing={isCurrentUserFollowing} user={user} />
    </div>
  );
}

export default ProfilePageServer;
