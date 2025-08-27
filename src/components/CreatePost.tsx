'use client';

import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { RootState } from '@/redux/store';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Image, Loader2Icon, Send } from 'lucide-react';
import { Button } from './ui/button';
import React, { useState } from 'react';
import { createPost } from '@/server/post.action';
import { toast } from 'sonner';

function CreatePost() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsLoading(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent('');
        setImageUrl('');
        toast.success('Post created successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (user && isAuthenticated) {
    return (
      <Card className="bg-background w-full ">
        <CardContent>
          {/* TODO: Add posting logic */}
          <div className="space-x-4 flex">
            <Avatar className="size-10">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.[0] || user.email.split('@')[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Textarea
              disabled={isLoading}
              value={content}
              onKeyDown={handleKeyDown}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none border-none p-0 focus-visible:ring-0 text-base !bg-background"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-5">
            {/* TODO: Add image upload logic */}
            <div className="flex space-x-2">
              <Button
                disabled={isLoading}
                variant={'ghost'}
                size={'sm'}
                className="text-muted-foreground hover:text-primary cursor-pointer">
                <Image size={16} />
                Photo
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!content.trim() && !imageUrl)}
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
        </CardContent>
      </Card>
    );
  }
}

export default CreatePost;
