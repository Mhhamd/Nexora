"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getPosts } from "@/server/post.action";
import PostCard from "./PostCard";
import PostSkeleton from "./skeletons/PostSkeleton";

type Posts = Awaited<ReturnType<typeof getPosts>>;

function LoadMore({ initialPosts, refreshKey = 0 }: { initialPosts: Posts; refreshKey?: number }) {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const loadMorePosts = async () => {
    setIsLoading(true);
    const newPosts = await getPosts(page * 5, 7);
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = newPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
      setPage((prev) => prev + 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialPosts.length > 0 && refreshKey > 0) {
      setPosts((currentPosts) => {
        const currentIds = new Set(currentPosts.map((p) => p.id));
        const newPostsFromServer = initialPosts.filter((newPost) => !currentIds.has(newPost.id));

        if (newPostsFromServer.length > 0) {
          return [...newPostsFromServer, ...currentPosts];
        }

        return currentPosts;
      });
    }
  }, [refreshKey, initialPosts]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMorePosts();
    }
  }, [inView]);

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore ? (
        <div ref={ref} className="w-full">
          {isLoading && (
            <div className="space-y-5">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">You're all caught up.</p>
      )}
    </>
  );
}

export default LoadMore;
