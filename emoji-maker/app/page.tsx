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
      };
      setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
    } catch (error) {
      console.error('Error generating emoji:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🤖 Emoji maker</h1>
      <EmojiForm onGenerate={generateEmoji} />
      {isGenerating && <p>Generating emoji...</p>}
      <EmojiGrid emojis={emojis} />
    </main>
  );
}
