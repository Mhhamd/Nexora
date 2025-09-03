import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/server/post.action";
import WhoToFollow from "../components/WhoToFollow";

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-center lg:mx-0 mx-auto flex-col gap-5 w-full px-2 sm:w-[620px]">
        <CreatePost />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className=" lg:inline hidden w-2/5 ">
        <WhoToFollow />
      </div>
    </div>
  );
}
