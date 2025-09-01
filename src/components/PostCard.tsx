"use client";
import { createComment, deletePost, getPosts, toggleLike } from "@/server/post.action";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Heart, Loader2Icon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteAlertDialog from "./DeleteAlertDialog";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post }: { post: Post }) {
  const session = authClient.useSession();
  const isOwner = session.data?.user.id === post.authorId;
  const [isLiked, setIsLiked] = useState(post.likes.some((like) => like.userId === session.data?.user.id));
  const [isLiking, setIsLiking] = useState(false);
  const [likes, setLikes] = useState(post._count.likes);
  const [comments, setComments] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setIsLiked(post.likes.some((like) => like.userId === session.data?.user.id));
  }, [post.likes, session.data?.user.id]);

  useEffect(() => {
    setComments(post._count.comments);
  }, [post.comments]);

  const handleLike = async () => {
    if (isLiking) return;
    if (!session.data?.user) toast.warning("Sign in to like this content");

    try {
      setIsLiking(true);
      setIsLiked((prev) => !prev);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
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

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
        setComments((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardContent className="px-4 sm:px-6">
        {/* Post Header */}
        <div className="flex items-start gap-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full min-w-0">
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
          {isOwner && (
            <div className="flex-shrink-0">
              <DeleteAlertDialog isDeleting={isDeleting} handleDelete={handleDelete} />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="flex flex-col items-start gap-4 w-full mt-4">
          {post.content && <p className="ml-3">{post.content}</p>}
          {post.image && (
            <Image
              placeholder="blur"
              blurDataURL={post.image}
              className="w-full h-full rounded-lg"
              width={1200}
              height={800}
              src={post.image}
              alt={post.image}
            />
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
          <Tooltip delayDuration={800}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowComments(!showComments)}
                variant={"ghost"}
                className={`cursor-pointer text-muted-foreground gap-2 hover:text-blue-500`}>
                <MessageCircleIcon className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`} />
                <span>{comments}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comments</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-4">
            <Separator className="my-4" />
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 mb-4">
                  <Link href={`/profile/${comment.author.email.split("@")[0]}`}>
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={comment.author.image ?? undefined} alt={comment.author?.name || "User"} />
                      <AvatarFallback>{comment.author?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
                      <div className="flex items-center gap-x-2">
                        <Link
                          href={`/profile/${comment.author.email.split("@")[0]}`}
                          className="font-medium text-sm truncate">
                          {comment.author.name || "Unknown"}
                        </Link>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <Link
                        href={`/profile/${comment.author.email.split("@")[0]}`}
                        className="text-sm text-muted-foreground truncate hidden sm:inline">
                        @{comment.author.email.split("@")[0]}
                      </Link>
                      <span className="text-sm text-muted-foreground hidden sm:inline">·</span>
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm break-all mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm mt-3 ml-3">No comments yet</p>
            )}
            {session.data?.user && (
              <div className="flex items-start gap-3 mt-4">
                <Avatar className="size-8 flex-shrink-0">
                  <AvatarImage src={session.data?.user.image ?? undefined} alt={session.data?.user.name} />
                  <AvatarFallback>{session.data?.user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    disabled={isCommenting}
                    value={newComment}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handleComment}
                      disabled={isCommenting || !newComment.trim()}
                      size="sm"
                      className="flex items-center gap-2 cursor-pointer">
                      {isCommenting ? (
                        <>
                          <Loader2Icon className="animate-spin" size={16} />
                          Posting...
                        </>
                      ) : (
                        <>
                          <SendIcon size={16} />
                          Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;
