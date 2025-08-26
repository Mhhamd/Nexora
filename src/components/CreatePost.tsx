'use client';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { RootState } from '@/redux/store';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Image, Send } from 'lucide-react';
import { Button } from './ui/button';

function CreatePost() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

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
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none border-none p-0 focus-visible:ring-0 text-base !bg-background"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-5">
            {/* TODO: Add image upload logic */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={'ghost'}
                size={'sm'}
                className="text-muted-foreground hover:text-primary cursor-pointer">
                <Image size={16} />
                Photo
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button className="cursor-pointer">
                <Send size={16} />
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default CreatePost;
