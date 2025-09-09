"use client";
import { MessageCircle } from "lucide-react";

function NoChatSelected() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col animate-pulse ">
      <div className="flex items-center gap-2 p-4 bg-background border-b ">
        <MessageCircle className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-gray-800  bg-clip-text text-transparent">
          Nexora
        </h1>
      </div>
      <p className="text-muted-foreground mt-2 ">No chat selected </p>
    </div>
  );
}

export default NoChatSelected;
