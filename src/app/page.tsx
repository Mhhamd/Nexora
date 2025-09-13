import CreatePost from "@/components/CreatePost";
import { getPosts } from "@/server/post.action";
import WhoToFollow from "@/components/WhoToFollow";
import LoadMore from "@/components/LoadMore";

export default async function Home() {
  const posts = await getPosts(0);
  const refreshKey = Date.now();

  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-center lg:mx-0 mx-auto flex-col gap-5 w-full px-2 sm:w-[620px]">
        <CreatePost />
        <LoadMore initialPosts={posts} refreshKey={refreshKey} />
      </div>
      <div className=" lg:inline hidden w-2/5 ">
        <WhoToFollow />
      </div>
    </div>
  );
}
