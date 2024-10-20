'use client';

import { useState } from 'react';
import { EmojiForm } from '@/components/emoji-form';
import { EmojiGrid } from '@/components/emoji-grid';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number; // Add this line
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmoji = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      const newEmoji: Emoji = {
        id: Date.now().toString(),
        url: response.data[0].url ?? '', // Use empty string as fallback
        prompt: prompt,
        likes: 0, // Initialize likes to 0
      };
      setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Image AI
      </h1>
      <EmojiForm onGenerate={generateEmoji} />
      {isGenerating && <p>Generating image...</p>}
      <EmojiGrid emojis={emojis} />
    </main>
  );
}
