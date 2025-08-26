import CreatePost from '@/components/CreatePost';

export default async function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-5 w-full px-2 sm:w-2/3">
      <CreatePost />
      Posts
    </div>
  );
}
