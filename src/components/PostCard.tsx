"use client";
import { deletePost, getPosts, toggleLike } from "@/server/post.action";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Heart, MessageCircleIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteAlertDialog from "./DeleteAlertDialog";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post }: { post: Post }) {
  const session = authClient.useSession();
  const isOwner = session.data?.user.id === post.authorId;
  const [isLiked, setIsLiked] = useState(post.likes.some((like) => like.userId === session.data?.user.id));
  const [isLiking, setIsLiking] = useState(false);
  const [likes, setLikes] = useState(post._count.likes);
  const [comments] = useState(post._count.comments);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.some((like) => like.userId === session.data?.user.id));
  }, [post.likes, session.data?.user.id]);

  const handleLike = async () => {
    if (isLiking || !session.data?.user) {
      toast.warning("Sign in to like this content");
      return;
    }
    try {
      setIsLiking(true);
      setIsLiked((prev) => !prev);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setIsLiked(false);
      setIsLiked(post.likes.some((like) => like.userId === session.data?.user.id));
      setLikes(post._count.likes);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result?.success) toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card className="w-full bg-background">
      <CardContent className="px-4">
        {/* Post Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 w-full">
            <Link
              className="flex items-center gap-2 truncate"
              href={`/profile/${post.author.email.split("@")[0]}`}
              prefetch>
              <Avatar>
                <AvatarImage src={post.author.image ?? undefined} alt={post.author.name || "User"} />
                <AvatarFallback>{post.author.name?.[0] || post.author.email?.split("@")[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="truncate">{post.author.name?.split(" ")[0]}</span>
            </Link>

            <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base truncate">
              <Link href={`/profile/${post.author.email.split("@")[0]}`} className="truncate">
                @{post.author.email?.split("@")[0]}
              </Link>
              <span className="hidden sm:inline">•</span>
              <span className="truncate">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          {isOwner && <DeleteAlertDialog isDeleting={isDeleting} handleDelete={handleDelete} />}
        </div>

        {/* Post Content */}
        <div className="flex flex-col items-start gap-4 w-full mt-4">
          {post.content && <p className="ml-3">{post.content}</p>}
          {post.image && (
            <Image className="w-full h-full rounded-lg" width={1200} height={800} src={post.image} alt={post.image} />
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-start gap-4 mt-4">
          <Tooltip delayDuration={800}>
            <TooltipTrigger asChild>
              <Button
                onClick={handleLike}
                variant={"ghost"}
                className={`cursor-pointer text-muted-foreground gap-2 ${
                  isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                }`}>
                {isLiked ? <Heart className="size-5 fill-current" /> : <Heart className="size-5" />}
                <span>{likes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Like</p>
            </TooltipContent>
          </Tooltip>

          <Button variant={"ghost"} className={`cursor-pointer text-muted-foreground gap-2`}>
            <MessageCircleIcon className="size-5" />
            <span>{comments}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
