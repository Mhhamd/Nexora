import { Skeleton } from "@/components/ui/skeleton";

function UsersSidebarSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className="space-y-4 md:space-y-7 px-4">
      {skeletonItems.map((i) => {
        return (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 md:w-2/3 lg:w-1/2" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UsersSidebarSkeleton;
