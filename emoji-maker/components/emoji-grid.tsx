import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Download } from 'lucide-react';
import { useState } from 'react';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
}

export function EmojiGrid({ emojis }: { emojis: Emoji[] }) {
  const [likedEmojis, setLikedEmojis] = useState<Record<string, number>>({});

  const handleLike = (id: string) => {
    setLikedEmojis(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDownload = async (url: string, prompt: string) => {
    try {
      // Use the Next.js Image component's loader to get the optimized image URL
      const imageUrl = `/_next/image?url=${encodeURIComponent(url)}&w=256&q=75`;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${prompt}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="group relative">
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={emoji.url}
                alt={emoji.prompt}
                width={256}
                height={256}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-4">
                  <Heart
                    className={`w-8 h-8 cursor-pointer transition-transform active:scale-125 ${
                      likedEmojis[emoji.id] ? 'text-red-500 fill-current' : 'text-white'
                    }`}
                    onClick={() => handleLike(emoji.id)}
                  />
                  <Download
                    className="w-8 h-8 text-white cursor-pointer transition-transform active:scale-125"
                    onClick={() => handleDownload(emoji.url, emoji.prompt)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium">{emoji.prompt}</span>
              <span className="text-sm flex items-center">
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    likedEmojis[emoji.id] ? 'text-red-500 fill-current' : 'text-red-500'
                  }`}
                />
                {likedEmojis[emoji.id] > 0 ? likedEmojis[emoji.id] : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
