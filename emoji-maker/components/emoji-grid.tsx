import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"

interface Emoji {
  id: string;
  url: string;
  prompt: string;
}

interface EmojiGridProps {
  emojis: Emoji[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  useEffect(() => {
    // Any side effects or state updates should go here
  }, [emojis]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {emojis.map((emoji) => (
        <Card key={emoji.id}>
          <CardContent className="p-4">
            <Image
              src={emoji.url}
              alt={emoji.prompt}
              width={256}
              height={256}
              className="w-full h-auto"
            />
            <p className="mt-2 text-sm text-gray-600">{emoji.prompt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
