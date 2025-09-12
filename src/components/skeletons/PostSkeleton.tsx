import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function PostSkeleton() {
  return (
    <Card role="status" className="bg-background w-full">
      <CardContent>
        {/* USER INFO */}
        <div className="flex items-center gap-5">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="w-60 h-4" />
        </div>

        {/* POST CONTENT */}
        <div className="flex items-start flex-col mt-5 space-y-7">
          <div className="space-y-3 w-full">
            <Skeleton className="w-1/1 h-4" />
            <Skeleton className="w-70 h-4" />
          </div>
          <Skeleton className="w-1/1 h-100" />
        </div>

        {/* POST ACTIONS */}
        <div className="flex items-start gap-5 mt-5">
          <Skeleton className="w-10 h-4" />
          <Skeleton className="w-10 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default PostSkeleton;
