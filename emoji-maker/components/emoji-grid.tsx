import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Download, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
}

export function EmojiGrid({ emojis }: { emojis: Emoji[] }) {
  const [likedEmojis, setLikedEmojis] = useState<Record<string, number>>({});
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedEmoji(null);
      }
    };

    if (selectedEmoji) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedEmoji]);

  return (
    <>
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
                    <Maximize2
                      className="w-8 h-8 text-white cursor-pointer transition-transform active:scale-125"
                      onClick={() => setSelectedEmoji(emoji)}
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

      {selectedEmoji && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card 
            ref={modalRef}
            className="max-w-2xl w-full bg-white border-2 border-gray-300"
          >
            <CardContent className="p-4">
              <div className="relative">
                <Image
                  src={selectedEmoji.url}
                  alt={selectedEmoji.prompt}
                  width={512}
                  height={512}
                  className="w-full h-auto rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                  onClick={() => setSelectedEmoji(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-medium">{selectedEmoji.prompt}</span>
                <span className="text-lg flex items-center">
                  <Heart
                    className={`w-6 h-6 mr-2 ${
                      likedEmojis[selectedEmoji.id] ? 'text-red-500 fill-current' : 'text-red-500'
                    }`}
                  />
                  {likedEmojis[selectedEmoji.id] > 0 ? likedEmojis[selectedEmoji.id] : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
