import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/server/post.action";

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="flex items-center justify-center flex-col gap-5 w-full px-2 sm:w-[620px]">
      <CreatePost />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
