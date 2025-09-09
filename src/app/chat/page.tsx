import Chatbox from "@/components/Chatbox";
import UsersSidebar from "@/components/UsersSidebar";
import { protectRoute } from "@/server/session";

export default async function ChatPage() {
  await protectRoute({
    requireAuth: true,
    redirectTo: "/login",
  });

  /* TODO: Get the chat when the user clicks on a user */
  /* TODO: order the chat by "UpdatedAt" */
  /* TODO: Add realtime */
  return (
    <div className="max-w-7xl mx-auto p-10 flex items-start h-[90vh] max-h-[90vh]">
      <div className="w-64 flex-shrink-0 md:w-80 lg:w-96 h-full">
        <UsersSidebar />
      </div>
      <div className="flex-1 border rounded-tr-2xl rounded-br-2xl h-full">
        <Chatbox />
      </div>
    </div>
  );
}
