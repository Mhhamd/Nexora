"use client";

import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { RootState } from "@/redux/store";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Image, Loader2Icon, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { createPost } from "@/server/post.action";
import { toast } from "sonner";
import axios from "axios";

function CreatePost() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
      formData.append("folder", "posts");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to cloudinary", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setIsLoading(true);
    try {
      let uploadedImageUrl = imageUrl;

      if (image) {
        const url = await uploadToCloudinary(image);
        if (url) {
          setImageUrl(url);
          uploadedImageUrl = url;
        } else {
          setIsLoading(false);
          return;
        }
      }

      const result = await createPost(content, uploadedImageUrl);
      if (result?.success) {
        setContent("");
        setImage(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview("");
        }
        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (user && isAuthenticated) {
    return (
      <Card className="bg-background w-full ">
        <CardContent>
          {/* TODO: Add posting logic */}
          <div className="space-x-4 flex">
            <Avatar className="size-10">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.[0] || user.email.split("@")[0] || "U"}</AvatarFallback>
            </Avatar>
            <Textarea
              disabled={isLoading}
              value={content}
              onKeyDown={handleKeyDown}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[70px] resize-none border-none p-0 focus-visible:ring-0 text-base !bg-background pb-5"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between pt-5">
            {/* TODO: Add image upload logic */}
            <div className="flex space-x-2">
              <input ref={fileInputRef} onChange={handleImageChange} type="file" className="hidden" id="image" />
              <Button
                disabled={isLoading}
                variant={"ghost"}
                size={"sm"}
                className="text-muted-foreground hover:text-primary cursor-pointer">
                <label className="cursor-pointer flex items-center gap-2" htmlFor="image">
                  <Image size={16} />
                  Photo
                </label>
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!content.trim() && !image)}
                className="cursor-pointer">
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" size={16} />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
          {imagePreview && image?.type.startsWith("image/") && (
            <div className="mt-2 relative inline-block">
              <img className="w-30 rounded-md" src={imagePreview} alt={image?.name} />
              <Button
                onClick={removeImage}
                variant={"secondary"}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full cursor-pointer"
                size={"sm"}>
                <X size={10} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

export default CreatePost;
